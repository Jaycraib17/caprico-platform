import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  MessageCircle,
  Send,
  AlertCircle,
  CheckCircle,
} from "lucide-react-native";
import { useState, useEffect } from "react";
import useUser from "@/utils/auth/useUser";

export default function SupportScreen() {
  const insets = useSafeAreaInsets();
  const { data: user, loading: userLoading } = useUser();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  useEffect(() => {
    if (user) {
      fetchTickets();
      fetchPurchases();
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/support");
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchases = async () => {
    try {
      const response = await fetch("/api/purchases");
      if (response.ok) {
        const data = await response.json();
        setPurchases(data.purchases || []);
      }
    } catch (error) {
      console.error("Failed to fetch purchases:", error);
    }
  };

  const handleSubmitTicket = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
          purchaseId: selectedPurchase,
          priority: "normal",
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Your support ticket has been submitted!");
        setSubject("");
        setMessage("");
        setSelectedPurchase(null);
        setShowNewTicket(false);
        fetchTickets();
      } else {
        throw new Error("Failed to submit ticket");
      }
    } catch (error) {
      console.error("Failed to submit ticket:", error);
      Alert.alert("Error", "Failed to submit ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "#F59E0B";
      case "in_progress":
        return "#3B82F6";
      case "resolved":
        return "#22C55E";
      case "closed":
        return "#6B6B6B";
      default:
        return "#6B6B6B";
    }
  };

  const getStatusIcon = (status) => {
    if (status === "resolved" || status === "closed") {
      return (
        <CheckCircle
          size={16}
          color={getStatusColor(status)}
          strokeWidth={2.5}
        />
      );
    }
    return (
      <AlertCircle size={16} color={getStatusColor(status)} strokeWidth={2.5} />
    );
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
          Please sign in to access support
        </Text>
      </View>
    );
  }

  if (showNewTicket) {
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
            New Support Ticket
          </Text>
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
            paddingBottom: insets.bottom + 100,
            paddingHorizontal: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Subject */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#111111",
                marginBottom: 8,
              }}
            >
              Subject
            </Text>
            <TextInput
              value={subject}
              onChangeText={setSubject}
              placeholder="Brief description of your issue"
              placeholderTextColor="#9CA3AF"
              style={{
                backgroundColor: "#FFFFFF",
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 16,
                color: "#111111",
              }}
            />
          </View>

          {/* Related Purchase (Optional) */}
          {purchases.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#111111",
                  marginBottom: 8,
                }}
              >
                Related Purchase (Optional)
              </Text>
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <TouchableOpacity
                  onPress={() => setSelectedPurchase(null)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    backgroundColor:
                      selectedPurchase === null ? "#F5E6E8" : "#FFFFFF",
                    borderBottomWidth: 1,
                    borderBottomColor: "#F0F0F0",
                  }}
                >
                  <Text style={{ fontSize: 14, color: "#111111" }}>None</Text>
                </TouchableOpacity>
                {purchases.slice(0, 5).map((purchase) => (
                  <TouchableOpacity
                    key={purchase.id}
                    onPress={() => setSelectedPurchase(purchase.id)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      backgroundColor:
                        selectedPurchase === purchase.id
                          ? "#F5E6E8"
                          : "#FFFFFF",
                      borderBottomWidth: 1,
                      borderBottomColor: "#F0F0F0",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#111111",
                        fontWeight: "600",
                      }}
                    >
                      {purchase.service_name}
                    </Text>
                    <Text
                      style={{ fontSize: 12, color: "#666666", marginTop: 2 }}
                    >
                      ${purchase.price} -{" "}
                      {new Date(purchase.purchased_at).toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Message */}
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#111111",
                marginBottom: 8,
              }}
            >
              Message
            </Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Please describe your issue in detail..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              style={{
                backgroundColor: "#FFFFFF",
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 16,
                color: "#111111",
                minHeight: 150,
              }}
            />
          </View>
        </ScrollView>

        {/* Fixed Gradient Buttons */}
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
            flexDirection: "row",
            gap: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => setShowNewTicket(false)}
            disabled={submitting}
            style={{
              flex: 1,
              backgroundColor: "#F8F8F8",
              paddingVertical: 16,
              borderRadius: 100,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#666666" }}>
              Cancel
            </Text>
          </TouchableOpacity>

          <LinearGradient
            colors={["#FF2D75", "#6A0DAD"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              flex: 1,
              borderRadius: 100,
              shadowColor: "#FF2D75",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <TouchableOpacity
              onPress={handleSubmitTicket}
              disabled={submitting}
              style={{
                paddingVertical: 16,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              {submitting && (
                <ActivityIndicator color="#FFFFFF" style={{ marginRight: 8 }} />
              )}
              <Send
                size={18}
                color="#FFFFFF"
                strokeWidth={2.5}
                style={{ marginRight: 8 }}
              />
              <Text
                style={{ fontSize: 16, fontWeight: "700", color: "#FFFFFF" }}
              >
                {submitting ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
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
          Support Tickets
        </Text>
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
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {tickets.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 60 }}>
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
              <MessageCircle size={36} color="#FF2D75" strokeWidth={2} />
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#111111",
                marginBottom: 8,
              }}
            >
              No support tickets
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#666666",
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Need help? Create a new ticket and we'll get back to you soon
            </Text>
          </View>
        )}

        {tickets.map((ticket) => (
          <View
            key={ticket.id}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 18,
              padding: 20,
              marginBottom: 16,
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
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#111111",
                  flex: 1,
                  marginRight: 12,
                }}
              >
                {ticket.subject}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor:
                    ticket.status === "resolved" || ticket.status === "closed"
                      ? "#ECFDF5"
                      : "#FEF3C7",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
              >
                {getStatusIcon(ticket.status)}
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: getStatusColor(ticket.status),
                    marginLeft: 4,
                    textTransform: "capitalize",
                  }}
                >
                  {ticket.status.replace("_", " ")}
                </Text>
              </View>
            </View>

            <Text
              style={{
                fontSize: 14,
                color: "#111111",
                lineHeight: 20,
                marginBottom: 12,
              }}
            >
              {ticket.message}
            </Text>

            {ticket.admin_response && (
              <View
                style={{
                  backgroundColor: "#F5E6E8",
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: "#666666",
                    marginBottom: 4,
                  }}
                >
                  Support Team Response:
                </Text>
                <Text
                  style={{ fontSize: 14, color: "#111111", lineHeight: 20 }}
                >
                  {ticket.admin_response}
                </Text>
              </View>
            )}

            <Text style={{ fontSize: 12, color: "#666666" }}>
              Created {new Date(ticket.created_at).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Fixed Gradient New Ticket Button */}
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
          colors={["#FF2D75", "#6A0DAD"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 100,
            shadowColor: "#FF2D75",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <TouchableOpacity
            onPress={() => setShowNewTicket(true)}
            style={{
              paddingVertical: 18,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <MessageCircle
              size={20}
              color="#FFFFFF"
              strokeWidth={2.5}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontSize: 17,
                fontWeight: "700",
                color: "#FFFFFF",
                letterSpacing: 0.3,
              }}
            >
              New Support Ticket
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}
