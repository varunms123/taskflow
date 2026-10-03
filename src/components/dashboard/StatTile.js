import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../themes/ThemeContext';
import { fontSize, fontWeight, radius, spacing } from '../../themes/layout';

export default function StatTile({ label, value, icon, background }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.tile, { backgroundColor: background }]}>
      <View style={[styles.iconBox, { backgroundColor: colors.card }]}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: radius.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  value: { fontSize: fontSize.xxl, fontWeight: fontWeight.heavy },
  label: { fontSize: fontSize.sm, opacity: 0.7, marginTop: 2 },
});