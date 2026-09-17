export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels = {ELIGIBLE:'Qualified',PENDING_VERIFICATION:'Needs verification',INELIGIBLE:'Outside group',NOT_CONTACTED:'Not contacted',NO_RESPONSE:'No response',REACHED:'Reached',AGREED:'Agreed to interview',DECLINED:'Declined',DISCOVERY_PARTICIPANT:'Enrolled',NOT_ENROLLED:'Not enrolled',WITHDRAWN:'Withdrawn',REPORTED:'Reported by participant',CHECKED:'Checked against a source',ESTIMATED:'Estimate',UNKNOWN:'Unknown',NOT_VERIFIED:'Not checked yet',VERIFIED:'Checked in person / against a document',AUTO_DETECT:'Auto-detect', 'ha-NG':'Hausa','en-NG':'English','pcm-NG':'Nigerian Pidgin',MIXED:'Mixed / code-switched',OTHER:'Other'};
export const label = value => labels[value] || String(value ?? '').replaceAll('_',' ').toLowerCase().replace(/^./, c=>c.toUpperCase());
export function nextAction(p, entries=[]) {
 if(p.contact_outcome==='DECLINED'||p.participation_status==='WITHDRAWN') return {key:'closed',text:'Participation declined. Keep the record; do not schedule an interview.',action:'View history'};
 if(p.eligibility_status==='INELIGIBLE') return {key:'outside',text:'Outside this discovery group. Review the recorded reason.',action:'Review fit'};
 if(p.eligibility_status==='PENDING_VERIFICATION') return {key:'verify',text:p.contact_outcome==='NOT_CONTACTED'?'Contact this person to confirm their role and fit.':'Confirm the outstanding role, scope or authority details.',action:'Check fit / log contact'};
 if(p.contact_outcome!=='AGREED') return {key:'contact',text:'Ask whether they agree to a discovery interview.',action:'Log contact'};
 const reviewed=entries.some(j=>j.participant_ref===p.participant_ref&&['APPROVED','CORRECTED'].includes(j.ai_provenance?.human_review?.review_state));
 if(reviewed) return {key:'evidence',text:'An interview has been reviewed. Read the evidence and identify any follow-up.',action:'Review evidence'};
 return {key:'interview',text:'Qualified and agreed to interview. Record the conversation or upload consented audio.',action:'Start / log interview'};
}
export const pendingPeople=(people,entries=[])=>people.filter(p=>['verify','contact'].includes(nextAction(p,entries).key));
export const lastContact=(ref,entries)=>entries.filter(j=>j.participant_ref===ref).sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp))[0]?.timestamp;
