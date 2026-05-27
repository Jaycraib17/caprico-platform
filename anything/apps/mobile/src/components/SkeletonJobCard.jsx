import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

export default function SkeletonJobCard() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const SkeletonBox = ({ width, height, style }) => (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: "#E5E7EB",
          borderRadius: 8,
          opacity,
        },
        style,
      ]}
    />
  );

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Company name */}
      <SkeletonBox width={120} height={14} style={{ marginBottom: 12 }} />

      {/* Job title */}
      <SkeletonBox width="80%" height={20} style={{ marginBottom: 16 }} />

      {/* Tags row */}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
        <SkeletonBox width={80} height={24} />
        <SkeletonBox width={100} height={24} />
      </View>

      {/* Meta row */}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
        <SkeletonBox width={60} height={14} />
        <SkeletonBox width={70} height={14} />
      </View>

      {/* Button */}
      <SkeletonBox width="100%" height={44} />
    </View>
  );
}
