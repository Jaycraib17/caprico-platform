import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { StatusBar } from "expo-status-bar";
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
} from "lucide-react-native";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

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
        borderRadius: 16,
        padding: 18,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: "#F5E6E8",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 14,
        }}
      >
        <Icon size={22} color="#D4A5A5" strokeWidth={2} />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#2D2D2D",
            marginBottom: 2,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={{ fontSize: 14, color: "#9B9B9B" }}>{subtitle}</Text>
        )}
      </View>

      {showChevron && (
        <ChevronRight size={20} color="#C0C0C0" strokeWidth={2} />
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
        borderRadius: 16,
        padding: 18,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: "#F5E6E8",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 14,
        }}
      >
        <Icon size={22} color="#D4A5A5" strokeWidth={2} />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#2D2D2D",
            marginBottom: 2,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={{ fontSize: 14, color: "#9B9B9B" }}>{subtitle}</Text>
        )}
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#E0E0E0", true: "#D4A5A5" }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <StatusBar style="dark" />

      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#F0F0F0",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: "#2D2D2D",
            letterSpacing: -0.5,
          }}
        >
          Settings
        </Text>
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
            fontSize: 14,
            fontWeight: "700",
            color: "#9B9B9B",
            textTransform: "uppercase",
            letterSpacing: 0.5,
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
            fontSize: 14,
            fontWeight: "700",
            color: "#9B9B9B",
            textTransform: "uppercase",
            letterSpacing: 0.5,
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
          onValueChange={setPushNotifications}
        />

        <ToggleItem
          icon={Bell}
          title="Email Notifications"
          subtitle="Receive job updates via email"
          value={emailNotifications}
          onValueChange={setEmailNotifications}
        />

        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: "#9B9B9B",
            textTransform: "uppercase",
            letterSpacing: 0.5,
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
            fontSize: 14,
            fontWeight: "700",
            color: "#9B9B9B",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginTop: 24,
            marginBottom: 12,
            marginLeft: 4,
          }}
        >
          Support
        </Text>

        <SettingItem
          icon={HelpCircle}
          title="Help Center"
          subtitle="FAQs and support"
          onPress={() => {}}
        />

        <SettingItem icon={Shield} title="Privacy Policy" onPress={() => {}} />

        <TouchableOpacity
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 18,
            marginTop: 24,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "#FFE5E5",
          }}
        >
          <LogOut size={20} color="#FF6B6B" strokeWidth={2} />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#FF6B6B",
              marginLeft: 10,
            }}
          >
            Sign Out
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 13,
            color: "#C0C0C0",
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
