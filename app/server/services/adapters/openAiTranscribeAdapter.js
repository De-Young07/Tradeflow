/**
 * OpenAI Whisper Transcription Adapter
 * Connects securely to OpenAI Whisper API (whisper-1 model).
 */
import { TranscriptionProvider } from '../transcriptionService.js';

export class OpenAITranscribeAdapter extends TranscriptionProvider {
  constructor(config = {}) {
    super('OpenAITranscribeAdapter');
    this.apiKey = config.apiKey || process.env.OPENAI_API_KEY;
    this.modelVersion = 'whisper-1';
  }

  async transcribe(audioBuffer, mimeType, options = {}) {
    if (!this.apiKey) {
      console.warn('OpenAI API key missing; falling back to MockTranscriptionAdapter');
      const { MockTranscriptionAdapter } = await import('./mockTranscriptionAdapter.js');
      return new MockTranscriptionAdapter().transcribe(audioBuffer, mimeType, options);
    }

    const formData = new FormData();
    const blob = new Blob([audioBuffer], { type: mimeType });
    formData.append('file', blob, 'audio.wav');
    formData.append('model', 'whisper-1');

    if (options.operatorLanguage && options.operatorLanguage !== 'AUTO_DETECT') {
      const langCode = options.operatorLanguage.split('-')[0]; // 'ha', 'en', 'pcm'
      formData.append('language', langCode);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`OpenAI Whisper API error: ${response.status} ${await response.text()}`);
      }

      const data = await response.json();
      return {
        providerName: this.name,
        modelVersion: this.modelVersion,
        originalTranscript: data.text || '',
        providerDetectedLanguage: data.language || options.operatorLanguage || 'ha-NG',
        codeSwitchingDetected: false,
        confidenceScore: 0.90
      };
    } catch (err) {
      console.error('OpenAITranscribeAdapter execution failed, falling back to mock:', err.message);
      const { MockTranscriptionAdapter } = await import('./mockTranscriptionAdapter.js');
      return new MockTranscriptionAdapter().transcribe(audioBuffer, mimeType, options);
    }
  }
}
