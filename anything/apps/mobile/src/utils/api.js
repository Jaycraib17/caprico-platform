/**
 * Fetch helper with automatic error handling
 */
export async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
}

/**
 * Get base API URL based on environment
 */
export function getApiUrl(path) {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL || "";
  return `${baseUrl}${path}`;
}
