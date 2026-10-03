import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../themes/ThemeContext";
import { fontSize, fontWeight, radius, spacing } from '../../themes/layout';

export default function Chip({ label, selected = false, onPress, icon, style }){
    const { colors } = useTheme();

    const background = selected ? colors.primary : colors.card;
    const foreground = selected ? colors.onPrimary : colors.muted;

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.chip,
                { 
                    backgroundColor: background,
                    borderColor: selected ? colors.primary : colors.border,
                    opacity: pressed ? 0.8 : 1,
                },
                style,
            ]}
        >
            { icon ? <Ionicons name={icon} size={14} color={foreground} style={styles.icon} /> : null }
            <Text style={[styles.label, { color: foreground }]}>{label}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  icon: { marginRight: spacing.xs },
  label: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
});