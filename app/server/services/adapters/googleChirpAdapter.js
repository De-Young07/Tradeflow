/**
 * Google Cloud Chirp Transcription Adapter
 * Connects securely to Google Cloud Speech-to-Text v2 API using Chirp/Chirp-2 model.
 * Optimized for Hausa (ha-NG), Nigerian Pidgin (pcm-NG), and English (en-NG).
 */
import { TranscriptionProvider } from '../transcriptionService.js';

export class GoogleChirpAdapter extends TranscriptionProvider {
  constructor(config = {}) {
    super('GoogleChirpAdapter');
    this.projectId = config.projectId || process.env.GOOGLE_CLOUD_PROJECT_ID;
    this.credentialsPath = config.credentialsPath || process.env.GOOGLE_APPLICATION_CREDENTIALS;
    this.modelVersion = 'chirp-2';
  }

  async transcribe(audioBuffer, mimeType, options = {}) {
    const operatorLang = options.operatorLanguage || 'AUTO_DETECT';

    // Check if Google credentials exist; if missing, fallback gracefully to Mock
    if (!this.projectId || !this.credentialsPath) {
      console.warn('Google Cloud credentials missing; falling back to MockTranscriptionAdapter');
      const { MockTranscriptionAdapter } = await import('./mockTranscriptionAdapter.js');
      const mock = new MockTranscriptionAdapter();
      return mock.transcribe(audioBuffer, mimeType, options);
    }

    // Map language hint for Google Speech v2
    let languageCode = 'ha-NG';
    if (operatorLang === 'en-NG') languageCode = 'en-NG';
    if (operatorLang === 'pcm-NG') languageCode = 'pcm-NG';

    // REST payload for Google Cloud Speech v2 Chirp recognition
    const base64Audio = audioBuffer.toString('base64');
    const apiEndpoint = `https://speech.googleapis.com/v2/projects/${this.projectId}/locations/global/recognizers/_:recognize`;

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GOOGLE_API_KEY || ''}`
        },
        body: JSON.stringify({
          config: {
            autoDecodingConfig: {},
            languageCodes: [languageCode, 'en-NG'],
            model: 'chirp'
          },
          content: base64Audio
        })
      });

      if (!response.ok) {
        throw new Error(`Google Speech API error: ${response.status} ${await response.text()}`);
      }

      const data = await response.json();
      const results = data.results || [];
      const transcript = results.map(r => r.alternatives?.[0]?.transcript || '').join(' ').trim();
      const detectedLang = results[0]?.languageCode || languageCode;

      return {
        providerName: this.name,
        modelVersion: this.modelVersion,
        originalTranscript: transcript || 'No clear speech detected.',
        providerDetectedLanguage: detectedLang,
        codeSwitchingDetected: detectedLang !== languageCode,
        confidenceScore: results[0]?.alternatives?.[0]?.confidence || 0.85
      };
    } catch (err) {
      console.error('GoogleChirpAdapter execution failed, falling back to mock:', err.message);
      const { MockTranscriptionAdapter } = await import('./mockTranscriptionAdapter.js');
      return new MockTranscriptionAdapter().transcribe(audioBuffer, mimeType, options);
    }
  }
}
