/**
 * Secure Express Backend API Server for TradeFlow Discovery Operations
 * Port: 3001
 */
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

import { LocalDiskAudioStorage, SupabaseAudioStorage } from './services/storage/audioStorage.js';
import { MockTranscriptionAdapter } from './services/adapters/mockTranscriptionAdapter.js';
import { GoogleChirpAdapter } from './services/adapters/googleChirpAdapter.js';
import { OpenAITranscribeAdapter } from './services/adapters/openAiTranscribeAdapter.js';
import { translateAndNormalize } from './services/translationService.js';
import { extractStructuredEvidence } from './services/extractionService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Configure Storage Provider
const audioStorage = process.env.AUDIO_STORAGE_PROVIDER === 'SupabaseAudioStorage'
  ? new SupabaseAudioStorage()
  : new LocalDiskAudioStorage();

// Configure Transcription Adapter
function getTranscriptionProvider() {
  const provider = process.env.TRANSCRIPTION_PROVIDER || 'MockTranscriptionAdapter';
  if (provider === 'GoogleChirpAdapter') return new GoogleChirpAdapter();
  if (provider === 'OpenAITranscribeAdapter') return new OpenAITranscribeAdapter();
  return new MockTranscriptionAdapter();
}

// Multer in-memory storage for server-side validation before saving to AudioStorage
const upload = multer({
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/wav', 'audio/x-wav', 'audio/mp3', 'audio/mpeg', 'audio/mp4', 'audio/m4a', 'audio/ogg', 'audio/webm'];
    if (allowedTypes.includes(file.mimetype) || file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('INVALID_AUDIO_FORMAT: Only WAV, MP3, M4A, OGG, and WebM audio files are supported.'));
    }
  }
});

// Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'TradeFlow Discovery Operations API',
    timestamp: new Date().toISOString(),
    transcriptionProvider: getTranscriptionProvider().name,
    storageProvider: audioStorage.constructor.name
  });
});

// Audio Upload Endpoint
app.post('/api/audio/upload', upload.single('audioFile'), async (req, res) => {
  try {
    const consent = req.body.recordingConsent === 'true' || req.body.recordingConsent === true;
    if (!consent) {
      return res.status(400).json({
        error: 'CONSENT_REQUIRED',
        message: 'Audio processing is blocked. Explicit recording consent must be granted by participant.'
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'MISSING_FILE', message: 'No audio file provided.' });
    }

    const saved = await audioStorage.saveAudio(req.file.buffer, req.file.mimetype, {
      operatorLanguage: req.body.operatorLanguage || 'AUTO_DETECT'
    });

    res.json({
      success: true,
      storageKey: saved.storageKey,
      fileSize: saved.fileSize,
      mimeType: saved.mimeType,
      consentGranted: true,
      consentTimestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Upload Error:', err.message);
    res.status(500).json({ error: 'UPLOAD_FAILED', message: err.message });
  }
});

// Audio Streaming Endpoint
app.get('/api/audio/stream', async (req, res) => {
  const storageKey = req.query.storageKey;
  if (!storageKey) {
    return res.status(400).send('Missing storageKey');
  }

  try {
    const stream = await audioStorage.getAudioStream(storageKey);
    res.setHeader('Content-Type', 'audio/wav');
    stream.pipe(res);
  } catch (err) {
    res.status(404).send('Audio file not found: ' + err.message);
  }
});

// Transcribe & Extract API Route
app.post('/api/transcribe', upload.single('audioFile'), async (req, res) => {
  try {
    const consent = req.body.recordingConsent === 'true' || req.body.recordingConsent === true;
    if (!consent) {
      return res.status(400).json({
        error: 'CONSENT_REQUIRED',
        message: 'Audio processing is blocked without explicit participant consent.'
      });
    }

    const operatorSelectedLanguage = req.body.operatorLanguage || 'AUTO_DETECT';
    let audioBuffer = req.file ? req.file.buffer : Buffer.from('mock audio content');
    let mimeType = req.file ? req.file.mimetype : 'audio/wav';

    // 1. Storage
    let storageKey = req.body.storageKey;
    if (req.file) {
      const saved = await audioStorage.saveAudio(audioBuffer, mimeType, { operatorLanguage: operatorSelectedLanguage });
      storageKey = saved.storageKey;
    }

    // 2. Transcription
    const provider = getTranscriptionProvider();
    const transcriptionResult = await provider.transcribe(audioBuffer, mimeType, {
      operatorLanguage: operatorSelectedLanguage
    });

    // 3. Translation & Normalization
    const translationResult = await translateAndNormalize(
      transcriptionResult.originalTranscript,
      transcriptionResult.providerDetectedLanguage
    );

    // 4. Structured Extraction
    const extractionResult = await extractStructuredEvidence({
      originalTranscript: transcriptionResult.originalTranscript,
      englishTranslation: translationResult.englishTranslation,
      operatorSelectedLanguage: operatorSelectedLanguage,
      providerDetectedLanguage: transcriptionResult.providerDetectedLanguage,
      codeSwitchingDetected: transcriptionResult.codeSwitchingDetected
    });

    res.json({
      success: true,
      audio_storage_key: storageKey,
      transcription: {
        provider_name: transcriptionResult.providerName,
        model_version: transcriptionResult.modelVersion,
        operator_selected_language: operatorSelectedLanguage,
        provider_detected_language: transcriptionResult.providerDetectedLanguage,
        code_switching_detected: transcriptionResult.codeSwitchingDetected,
        original_transcript: transcriptionResult.originalTranscript,
        english_translation: translationResult.englishTranslation,
        translation_provider: translationResult.translationProvider
      },
      ai_draft_analysis: extractionResult,
      review_state: 'AI_DRAFT'
    });
  } catch (err) {
    console.error('Transcription/Extraction Route Error:', err.message);
    res.status(500).json({ error: 'PROCESSING_FAILED', message: err.message });
  }
});

// Cross-Interview Synthesis Query Endpoint (APPROVED Evidence Only)
app.post('/api/synthesize', (req, res) => {
  const { query, journalEntries = [], participants = [] } = req.body;

  // STRICT FILTER: Approved or Corrected evidence ONLY
  const approvedEntries = journalEntries.filter(j => {
    const reviewState = j.ai_provenance?.human_review?.review_state;
    return reviewState === 'APPROVED' || reviewState === 'CORRECTED';
  });

  const getParticipantName = (pRef) => {
    const p = participants.find(x => x.participant_ref === pRef);
    return p ? p.full_name : pRef;
  };

  if (approvedEntries.length === 0) {
    return res.json({
      query: query,
      approved_evidence_count: 0,
      answer: 'No human-approved discovery evidence is currently available to synthesize for this query. AI synthesis is strictly grounded in approved records only.',
      citations: []
    });
  }

  // Synthesize grounded response
  const citations = approvedEntries.map(e => ({
    journal_id: e.journal_id,
    participant_ref: e.participant_ref,
    participant_name: getParticipantName(e.participant_ref),
    summary: e.raw_response
  }));

  const synthesisAnswer = `Based on ${approvedEntries.length} human-approved discovery evidence entries:\n\n` +
    approvedEntries.map(e => `• **${getParticipantName(e.participant_ref)} (${e.participant_ref})**: ${e.raw_response}`).join('\n');

  res.json({
    query: query,
    approved_evidence_count: approvedEntries.length,
    answer: synthesisAnswer,
    citations: citations
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[TradeFlow API] Express server running securely on http://localhost:${PORT}`);
});
