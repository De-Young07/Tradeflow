/**
 * Mock Transcription Provider Adapter
 * Provides realistic offline Hausa, Pidgin, and English discovery interview transcripts for CI/CD and cost-free local testing.
 */
import { TranscriptionProvider } from '../transcriptionService.js';

export class MockTranscriptionAdapter extends TranscriptionProvider {
  constructor() {
    super('MockTranscriptionAdapter');
    this.modelVersion = 'mock-v1.0';
  }

  async transcribe(audioBuffer, mimeType, options = {}) {
    const operatorLang = options.operatorLanguage || 'AUTO_DETECT';

    // Simulate realistic Hausa / Pidgin / English discovery interviews based on operator language choice
    let originalTranscript = '';
    let detectedLang = 'ha-NG';
    let codeSwitching = true;

    if (operatorLang === 'en-NG' || operatorLang === 'English') {
      detectedLang = 'en-NG';
      codeSwitching = false;
      originalTranscript = `Hello, my name is Garba Dikko. I farm red tomatoes in Dikko market area. Every week during harvest, we harvest around 40 baskets of tomatoes. Sometimes transport delay causes problems and tomatoes remain unsold. Roadside buyers offer lower prices like 15,000 naira per basket instead of 18,000 naira.`;
    } else if (operatorLang === 'pcm-NG' || operatorLang === 'Nigerian Pidgin') {
      detectedLang = 'pcm-NG';
      codeSwitching = true;
      originalTranscript = `Sannu Oga. Me I dey buy tomato for Dikko retail market. Every Monday I dey buy 20 baskets from local farm. De major palava be say transport fit delay by two days, then tomato go soft. Money where I spend per basket na 17,500 naira.`;
    } else {
      // Default Hausa / Auto-Detect
      detectedLang = 'ha-NG';
      codeSwitching = true;
      originalTranscript = `Sannu aboki. Ni manomin tumatir ne a garin Dikko, Gurara LGA. Sati-sati muna girbe kwando arba'in (40 baskets) na tumatir mai kyau. Wani lokacin motar kaya tana makara, tumatir yana zama a filin kasuwa. Muna sayar da kwando daya akan naira dubu goma sha takwas (₦18,000).`;
    }

    return {
      providerName: this.name,
      modelVersion: this.modelVersion,
      originalTranscript: originalTranscript,
      providerDetectedLanguage: detectedLang,
      codeSwitchingDetected: codeSwitching,
      confidenceScore: 0.94
    };
  }
}
