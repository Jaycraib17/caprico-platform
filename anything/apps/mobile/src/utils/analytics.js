import { Platform } from "react-native";
import Constants from "expo-constants";
import { hasAnalyticsConsent } from "./consent";

const API_BASE = process.env.EXPO_PUBLIC_PROXY_BASE_URL || "";

/**
 * Track an app download event (QR code scan or button click)
 * @param {string} platform - 'ios' or 'android'
 * @param {string} source - Where the download was initiated (e.g., 'homepage', 'footer')
 * @param {string} method - 'qr_code' or 'button'
 */
export const trackDownloadEvent = async (platform, source, method) => {
  try {
    // Check consent before tracking
    const hasConsent = await hasAnalyticsConsent();
    if (!hasConsent) {
      return; // Silently skip tracking if no consent
    }

    await fetch(`${API_BASE}/api/analytics/download-event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform,
        source,
        method,
      }),
    });
  } catch (error) {
    console.error("Error tracking download event:", error);
  }
};

/**
 * Track user engagement events in the app
 * @param {string} event_type - Type of event (e.g., 'app_open', 'job_view', 'job_save')
 * @param {object} event_data - Additional event data (optional)
 */
export const trackEngagement = async (event_type, event_data = null) => {
  try {
    // Check consent before tracking
    const hasConsent = await hasAnalyticsConsent();
    if (!hasConsent) {
      return; // Silently skip tracking if no consent
    }

    const platform = Platform.OS === "ios" ? "ios" : "android";
    const app_version = Constants.expoConfig?.version || "unknown";

    await fetch(`${API_BASE}/api/analytics/engagement`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type,
        event_data,
        platform,
        app_version,
      }),
    });
  } catch (error) {
    console.error("Error tracking engagement:", error);
  }
};

/**
 * Common engagement event types for the app
 */
export const ENGAGEMENT_EVENTS = {
  APP_OPEN: "app_open",
  JOB_VIEW: "job_view",
  JOB_SAVE: "job_save",
  JOB_APPLY: "job_apply",
  JOB_UNSAVE: "job_unsave",
  SEARCH: "search",
  FILTER_APPLIED: "filter_applied",
  COMPANY_VIEW: "company_view",
  COMPANY_SAVE: "company_save",
  SAVED_SEARCH_CREATED: "saved_search_created",
  PROFILE_UPDATE: "profile_update",
  PREMIUM_VIEW: "premium_view",
  SERVICE_PURCHASE: "service_purchase",
};
