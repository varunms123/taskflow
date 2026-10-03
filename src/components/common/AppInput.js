import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../themes/ThemeContext';
import { fontSize, fontWeight, radius, spacing } from '../../themes/layout';

export default function AppInput({ label, error, multiline = false, style, ...inputProps}){
    const { colors } = useTheme();
    const [ focused, setFocused ] = useState(false);

    const borderColor = error ? colors.danger : focused ? colors.primary : colors.border;

    return(
        <View style={styles.wrapper}>
            { label ? <Text style={[ styles.label, { color: colors.text }]}>{label}</Text> : null}
            <TextInput
                {...inputProps}
                multiline={multiline}
                textAlignVertical={multiline ? 'top' : 'center'}
                placeholderTextColor={colors.muted}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={[
                    styles.input,
                    multiline && styles.multiline,
                    { backgroundColor: colors.inputBg, borderColor, color: colors.text },
                    style,
                ]}
            />
            { error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: spacing.lg
    },
    label: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
        marginBottom: spacing.sm
    },
    input: {
        minHeight: 50,
        borderWidth: 1.5,
        borderRadius: radius.md,
        paddingHorizontal: spacing.lg,
        fontSize: fontSize.md,
    },
    multiline: {
        minHeight: 100,
        paddingTop: spacing.md,
    },
    error: {
        fontSize: fontSize.xs,
        marginTop: spacing.xs,
        marginLeft: spacing.xs,
    },
});