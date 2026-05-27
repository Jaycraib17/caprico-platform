import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { X, Crown, Check, Sparkles } from "lucide-react-native";
import { useState, useEffect } from "react";
import Purchases, { LOG_LEVEL, PRODUCT_CATEGORY } from "react-native-purchases";
import { Platform } from "react-native";
import useUser from "@/utils/auth/useUser";

export default function PaywallModal({
  visible,
  onClose,
  trigger = "generic",
}) {
  const { data: user } = useUser();
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    if (visible) {
      initializeRevenueCat();
    }
  }, [visible]);

  const initializeRevenueCat = async () => {
    try {
      setLoading(true);

      // Configure RevenueCat with appropriate API key
      const apiKey =
        process.env.EXPO_PUBLIC_CREATE_ENV === "DEVELOPMENT"
          ? process.env.EXPO_PUBLIC_REVENUE_CAT_TEST_STORE_API_KEY
          : Platform.select({
              ios: process.env.EXPO_PUBLIC_REVENUE_CAT_APP_STORE_API_KEY,
              android: process.env.EXPO_PUBLIC_REVENUE_CAT_PLAY_STORE_API_KEY,
              default: process.env.EXPO_PUBLIC_REVENUE_CAT_TEST_STORE_API_KEY,
            });

      if (!apiKey) {
        console.error("RevenueCat API key not configured");
        setLoading(false);
        return;
      }

      Purchases.setLogLevel(LOG_LEVEL.INFO);
      Purchases.configure({ apiKey });

      // Set user ID if authenticated
      if (user?.id) {
        await Purchases.logIn(user.id);
      }

      // Fetch available offerings
      const offerings = await Purchases.getOfferings();
      if (offerings.current?.availablePackages) {
        const subscriptionPackages = offerings.current.availablePackages.filter(
          (pkg) =>
            pkg.product.productCategory === PRODUCT_CATEGORY.SUBSCRIPTION,
        );
        setPackages(subscriptionPackages);
        if (subscriptionPackages.length > 0) {
          setSelectedPackage(subscriptionPackages[0]);
        }
      }
    } catch (error) {
      console.error("Error initializing RevenueCat:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    try {
      setPurchasing(true);

      // Ensure user is logged in
      if (!user?.id) {
        Alert.alert(
          "Sign In Required",
          "Please sign in to purchase a subscription.",
          [{ text: "OK" }],
        );
        return;
      }

      // Make the purchase
      const purchaseResult = await Purchases.purchasePackage(selectedPackage);

      if (purchaseResult.customerInfo.entitlements.active.premium) {
        Alert.alert(
          "Success!",
          "Welcome to Premium! Your subscription is now active.",
          [
            {
              text: "OK",
              onPress: () => {
                onClose();
                // Optionally refresh user data here
              },
            },
          ],
        );
      }
    } catch (error) {
      if (error.userCancelled) {
        // User cancelled, do nothing
        return;
      }
      console.error("Purchase error:", error);
      Alert.alert(
        "Purchase Failed",
        "There was an error processing your purchase. Please try again.",
        [{ text: "OK" }],
      );
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      setRestoring(true);
      const customerInfo = await Purchases.restorePurchases();

      if (customerInfo.entitlements.active.premium) {
        Alert.alert(
          "Restored!",
          "Your premium subscription has been restored.",
          [{ text: "OK", onPress: onClose }],
        );
      } else {
        Alert.alert(
          "No Purchases Found",
          "We couldn't find any active subscriptions associated with this account.",
          [{ text: "OK" }],
        );
      }
    } catch (error) {
      console.error("Restore error:", error);
      Alert.alert(
        "Restore Failed",
        "There was an error restoring your purchases. Please try again.",
        [{ text: "OK" }],
      );
    } finally {
      setRestoring(false);
    }
  };

  const getTriggerContent = () => {
    switch (trigger) {
      case "premium_job":
        return {
          title: "Unlock Premium Jobs",
          description:
            "Get early access to high-paying remote jobs from top companies.",
        };
      case "saved_jobs_limit":
        return {
          title: "Save More Jobs",
          description:
            "Free tier limited to 5 saved jobs. Upgrade for unlimited saves.",
        };
      case "application_tracker":
        return {
          title: "Track Applications",
          description: "Stay organized with our premium application tracker.",
        };
      default:
        return {
          title: "Upgrade to Premium",
          description:
            "Get early access to premium jobs, faster alerts, and more tools.",
        };
    }
  };

  const content = getTriggerContent();

  const formatPrice = (pkg) => {
    if (!pkg?.product) return "";
    const { priceString, subscriptionPeriod } = pkg.product;

    // Format with full duration for clarity (App Store requirement)
    let period = "";
    let duration = "";

    if (subscriptionPeriod === "P1M") {
      period = "per month";
      duration = "monthly";
    } else if (subscriptionPeriod === "P1Y") {
      period = "per year";
      duration = "annually";
    } else if (subscriptionPeriod === "P1W") {
      period = "per week";
      duration = "weekly";
    } else {
      period = "per period";
      duration = subscriptionPeriod;
    }

    return { priceString, period, duration };
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.7)",
          justifyContent: "flex-end",
        }}
      >
        <LinearGradient
          colors={["#FF2D75", "#B82D6B", "#6A0DAD"]}
          style={{
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingTop: 24,
            paddingBottom: 40,
            maxHeight: "92%",
          }}
        >
          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "rgba(255,255,255,0.2)",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <X size={20} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>

          <ScrollView
            style={{ paddingHorizontal: 24, paddingTop: 16 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Premium Crown Icon */}
            <View style={{ alignItems: "center", marginBottom: 24 }}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "rgba(255,255,255,0.25)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <Crown size={40} color="#FFFFFF" strokeWidth={2.5} />
              </View>

              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "800",
                  color: "#FFFFFF",
                  textAlign: "center",
                  marginBottom: 10,
                  letterSpacing: -0.5,
                }}
              >
                {content.title}
              </Text>
              <Text
                style={{
                  fontSize: 17,
                  color: "rgba(255,255,255,0.9)",
                  textAlign: "center",
                  lineHeight: 24,
                  paddingHorizontal: 10,
                }}
              >
                {content.description}
              </Text>
            </View>

            {/* Premium Features with Icons */}
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: 20,
                padding: 20,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.2)",
              }}
            >
              {[
                {
                  title: "Exclusive Premium Jobs",
                  desc: "Early access to high-paying positions",
                  icon: "✨",
                },
                {
                  title: "Instant Job Alerts",
                  desc: "Be first to know about new matches",
                  icon: "⚡",
                },
                {
                  title: "Application Tracker",
                  desc: "Never miss a follow-up",
                  icon: "📊",
                },
                {
                  title: "Unlimited Saves & Alerts",
                  desc: "No limits on your job search",
                  icon: "♾️",
                },
              ].map((feature, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    gap: 14,
                    marginBottom: index < 3 ? 18 : 0,
                  }}
                >
                  <Text style={{ fontSize: 22 }}>{feature.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 17,
                        fontWeight: "700",
                        color: "#FFFFFF",
                        marginBottom: 3,
                      }}
                    >
                      {feature.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "rgba(255,255,255,0.8)",
                        lineHeight: 20,
                      }}
                    >
                      {feature.desc}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Subscription Packages */}
            {loading ? (
              <View style={{ paddingVertical: 40, alignItems: "center" }}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text
                  style={{
                    marginTop: 12,
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 15,
                  }}
                >
                  Loading subscription options...
                </Text>
              </View>
            ) : packages.length > 0 ? (
              <View style={{ gap: 12, marginBottom: 24 }}>
                {packages.map((pkg) => {
                  const pricing = formatPrice(pkg);
                  const isSelected =
                    selectedPackage?.identifier === pkg.identifier;
                  return (
                    <TouchableOpacity
                      key={pkg.identifier}
                      onPress={() => setSelectedPackage(pkg)}
                      style={{
                        borderWidth: 3,
                        borderColor: isSelected
                          ? "#FFFFFF"
                          : "rgba(255,255,255,0.3)",
                        borderRadius: 16,
                        padding: 18,
                        backgroundColor: isSelected
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(255,255,255,0.1)",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: "700",
                              color: "#FFFFFF",
                              marginBottom: 6,
                            }}
                          >
                            {pkg.product.title || pkg.identifier}
                          </Text>
                          <Text
                            style={{
                              fontSize: 26,
                              fontWeight: "800",
                              color: "#FFFFFF",
                              marginBottom: 4,
                              letterSpacing: -0.5,
                            }}
                          >
                            {pricing.priceString}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              color: "rgba(255,255,255,0.9)",
                            }}
                          >
                            {pricing.period} • Billed {pricing.duration}
                          </Text>
                        </View>
                        {isSelected && (
                          <View
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 14,
                              backgroundColor: "#FFFFFF",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Check size={18} color="#FF2D75" strokeWidth={3} />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={{ paddingVertical: 20, alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: "rgba(255,255,255,0.9)",
                    textAlign: "center",
                  }}
                >
                  No subscription plans available at this time.
                </Text>
              </View>
            )}

            {/* BIG CTA Button with Glow */}
            {packages.length > 0 && (
              <>
                <View
                  style={{
                    shadowColor: "#FFFFFF",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.4,
                    shadowRadius: 16,
                    elevation: 8,
                    marginBottom: 16,
                  }}
                >
                  <TouchableOpacity
                    onPress={handlePurchase}
                    disabled={purchasing || !selectedPackage}
                    style={{
                      backgroundColor:
                        purchasing || !selectedPackage
                          ? "rgba(255,255,255,0.3)"
                          : "#FFFFFF",
                      borderRadius: 100,
                      paddingVertical: 20,
                      alignItems: "center",
                    }}
                  >
                    {purchasing ? (
                      <ActivityIndicator color="#FF2D75" size="small" />
                    ) : (
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "700",
                          color: "#FF2D75",
                          letterSpacing: 0.3,
                        }}
                      >
                        Start Premium Now
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Cancel Anytime Trust Text */}
                <Text
                  style={{
                    fontSize: 15,
                    color: "rgba(255,255,255,0.95)",
                    textAlign: "center",
                    fontWeight: "600",
                    marginBottom: 20,
                  }}
                >
                  ✓ Cancel anytime • No commitments
                </Text>

                {/* Restore Purchases Button */}
                <TouchableOpacity
                  onPress={handleRestore}
                  disabled={restoring}
                  style={{
                    paddingVertical: 12,
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  {restoring ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text
                      style={{
                        fontSize: 15,
                        color: "#FFFFFF",
                        fontWeight: "600",
                        textDecorationLine: "underline",
                      }}
                    >
                      Restore Purchases
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Enhanced Auto-Renewal Terms */}
                <Text
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.7)",
                    textAlign: "center",
                    marginBottom: 16,
                    lineHeight: 16,
                  }}
                >
                  {selectedPackage &&
                    (() => {
                      const pricing = formatPrice(selectedPackage);
                      return `Subscription renews ${pricing.duration} at ${pricing.priceString} ${pricing.period} unless cancelled 24 hours before period ends. Manage in Apple ID Settings.`;
                    })()}
                </Text>

                {/* Privacy Policy & Terms Links */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 16,
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL("https://capriremote.com/privacy")
                    }
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#FFFFFF",
                        textDecorationLine: "underline",
                        fontWeight: "600",
                      }}
                    >
                      Privacy
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}
                  >
                    •
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL("https://capriremote.com/terms")
                    }
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#FFFFFF",
                        textDecorationLine: "underline",
                        fontWeight: "600",
                      }}
                    >
                      Terms
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </LinearGradient>
      </View>
    </Modal>
  );
}
