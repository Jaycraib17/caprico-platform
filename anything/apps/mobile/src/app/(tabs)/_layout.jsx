import {
  NativeTabs,
  Icon,
  Label,
  VectorIcon,
} from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
  return (
    <NativeTabs labelStyle={{ color: "#9B9B9B" }} tintColor="#9B9B9B">
      <NativeTabs.Trigger name="index">
        <Label selectedStyle={{ color: "#FF2D75" }}>Home</Label>
        {Platform.select({
          ios: <Icon sf="house.fill" selectedColor="#FF2D75" />,
          default: (
            <Icon
              src={
                <VectorIcon
                  family={Ionicons}
                  name="home"
                  selectedColor="#FF2D75"
                />
              }
            />
          ),
        })}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="companies">
        <Label selectedStyle={{ color: "#FF2D75" }}>Companies</Label>
        {Platform.select({
          ios: <Icon sf="building.2.fill" selectedColor="#FF2D75" />,
          default: (
            <Icon
              src={
                <VectorIcon
                  family={Ionicons}
                  name="business"
                  selectedColor="#FF2D75"
                />
              }
            />
          ),
        })}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="saved">
        <Label selectedStyle={{ color: "#FF2D75" }}>Saved</Label>
        {Platform.select({
          ios: <Icon sf="heart.fill" selectedColor="#FF2D75" />,
          default: (
            <Icon
              src={
                <VectorIcon
                  family={Ionicons}
                  name="heart"
                  selectedColor="#FF2D75"
                />
              }
            />
          ),
        })}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="purchase-history">
        <Label selectedStyle={{ color: "#FF2D75" }}>Purchases</Label>
        {Platform.select({
          ios: <Icon sf="bag.fill" selectedColor="#FF2D75" />,
          default: (
            <Icon
              src={
                <VectorIcon
                  family={Ionicons}
                  name="receipt"
                  selectedColor="#FF2D75"
                />
              }
            />
          ),
        })}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="support">
        <Label selectedStyle={{ color: "#FF2D75" }}>Support</Label>
        {Platform.select({
          ios: <Icon sf="message.fill" selectedColor="#FF2D75" />,
          default: (
            <Icon
              src={
                <VectorIcon
                  family={Ionicons}
                  name="chatbubbles"
                  selectedColor="#FF2D75"
                />
              }
            />
          ),
        })}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="help">
        <Label selectedStyle={{ color: "#FF2D75" }}>Help</Label>
        {Platform.select({
          ios: <Icon sf="briefcase.fill" selectedColor="#FF2D75" />,
          default: (
            <Icon
              src={
                <VectorIcon
                  family={Ionicons}
                  name="briefcase"
                  selectedColor="#FF2D75"
                />
              }
            />
          ),
        })}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <Label selectedStyle={{ color: "#FF2D75" }}>Settings</Label>
        {Platform.select({
          ios: <Icon sf="gearshape.fill" selectedColor="#FF2D75" />,
          default: (
            <Icon
              src={
                <VectorIcon
                  family={Ionicons}
                  name="settings"
                  selectedColor="#FF2D75"
                />
              }
            />
          ),
        })}
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
