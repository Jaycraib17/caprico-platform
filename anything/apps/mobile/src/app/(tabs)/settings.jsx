import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Linking,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  User,
  Bell,
  Globe,
  HelpCircle,
  Shield,
  LogOut,
  ChevronRight,
  FileText,
  RefreshCw,
} from "lucide-react-native";
import { useAuth } from "../../utils/auth/useAuth";
import Purchases from "react-native-purchases";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const [pushNotifications, setPushNotifications] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handlePushNotificationToggle = (value) => {
    if (value) {
      // Show explicit consent alert when enabling
      Alert.alert(
        "Enable Push Notifications?",
        "You'll receive alerts when:\n\n• New jobs match your saved searches\n• Companies you follow post new positions\n• Your applications receive updates\n\nWe will not send promotional or marketing notifications without your explicit consent.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Enable",
            onPress: () => setPushNotifications(true),
          },
        ],
      );
    } else {
      setPushNotifications(false);
    }
  };

  const handleEmailNotificationToggle = (value) => {
    if (value) {
      // Show explicit consent alert when enabling
      Alert.alert(
        "Enable Email Notifications?",
        "You'll receive emails when:\n\n• New jobs match your saved searches\n• Weekly job digest (if enabled)\n• Important account updates\n\nWe will not send promotional or marketing emails without your explicit consent. You can unsubscribe anytime.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Enable",
            onPress: () => setEmailNotifications(true),
          },
        ],
      );
    } else {
      setEmailNotifications(false);
    }
  };

  const SettingItem = ({
    icon: Icon,
    title,
    subtitle,
    onPress,
    showChevron = true,
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 18,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: "#FFE6F0",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 14,
        }}
      >
        <Icon size={22} color="#FF2D75" strokeWidth={2} />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#111111",
            marginBottom: 2,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={{ fontSize: 14, color: "#666666" }}>{subtitle}</Text>
        )}
      </View>

      {showChevron && (
        <ChevronRight size={20} color="#CCCCCC" strokeWidth={2} />
      )}
    </TouchableOpacity>
  );

  const ToggleItem = ({
    icon: Icon,
    title,
    subtitle,
    value,
    onValueChange,
  }) => (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 18,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: "#FFE6F0",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 14,
        }}
      >
        <Icon size={22} color="#FF2D75" strokeWidth={2} />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#111111",
            marginBottom: 2,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={{ fontSize: 14, color: "#666666" }}>{subtitle}</Text>
        )}
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#E0E0E0", true: "#FF2D75" }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      setIsRestoring(true);

      // Use RevenueCat's restore method
      const customerInfo = await Purchases.restorePurchases();

      // Check if any purchases were restored
      const activePurchases = Object.keys(
        customerInfo.entitlements.active,
      ).length;

      if (activePurchases > 0) {
        Alert.alert(
          "Purchases Restored",
          "Your purchases have been successfully restored!",
          [{ text: "OK" }],
        );
      } else {
        Alert.alert(
          "No Purchases Found",
          "We couldn't find any purchases associated with this Apple ID.",
          [{ text: "OK" }],
        );
      }
    } catch (error) {
      console.error("Failed to restore purchases:", error);
      Alert.alert(
        "Restore Failed",
        "Could not restore purchases. Please make sure you're signed in with the same Apple ID used for the original purchase.",
        [{ text: "OK" }],
      );
    } finally {
      setIsRestoring(false);
    }
  };

  const openPrivacyPolicy = () => {
    Linking.openURL("https://capriremote.com/privacy");
  };

  const openTerms = () => {
    Linking.openURL("https://capriremote.com/terms");
  };

  const openContact = () => {
    Linking.openURL("mailto:support@capriremote.com");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF5F8" }}>
      <StatusBar style="dark" />

      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          paddingBottom: 20,
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
          Settings
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
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 84,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: "#999999",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            marginBottom: 12,
            marginLeft: 4,
          }}
        >
          Account
        </Text>

        <SettingItem
          icon={User}
          title="Profile"
          subtitle="Manage your personal information"
          onPress={() => {}}
        />

        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: "#999999",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            marginTop: 24,
            marginBottom: 12,
            marginLeft: 4,
          }}
        >
          Notifications
        </Text>

        <ToggleItem
          icon={Bell}
          title="Push Notifications"
          subtitle="Get alerts for new job matches"
          value={pushNotifications}
          onValueChange={handlePushNotificationToggle}
        />

        <ToggleItem
          icon={Bell}
          title="Email Notifications"
          subtitle="Receive job updates via email"
          value={emailNotifications}
          onValueChange={handleEmailNotificationToggle}
        />

        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: "#999999",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            marginTop: 24,
            marginBottom: 12,
            marginLeft: 4,
          }}
        >
          Preferences
        </Text>

        <SettingItem
          icon={Globe}
          title="Location & Language"
          subtitle="English (US)"
          onPress={() => {}}
        />

        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: "#999999",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            marginTop: 24,
            marginBottom: 12,
            marginLeft: 4,
          }}
        >
          Purchases
        </Text>

        <SettingItem
          icon={RefreshCw}
          title={isRestoring ? "Restoring..." : "Restore Purchases"}
          subtitle="Restore your previous purchases from this Apple ID"
          onPress={handleRestorePurchases}
          showChevron={false}
        />

        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: "#999999",
            textTransform: "uppercase",
            letterSpacing: 0.8,
            marginTop: 24,
            marginBottom: 12,
            marginLeft: 4,
          }}
        >
          Legal & Support
        </Text>

        <SettingItem
          icon={HelpCircle}
          title="Contact Support"
          subtitle="support@capriremote.com"
          onPress={openContact}
        />

        <SettingItem
          icon={Shield}
          title="Privacy Policy"
          subtitle="How we protect your data"
          onPress={openPrivacyPolicy}
        />

        <SettingItem
          icon={FileText}
          title="Terms of Service"
          subtitle="Terms and conditions"
          onPress={openTerms}
        />

        {/* Gradient Sign Out Button */}
        <LinearGradient
          colors={["#FF6B6B", "#FF4D4D"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 100,
            marginTop: 24,
            shadowColor: "#FF6B6B",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <TouchableOpacity
            onPress={handleSignOut}
            style={{
              padding: 18,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogOut size={20} color="#FFFFFF" strokeWidth={2} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#FFFFFF",
                marginLeft: 10,
              }}
            >
              Sign Out
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        <Text
          style={{
            fontSize: 13,
            color: "#CCCCCC",
            textAlign: "center",
            marginTop: 32,
          }}
        >
          Capri Remote v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}
