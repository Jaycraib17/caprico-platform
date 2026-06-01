import Purchases, { LOG_LEVEL, PRODUCT_CATEGORY } from "react-native-purchases";
import { useAuth } from "@/utils/auth/useAuth";
import { Platform } from "react-native";
import { create } from "zustand";
import { useCallback, useState, useEffect } from "react";

const useInAppPurchaseStore = create((set) => ({
  isReady: false,
  offerings: null,
  setOfferings: (offerings) => set({ offerings }),
  setIsReady: (isReady) => set({ isReady }),
}));

function useInAppPurchase() {
  const { auth } = useAuth();
  const { isReady, offerings, setOfferings, setIsReady } =
    useInAppPurchaseStore();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const initiateInAppPurchase = useCallback(async () => {
    try {
      Purchases.setLogLevel(LOG_LEVEL.INFO);

      const apiKey =
        process.env.EXPO_PUBLIC_CREATE_ENV === "DEVELOPMENT"
          ? process.env.EXPO_PUBLIC_REVENUE_CAT_TEST_STORE_API_KEY
          : Platform.select({
              ios: process.env.EXPO_PUBLIC_REVENUE_CAT_APP_STORE_API_KEY,
              android: process.env.EXPO_PUBLIC_REVENUE_CAT_PLAY_STORE_API_KEY,
              web: process.env.EXPO_PUBLIC_REVENUE_CAT_TEST_STORE_API_KEY,
            });

      if (apiKey) {
        Purchases.configure({
          apiKey: apiKey,
        });

        const offeringsData = await Purchases.getOfferings();
        setOfferings(offeringsData);
      }
    } catch (error) {
      console.warn("Failed to initialize RevenueCat:", error);
    } finally {
      setIsReady(true);
    }
  }, [setIsReady, setOfferings]);

  // Map service IDs to RevenueCat package identifiers
  const getPackageForService = useCallback(
    (serviceId) => {
      const offering = offerings?.current;
      if (!offering) return null;

      const packageMap = {
        "starter-pack": "$rc_custom_resume_starter",
        "resume-review": "$rc_custom_resume_review",
        "tailored-resume": "$rc_custom_resume_rewrite",
        "resume-bundle": "$rc_custom_resume_bundle",
      };

      const lookupKey = packageMap[serviceId];
      if (!lookupKey) return null;

      return offering.availablePackages.find(
        (pkg) => pkg.identifier === lookupKey,
      );
    },
    [offerings],
  );

  const purchaseService = useCallback(
    async ({ serviceId }) => {
      try {
        setIsPurchasing(true);

        if (!auth?.user?.id) {
          throw new Error("User not authenticated");
        }

        const packageToPurchase = getPackageForService(serviceId);
        if (!packageToPurchase) {
          throw new Error("Service package not found");
        }

        await Purchases.logIn(auth.user.id);
        const purchaseResult =
          await Purchases.purchasePackage(packageToPurchase);

        return {
          success: true,
          transaction: purchaseResult,
        };
      } catch (error) {
        console.error("Failed to purchase service:", error);

        // User cancelled the purchase
        if (error.userCancelled) {
          return { success: false, cancelled: true };
        }

        return { success: false, error: error.message };
      } finally {
        setIsPurchasing(false);
      }
    },
    [auth, getPackageForService],
  );

  return {
    isReady,
    initiateInAppPurchase,
    purchaseService,
    isPurchasing,
    getPackageForService,
  };
}

export default useInAppPurchase;
