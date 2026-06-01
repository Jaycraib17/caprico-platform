import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, ShoppingBag, Check } from "lucide-react-native";
import { useState } from "react";
import useInAppPurchase from "@/utils/useInAppPurchase";
import { services } from "@/data/services";

export default function ServiceOrderScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id, title, price } = useLocalSearchParams();
  const { purchaseService, isPurchasing, isReady } = useInAppPurchase();

  const service = services.find((s) => s.id === id);

  const handlePurchase = async () => {
    const result = await purchaseService({ serviceId: id });

    if (result.success) {
      // Record purchase in database
      try {
        const purchaseResponse = await fetch("/api/purchases", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serviceId: id,
            serviceName: decodeURIComponent(title || ""),
            price: parseFloat(price),
            revenueCatTransactionId:
              result.transaction?.transactionIdentifier ||
              result.transaction?.productIdentifier,
          }),
        });

        if (purchaseResponse.ok) {
          const { purchase } = await purchaseResponse.json();

          // Verify receipt
          await fetch("/api/purchases/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              purchaseId: purchase.id,
              receiptData: result.transaction,
            }),
          });
        }
      } catch (error) {
        console.error("Failed to record purchase:", error);
        // Continue anyway, payment was successful
      }

      Alert.alert(
        "Purchase Successful! 🎉",
        "Thank you for your purchase! Check your email for confirmation and we'll reach out within 24 hours with the next steps.",
        [
          {
            text: "Done",
            onPress: () => router.push("/(tabs)/purchase-history"),
          },
        ],
      );
    } else if (result.cancelled) {
      // User cancelled, do nothing
    } else {
      Alert.alert(
        "Purchase Failed",
        result.error || "Something went wrong. Please try again.",
        [{ text: "OK" }],
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF5F8" }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: insets.top + 16,
          paddingBottom: 16,
          paddingHorizontal: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: "#F8F8F8",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <ArrowLeft size={20} color="#111111" strokeWidth={2.5} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: "#111111",
          }}
        >
          Complete Your Purchase
        </Text>
      </View>

      {/* Pink accent line */}
      <View style={{ height: 2, backgroundColor: "#FF2D75", opacity: 0.15 }} />

      <ScrollView
        contentContainerStyle={{
          paddingTop: 24,
          paddingBottom: insets.bottom + 120,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Summary */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 18,
            padding: 22,
            marginBottom: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <ShoppingBag size={20} color="#FF2D75" strokeWidth={2.5} />
            <Text
              style={{
                fontSize: 13,
                fontWeight: "700",
                color: "#999999",
                marginLeft: 8,
                textTransform: "uppercase",
                letterSpacing: 0.8,
              }}
            >
              Order Summary • One-Time Purchase
            </Text>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#111111",
              marginBottom: 16,
              letterSpacing: -0.3,
            }}
          >
            {decodeURIComponent(title || "")}
          </Text>

          {/* Service Includes */}
          {service?.includes && (
            <View style={{ marginBottom: 16 }}>
              {service.includes.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginBottom: 10,
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: "#FFE6F0",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                      marginTop: 2,
                    }}
                  >
                    <Check size={12} color="#FF2D75" strokeWidth={3} />
                  </View>
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#111111",
                      lineHeight: 22,
                      flex: 1,
                    }}
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Price */}
          <View
            style={{
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: "#F0F0F0",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#666666",
              }}
            >
              Total (One-Time)
            </Text>
            <Text
              style={{
                fontSize: 36,
                fontWeight: "800",
                color: "#FF2D75",
                letterSpacing: -1.2,
              }}
            >
              ${price}
            </Text>
          </View>
        </View>

        {/* Payment Info */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 14,
            padding: 18,
            marginBottom: 16,
            borderWidth: 2,
            borderColor: "#FFE6F0",
            shadowColor: "#FF2D75",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#111111",
              textAlign: "center",
              lineHeight: 20,
              marginBottom: 8,
              fontWeight: "600",
            }}
          >
            🔒 Secure one-time payment via Apple
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: "#666666",
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            This is not a subscription. You will be charged once and receive
            immediate access.
          </Text>
        </View>

        {/* What Happens Next */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 18,
            padding: 22,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#111111",
              marginBottom: 12,
            }}
          >
            What happens next?
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: "#666666",
              lineHeight: 24,
            }}
          >
            After your purchase, we'll email you within 24 hours with detailed
            instructions and next steps for your resume service.
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Gradient Purchase Button */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#FFFFFF",
          paddingTop: 16,
          paddingBottom: insets.bottom + 16,
          paddingHorizontal: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <LinearGradient
          colors={
            isPurchasing || !isReady
              ? ["#CCCCCC", "#AAAAAA"]
              : ["#FF2D75", "#6A0DAD"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 100,
            shadowColor: isPurchasing || !isReady ? "#000" : "#FF2D75",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: isPurchasing || !isReady ? 0.1 : 0.4,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <TouchableOpacity
            onPress={handlePurchase}
            disabled={isPurchasing || !isReady}
            style={{
              paddingVertical: 18,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {isPurchasing && (
              <ActivityIndicator color="#FFFFFF" style={{ marginRight: 8 }} />
            )}
            <Text
              style={{
                fontSize: 17,
                fontWeight: "700",
                color: "#FFFFFF",
                letterSpacing: 0.3,
              }}
            >
              {isPurchasing
                ? "Processing..."
                : !isReady
                  ? "Loading..."
                  : `Purchase for $${price}`}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}
