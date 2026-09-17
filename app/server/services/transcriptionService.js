/**
 * TranscriptionProvider Base Interface
 * Provider abstraction allowing seamless swapping between GoogleChirpAdapter, OpenAITranscribeAdapter, and MockTranscriptionAdapter.
 */
export class TranscriptionProvider {
  constructor(name = 'AbstractProvider') {
    this.name = name;
  }

  /**
   * Transcribe an audio buffer
   * @param {Buffer} audioBuffer
   * @param {string} mimeType
   * @param {Object} options - { operatorLanguage, promptHint }
   * @returns {Promise<Object>} { providerName, modelVersion, originalTranscript, providerDetectedLanguage, codeSwitchingDetected }
   */
  async transcribe(audioBuffer, mimeType, options = {}) {
    throw new Error('transcribe() method must be implemented by concrete provider');
  }
}
