import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../themes/ThemeContext';
import { fontSize, fontWeight, radius, shadows, spacing } from '../../themes/layout';

export default function Button({
    title,
    onPress,
    variant = 'primary',
    icon,
    loading = false,
    disabled = false,
    style,
}) {
    const { colors } = useTheme();

    const palette = {
        primary: { bg: colors.primary, fg: colors.onPrimary },
        secondary: { bg: colors.primarySoft, fg: colors.primary },
        danger: { bg: colors.dangerSoft, fg: colors.danger },
        ghost: { bg: 'transparent', fg: colors.muted },
    }[variant];

    const inactive = disabled || loading;

    return (
        <Pressable
            onPress={onPress}
            disabled={inactive}
            style={({ pressed }) => [
                styles.base,
                { backgroundColor: palette.bg, opacity: inactive ? 0.5 : pressed ? 0.85 : 1 },
                variant === 'primary' && shadows.soft,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={palette.fg} />
            ) : (
                <>
                    { icon ? <Ionicons name={icon} size={18} color={palette.fg} style={styles.icon} /> : null }
                    <Text style={[styles.label, {color: palette.fg}]}>{title}</Text>
                </>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        minHeight: 50,
        borderRadius: radius.md,
        paddingHorizontal: spacing.xl,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: { marginRight: spacing.sm },
    label: { fontSize: fontSize.md, fontWeight: fontWeight.bold },
});