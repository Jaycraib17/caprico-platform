import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ShoppingBag, Check, XCircle } from "lucide-react-native";
import { useState, useEffect } from "react";
import useUser from "@/utils/auth/useUser";

export default function PurchaseHistoryScreen() {
  const insets = useSafeAreaInsets();
  const { data: user, loading: userLoading } = useUser();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPurchases() {
      if (userLoading || !user) return;

      try {
        setLoading(true);
        const response = await fetch("/api/purchases");

        if (!response.ok) {
          throw new Error("Failed to fetch purchases");
        }

        const data = await response.json();
        setPurchases(data.purchases || []);
      } catch (err) {
        console.error("Error fetching purchases:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPurchases();
  }, [user, userLoading]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusIcon = (status) => {
    if (status === "completed") {
      return <Check size={18} color="#22C55E" strokeWidth={2.5} />;
    } else if (status === "refunded") {
      return <XCircle size={18} color="#EF4444" strokeWidth={2.5} />;
    }
    return <Check size={18} color="#F59E0B" strokeWidth={2.5} />;
  };

  const getStatusColor = (status) => {
    if (status === "completed") return "#22C55E";
    if (status === "refunded") return "#EF4444";
    return "#F59E0B";
  };

  if (userLoading || loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#FFF5F8",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#FF2D75" />
      </View>
    );
  }

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#FFF5F8",
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
        }}
      >
        <StatusBar style="dark" />
        <Text style={{ fontSize: 16, color: "#666666", textAlign: "center" }}>
          Please sign in to view your purchase history
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF5F8" }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: insets.top + 20,
          paddingBottom: 20,
          paddingHorizontal: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: "#111111",
            letterSpacing: -0.5,
          }}
        >
          Purchase History
        </Text>

        {/* Pink accent line */}
        <View
          style={{
            height: 2,
            backgroundColor: "#FF2D75",
            opacity: 0.15,
            marginTop: 14,
            borderRadius: 1,
          }}
        />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: insets.bottom + 84,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <View
            style={{
              backgroundColor: "#FEE2E2",
              padding: 16,
              borderRadius: 14,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 14, color: "#991B1B" }}>
              Failed to load purchases: {error}
            </Text>
          </View>
        )}

        {purchases.length === 0 && !error && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 60,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#FFE6F0",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <ShoppingBag size={36} color="#FF2D75" strokeWidth={2} />
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#111111",
                marginBottom: 8,
              }}
            >
              No purchases yet
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#666666",
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Your resume service purchases will appear here
            </Text>
          </View>
        )}

        {purchases.map((purchase) => (
          <View
            key={purchase.id}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 18,
              padding: 22,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.06,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            {/* Service Name & Status */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 14,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#111111",
                  flex: 1,
                  marginRight: 12,
                  letterSpacing: -0.3,
                }}
              >
                {purchase.service_name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor:
                    purchase.status === "completed" ? "#E8F5E9" : "#FEF2F2",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 100,
                }}
              >
                {getStatusIcon(purchase.status)}
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: getStatusColor(purchase.status),
                    marginLeft: 4,
                    textTransform: "capitalize",
                  }}
                >
                  {purchase.status}
                </Text>
              </View>
            </View>

            {/* Price */}
            <Text
              style={{
                fontSize: 32,
                fontWeight: "800",
                color: "#FF2D75",
                marginBottom: 12,
                letterSpacing: -1.2,
              }}
            >
              ${purchase.price}
            </Text>

            {/* Date */}
            <Text
              style={{
                fontSize: 13,
                color: "#666666",
              }}
            >
              Purchased on {formatDate(purchase.purchased_at)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
