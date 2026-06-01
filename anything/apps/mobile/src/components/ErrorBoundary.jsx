import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AlertCircle } from "lucide-react-native";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            backgroundColor: "#FAFAFA",
          }}
        >
          <AlertCircle size={64} color="#EF4444" />
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#1F2937",
              marginTop: 20,
              marginBottom: 8,
            }}
          >
            Something went wrong
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#6B7280",
              textAlign: "center",
              marginBottom: 24,
              lineHeight: 24,
            }}
          >
            The app encountered an unexpected error. Please try again.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#D4A5A5",
              paddingHorizontal: 32,
              paddingVertical: 14,
              borderRadius: 12,
            }}
            onPress={this.handleReload}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "600" }}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
