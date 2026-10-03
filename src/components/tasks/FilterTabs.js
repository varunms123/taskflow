import React from 'react';
import { StyleSheet, View } from 'react-native';

import Chip from '../common/Chip';
import { FILTERS } from '../../hooks/useFilteredTasks';
import { spacing } from '../../themes/layout';

// counts is optional: { all: 49, pending: 31, completed: 18 }
export default function FilterTabs({ value, onChange, counts }) {
  return (
    <View style={styles.row}>
      {FILTERS.map((filter) => (
        <Chip
          key={filter.value}
          label={counts ? `${filter.label} (${counts[filter.value]})` : filter.label}
          selected={value === filter.value}
          onPress={() => onChange(filter.value)}
          style={styles.chip}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  chip: { marginRight: spacing.sm },
});