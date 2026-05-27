import AsyncStorage from "@react-native-async-storage/async-storage";

const CONSENT_KEY = "@capri_remote_analytics_consent";

/**
 * Check if user has given consent for analytics tracking
 * @returns {Promise<boolean>}
 */
export const hasAnalyticsConsent = async () => {
  try {
    const consent = await AsyncStorage.getItem(CONSENT_KEY);
    return consent === "true";
  } catch (error) {
    console.error("Error checking analytics consent:", error);
    return false;
  }
};

/**
 * Set user's analytics consent
 * @param {boolean} consent - Whether user consents to analytics
 */
export const setAnalyticsConsent = async (consent) => {
  try {
    await AsyncStorage.setItem(CONSENT_KEY, consent ? "true" : "false");
  } catch (error) {
    console.error("Error setting analytics consent:", error);
  }
};

/**
 * Clear analytics consent (for testing or account deletion)
 */
export const clearAnalyticsConsent = async () => {
  try {
    await AsyncStorage.removeItem(CONSENT_KEY);
  } catch (error) {
    console.error("Error clearing analytics consent:", error);
  }
};
