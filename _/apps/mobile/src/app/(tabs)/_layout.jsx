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
    <NativeTabs labelStyle={{ color: "#2D2D2D" }} tintColor="#2D2D2D">
      <NativeTabs.Trigger name="index">
        <Label selectedStyle={{ color: "#D4A5A5" }}>Home</Label>
        {Platform.select({
          ios: <Icon sf="house.fill" selectedColor="#D4A5A5" />,
          default: (
            <Icon
              src={
                <VectorIcon
                  family={Ionicons}
                  name="home"
                  selectedColor="#D4A5A5"
                />
              }
            />
          ),
        })}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="companies">
        <Label selectedStyle={{ color: "#D4A5A5" }}>Companies</Label>
        {Platform.select({
          ios: <Icon sf="building.2.fill" selectedColor="#D4A5A5" />,
          default: (
            <Icon
              src={
                <VectorIcon
                  family={Ionicons}
                  name="business"
                  selectedColor="#D4A5A5"
                />
              }
            />
          ),
        })}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="saved">
        <Label selectedStyle={{ color: "#D4A5A5" }}>Saved</Label>
        {Platform.select({
          ios: <Icon sf="heart.fill" selectedColor="#D4A5A5" />,
          default: (
            <Icon
              src={
                <VectorIcon
                  family={Ionicons}
                  name="heart"
                  selectedColor="#D4A5A5"
                />
              }
            />
          ),
        })}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="premium">
        <Label selectedStyle={{ color: "#D4A5A5" }}>Premium</Label>
        {Platform.select({
          ios: <Icon sf="crown.fill" selectedColor="#D4A5A5" />,
          default: (
            <Icon
              src={
                <VectorIcon
                  family={Ionicons}
                  name="diamond"
                  selectedColor="#D4A5A5"
                />
              }
            />
          ),
        })}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <Label selectedStyle={{ color: "#D4A5A5" }}>Settings</Label>
        {Platform.select({
          ios: <Icon sf="gearshape.fill" selectedColor="#D4A5A5" />,
          default: (
            <Icon
              src={
                <VectorIcon
                  family={Ionicons}
                  name="settings"
                  selectedColor="#D4A5A5"
                />
              }
            />
          ),
        })}
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
