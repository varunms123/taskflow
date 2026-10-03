import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../themes/ThemeContext';
import { fontSize, fontWeight, radius, spacing } from '../../themes/layout';

export default function SegmentedControl({ label, options, value, onChange, error }){
    const { colors } = useTheme();

    return(
        <View style={styles.wrapper}>
            {label ? <Text style={[styles.label, { color: colors.text }]}>{label}</Text> : null}

            <View style={[styles.track, { backgroundColor: colors.primarySoft }]}>
                {options.map((option) => {
                    const selected = option.value === value;
                    return(
                        <Pressable
                            key={option.value}
                            onPress={() => onChange(option.value)}
                            style={[
                                styles.segment,
                                selected && { backgroundColor: option.color || colors.primary },
                            ]}
                        >
                            <Text style={[styles.text, { color: selected ? '#FFFFFF' : colors.muted }]}>{option.label}</Text>
                        </Pressable>
                    )
                })}
            </View>
            {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.lg },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  track: {
    flexDirection: 'row',
    borderRadius: radius.md,
    padding: 4,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.sm + 2,
  },
  text: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  error: {
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});