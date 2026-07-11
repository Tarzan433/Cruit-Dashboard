/**
 * profileImageService.ts
 *
 * Centralised service for all profile-image storage operations.
 *
 * ARCHITECTURE NOTE
 * -----------------
 * All persistence logic lives here. React components never call localStorage
 * directly for profile images — they call this service only.
 *
 * FUTURE FIREBASE MIGRATION
 * -------------------------
 * To switch from localStorage to Firebase Storage, replace the three
 * localStorage calls below (marked with "FUTURE FIREBASE") with the
 * corresponding Firebase Storage operations. No UI component will need
 * to change.
 *
 *   - load()  → firebase.storage().ref(path).getDownloadURL()
 *   - save()  → firebase.storage().ref(path).putString(dataUrl, 'data_url')
 *               then .getDownloadURL() to retrieve the hosted URL
 *   - remove() → firebase.storage().ref(path).delete()
 */

const STORAGE_KEY = "dailycruit_profile_image";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// ─── Public Types ─────────────────────────────────────────────────────────────

export interface ProfileImageService {
  load(): string | null;
  save(dataUrl: string): Promise<void>;
  remove(): void;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateImageFile(file: File): ValidationResult {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Unsupported file type. Please upload a JPG, PNG, or WEBP image.",
    };
  }
  if (file.size > MAX_BYTES) {
    return {
      valid: false,
      error: `Image is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is 5 MB.`,
    };
  }
  return { valid: true };
}

// ─── Utility: File → base64 data URL ─────────────────────────────────────────

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read the image file."));
    reader.readAsDataURL(file);
  });
}

// ─── Service Implementation ───────────────────────────────────────────────────

export const profileImageService: ProfileImageService = {
  /**
   * Load the saved profile image.
   * Returns a base64 data URL, or null if none is stored.
   *
   * FUTURE FIREBASE: Replace with firebase.storage().ref(STORAGE_KEY).getDownloadURL()
   */
  load(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Persist a new profile image.
   * Accepts a base64 data URL produced by FileReader.readAsDataURL().
   *
   * FUTURE FIREBASE: Replace with firebase.storage().ref(STORAGE_KEY)
   *   .putString(dataUrl, 'data_url') then resolve the download URL.
   */
  async save(dataUrl: string): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, dataUrl);
    } catch {
      throw new Error(
        "Could not save the profile image. Your browser storage may be full."
      );
    }
  },

  /**
   * Remove the stored profile image.
   *
   * FUTURE FIREBASE: Replace with firebase.storage().ref(STORAGE_KEY).delete()
   */
  remove(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore — removal failure is non-critical
    }
  },
};
