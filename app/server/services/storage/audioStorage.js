/**
 * AudioStorage Abstraction Layer
 * Supports LocalDiskAudioStorage for local development and SupabaseAudioStorage for production deployment.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export class AudioStorage {
  async saveAudio(buffer, originalMimeType, metadata = {}) {
    throw new Error('saveAudio() must be implemented');
  }

  async getAudioStream(storageKey) {
    throw new Error('getAudioStream() must be implemented');
  }

  async deleteAudio(storageKey) {
    throw new Error('deleteAudio() must be implemented');
  }
}

/**
 * Local Disk Implementation for Development
 */
export class LocalDiskAudioStorage extends AudioStorage {
  constructor(uploadDir = './uploads/audio') {
    super();
    this.uploadDir = path.resolve(process.cwd(), uploadDir);
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  generateKey(mimeType) {
    const ext = mimeType.includes('mpeg') || mimeType.includes('mp3') ? '.mp3' :
                mimeType.includes('mp4') || mimeType.includes('m4a') ? '.m4a' :
                mimeType.includes('ogg') ? '.ogg' :
                mimeType.includes('webm') ? '.webm' : '.wav';
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const randomHex = Math.random().toString(36).substring(2, 9);
    // Non-identifying key (NO participant names or numbers)
    return `audio_keys/TF-AUD-${timestamp}-${randomHex}${ext}`;
  }

  async saveAudio(buffer, originalMimeType, metadata = {}) {
    const key = this.generateKey(originalMimeType);
    const filename = path.basename(key);
    const filePath = path.join(this.uploadDir, filename);

    fs.writeFileSync(filePath, buffer);

    return {
      storageKey: key,
      fileSize: buffer.length,
      mimeType: originalMimeType,
      savedAt: new Date().toISOString()
    };
  }

  async getAudioStream(storageKey) {
    const filename = path.basename(storageKey);
    const filePath = path.join(this.uploadDir, filename);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Audio file not found for key: ${storageKey}`);
    }
    return fs.createReadStream(filePath);
  }

  async deleteAudio(storageKey) {
    const filename = path.basename(storageKey);
    const filePath = path.join(this.uploadDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }
}

/**
 * Supabase Storage Implementation (Private Object Storage)
 */
export class SupabaseAudioStorage extends AudioStorage {
  constructor(config = {}) {
    super();
    this.supabaseUrl = config.supabaseUrl || process.env.SUPABASE_URL;
    this.serviceRoleKey = config.serviceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY;
    this.bucketName = config.bucketName || 'private-discovery-audio';
  }

  async saveAudio(buffer, originalMimeType, metadata = {}) {
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const randomHex = Math.random().toString(36).substring(2, 9);
    const ext = originalMimeType.includes('mpeg') ? '.mp3' : '.wav';
    const key = `audio_keys/TF-AUD-${timestamp}-${randomHex}${ext}`;

    if (!this.supabaseUrl || !this.serviceRoleKey) {
      // Fallback to LocalDisk if Supabase config is not set
      console.warn('Supabase credentials missing, falling back to LocalDiskAudioStorage');
      const localFallback = new LocalDiskAudioStorage();
      return localFallback.saveAudio(buffer, originalMimeType, metadata);
    }

    // HTTP POST to Supabase Storage REST API securely from server
    const uploadUrl = `${this.supabaseUrl}/storage/v1/object/${this.bucketName}/${key}`;
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.serviceRoleKey}`,
        'Content-Type': originalMimeType,
        'x-upsert': 'true'
      },
      body: buffer
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Supabase Storage upload failed: ${response.status} ${errText}`);
    }

    return {
      storageKey: key,
      fileSize: buffer.length,
      mimeType: originalMimeType,
      savedAt: new Date().toISOString()
    };
  }

  async getAudioStream(storageKey) {
    if (!this.supabaseUrl || !this.serviceRoleKey) {
      const localFallback = new LocalDiskAudioStorage();
      return localFallback.getAudioStream(storageKey);
    }

    const downloadUrl = `${this.supabaseUrl}/storage/v1/object/authenticated/${this.bucketName}/${storageKey}`;
    const response = await fetch(downloadUrl, {
      headers: {
        'Authorization': `Bearer ${this.serviceRoleKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to retrieve audio stream from Supabase: ${response.status}`);
    }

    return response.body;
  }
}
