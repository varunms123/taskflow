import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Chip from '../common/Chip';
import { SORT_OPTIONS } from '../../hooks/useFilteredTasks';
import { useTheme } from '../../themes/ThemeContext';
import { fontSize, fontWeight, spacing } from '../../themes/layout';

export default function SortMenu({ value, onChange }) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      <Ionicons name="swap-vertical" size={16} color={colors.muted} />
      <Text style={[styles.label, { color: colors.muted }]}>Sort</Text>

      {SORT_OPTIONS.map((option) => (
        <Chip
          key={option.value}
          label={option.label}
          selected={value === option.value}
          onPress={() => onChange(option.value)}
          style={styles.chip}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: 'center' },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    marginLeft: spacing.xs,
    marginRight: spacing.md,
  },
  chip: { marginRight: spacing.sm },
});