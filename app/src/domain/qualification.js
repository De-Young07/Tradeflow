/**
 * CD-01 Rule-Based Decision Support Engine
 */
import {
  TARGET_SCOPE,
  CLAIMED_ROLES,
  REFERRAL_TYPES,
  ELIGIBILITY_STATUS,
  EXCLUSION_REASONS
} from './constants.js';

/**
 * Evaluates candidate data against CD-01 locked discovery scope rules
 * Returns system recommendation, list of failed checks, and detailed explanation.
 */
export function evaluateQualification(candidateData = {}) {
  const failed_checks = [];
  let suggested_status = ELIGIBILITY_STATUS.ELIGIBLE;
  let exclusion_reason = EXCLUSION_REASONS.NONE;

  const commodity = (candidateData.commodity || '').trim();
  const geography = candidateData.geography || {};
  const role = candidateData.claimed_role || '';
  const referralType = candidateData.referral_type || '';
  const authority = candidateData.authority_info || {};
  const contactOutcome = candidateData.contact_outcome || '';

  // RULE 1: Target Commodity Match
  const isCommodityMatch = commodity.toLowerCase() === TARGET_SCOPE.COMMODITY.toLowerCase();
  if (!isCommodityMatch) {
    failed_checks.push({
      rule: 'RULE_COMMODITY',
      code: EXCLUSION_REASONS.OUTSIDE_COMMODITY,
      message: `Commodity '${commodity || 'Unspecified'}' is outside discovery scope (Must be '${TARGET_SCOPE.COMMODITY}').`
    });
  }

  // RULE 2: Geographic Scope Boundary Check
  const isStateMatch = (geography.state || '').toLowerCase() === TARGET_SCOPE.STATE.toLowerCase();
  const isTownMatch = (geography.town || '').toLowerCase() === TARGET_SCOPE.TOWN.toLowerCase();
  const isLgaMatch = (geography.lga || '').toLowerCase() === TARGET_SCOPE.LGA.toLowerCase();
  const isWithinFlag = geography.within_discovery_area === true;

  const isGeographyMatch = isStateMatch && (isTownMatch || isLgaMatch || isWithinFlag);
  if (!isGeographyMatch) {
    failed_checks.push({
      rule: 'RULE_GEOGRAPHY',
      code: EXCLUSION_REASONS.OUTSIDE_GEOGRAPHY,
      message: `Geography (${geography.town || 'Unknown town'}, ${geography.state || 'Unknown state'}) is outside Dikko / Niger State area.`
    });
  }

  // RULE 3: Role Match
  const validRoles = [
    CLAIMED_ROLES.PRODUCER,
    CLAIMED_ROLES.RETAIL_PURCHASER,
    CLAIMED_ROLES.RETAIL_APPROVER
  ];

  const isRoleValid = validRoles.includes(role);
  if (!isRoleValid) {
    if (role === CLAIMED_ROLES.TRADER_REFERRAL) {
      failed_checks.push({
        rule: 'RULE_ROLE',
        code: EXCLUSION_REASONS.TRADER_ONLY,
        message: 'Existing agricultural traders provide context/referrals but do NOT automatically qualify as discovery participants.'
      });
    } else {
      failed_checks.push({
        rule: 'RULE_ROLE',
        code: EXCLUSION_REASONS.WRONG_ROLE,
        message: `Claimed role '${role}' is not an actual Tomato Producer or Retail Bulk Purchaser/Approver.`
      });
    }
  }

  // RULE 4: Existing Trader Referral Verification Check
  const isTraderReferral = referralType === REFERRAL_TYPES.EXISTING_TRADER || role === CLAIMED_ROLES.TRADER_REFERRAL;
  const isDirectlyVerified = authority.verification_level === 'VERIFIED' || authority.verification_level === 'CHECKED';

  if (isTraderReferral && !isDirectlyVerified) {
    failed_checks.push({
      rule: 'RULE_REFERRAL',
      code: EXCLUSION_REASONS.REFERRAL_NOT_VERIFIED,
      message: 'Trader referral has not yet been directly verified for participant role and purchasing/production authority.'
    });
  }

  // RULE 5: Retail Purchaser Purchasing Authority Check
  const isRetailRole = role === CLAIMED_ROLES.RETAIL_PURCHASER || role === CLAIMED_ROLES.RETAIL_APPROVER;
  if (isRetailRole) {
    const hasAuthority = authority.stock_control || authority.purchase_approval || authority.spending_authority;
    if (!hasAuthority && authority.verification_level === 'VERIFIED') {
      failed_checks.push({
        rule: 'RULE_AUTHORITY',
        code: EXCLUSION_REASONS.NO_PURCHASE_AUTHORITY,
        message: 'Retail employee does not possess stock control, bulk purchase approval, or spending authority.'
      });
    } else if (!hasAuthority) {
      failed_checks.push({
        rule: 'RULE_AUTHORITY_PENDING',
        code: EXCLUSION_REASONS.NO_PURCHASE_AUTHORITY,
        message: 'Retail purchasing or approval authority has not yet been verified.'
      });
    }
  }

  // RULE 6: Direct Reach / Contact Established
  const isContactMade = contactOutcome === 'REACHED' || contactOutcome === 'AGREED' || contactOutcome === 'DECLINED';

  // EVALUATE FINAL SYSTEM RECOMMENDATION & EXCLUSION REASON
  const fatalExclusions = failed_checks.filter(c =>
    c.code === EXCLUSION_REASONS.OUTSIDE_COMMODITY ||
    c.code === EXCLUSION_REASONS.OUTSIDE_GEOGRAPHY ||
    c.code === EXCLUSION_REASONS.WRONG_ROLE ||
    c.code === EXCLUSION_REASONS.TRADER_ONLY
  );

  const authorityExclusions = failed_checks.filter(c => c.code === EXCLUSION_REASONS.NO_PURCHASE_AUTHORITY);
  const referralPending = failed_checks.filter(c => c.code === EXCLUSION_REASONS.REFERRAL_NOT_VERIFIED);

  if (fatalExclusions.length > 0) {
    suggested_status = ELIGIBILITY_STATUS.INELIGIBLE;
    exclusion_reason = fatalExclusions[0].code;
  } else if (authorityExclusions.length > 0 && authority.verification_level === 'VERIFIED') {
    suggested_status = ELIGIBILITY_STATUS.INELIGIBLE;
    exclusion_reason = EXCLUSION_REASONS.NO_PURCHASE_AUTHORITY;
  } else if (referralPending.length > 0 || authorityExclusions.length > 0 || !isContactMade) {
    suggested_status = ELIGIBILITY_STATUS.PENDING_VERIFICATION;
    exclusion_reason = referralPending.length > 0 ? EXCLUSION_REASONS.REFERRAL_NOT_VERIFIED : EXCLUSION_REASONS.NONE;
  } else {
    suggested_status = ELIGIBILITY_STATUS.ELIGIBLE;
    exclusion_reason = EXCLUSION_REASONS.NONE;
  }

  // Generate Explanation
  let explanation = '';
  if (suggested_status === ELIGIBILITY_STATUS.ELIGIBLE) {
    explanation = 'Candidate satisfies all CD-01 locked discovery scope criteria (Tomatoes, Dikko/Niger area, verified role & authority).';
  } else if (suggested_status === ELIGIBILITY_STATUS.PENDING_VERIFICATION) {
    explanation = `Candidate pending verification: ${failed_checks.map(f => f.message).join(' ')}`;
  } else {
    explanation = `Candidate ineligible for discovery group: ${failed_checks.map(f => f.message).join(' ')}`;
  }

  return {
    suggested_status,
    exclusion_reason,
    failed_checks,
    explanation,
    is_commodity_match: isCommodityMatch,
    is_geography_match: isGeographyMatch,
    is_role_valid: isRoleValid,
    is_trader_referral: isTraderReferral
  };
}
