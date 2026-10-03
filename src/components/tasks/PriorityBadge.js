import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { priorityColors } from '../../themes/colors';
import { fontSize, fontWeight, radius, spacing } from '../../themes/layout';

export default function PriorityBadge({ priority }) {
  const color = priorityColors[priority] || '#8A82AD';

  return (
    <View style={[styles.badge, { backgroundColor: `${color}22` }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{priority}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  text: { fontSize: fontSize.xs, fontWeight: fontWeight.bold },
});