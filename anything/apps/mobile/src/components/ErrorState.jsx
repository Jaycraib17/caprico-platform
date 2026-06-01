import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AlertCircle, RefreshCw } from "lucide-react-native";

export default function ErrorState({ message, onRetry }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <AlertCircle size={48} color="#EF4444" />
      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: "#1F2937",
          marginTop: 16,
          textAlign: "center",
        }}
      >
        {message || "Something went wrong"}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#6B7280",
          marginTop: 8,
          textAlign: "center",
        }}
      >
        Please check your connection and try again
      </Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#D4A5A5",
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
            marginTop: 24,
          }}
        >
          <RefreshCw size={16} color="#FFFFFF" />
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "600",
              marginLeft: 8,
            }}
          >
            Retry
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
