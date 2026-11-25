// Reusable LocalStorage Persistence Layer for HeatProof (Phase 2.1)

export const STORAGE_KEYS = {
  SAFETY_ACTIONS: 'heatproof_safety_actions',
  EVIDENCE_REPORTS: 'heatproof_evidence_reports',
  WORKER_FEEDBACK: 'heatproof_worker_feedback',
};

/**
 * Safely load an item from localStorage with a fallback value.
 * Validates JSON structure and handles missing or corrupted data.
 *
 * @template T
 * @param {string} key - localStorage key
 * @param {T} fallback - default value if key is not found or invalid
 * @returns {T}
 */
export function loadFromStorage(key, fallback) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);

    // If fallback is an array, ensure parsed is also a non-empty array
    // If parsed is empty array but fallback is demo data, return parsed (user may have cleared)
    if (Array.isArray(fallback) && !Array.isArray(parsed)) {
      return fallback;
    }

    return parsed;
  } catch (error) {
    console.warn(`[HeatProof Storage] Failed to load key "${key}":`, error);
    return fallback;
  }
}

/**
 * Safely save data to localStorage.
 * Handles quota exceeded and browser security restriction errors gracefully.
 *
 * @param {string} key - localStorage key
 * @param {any} data - data to serialize and save
 * @returns {boolean} whether save succeeded
 */
export function saveToStorage(key, data) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.warn(`[HeatProof Storage] Failed to save key "${key}":`, error);
    return false;
  }
}

/**
 * Clear HeatProof stored state (useful for test resets).
 */
export function clearHeatProofStorage() {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    Object.values(STORAGE_KEYS).forEach((k) => window.localStorage.removeItem(k));
  } catch (error) {
    console.warn('[HeatProof Storage] Failed to clear storage:', error);
  }
}
