import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from '../../themes/ThemeContext';
import { radius, shadows, spacing } from '../../themes/layout';

export default function Card({ children, onPress, style }){
    const { colors, isDark } = useTheme();

    const cardStyle = [
        styles.card,
        { backgroundColor: colors.card },
        isDark ? { borderWidth: 1, borderColor: colors.border } : shadows.soft,
        style,
    ];

    if (onPress){
        return(
            <Pressable onPress={onPress} style={({ pressed }) => [cardStyle, pressed && { opacity: 0.9}]}>
                {children}
            </Pressable>
        );
    }

    return <View style={cardStyle}>{children}</View>
}

const styles = StyleSheet.create({
    card: {
        borderRadius: radius.lg,
        padding: spacing.lg,
    },
})