import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../themes/ThemeContext';
import { fontSize, fontWeight, radius, shadows, spacing } from '../../themes/layout';
import { getWeekDays } from '../../utils/dateUtils';

export default function WeekStrip({ selected, onSelect }) {
  const { colors } = useTheme();
  const days = useMemo(() => getWeekDays(), []);

  return (
    <View style={styles.row}>
      {days.map((day) => {
        const active = day.iso === selected;

        return (
          <Pressable
            key={day.iso}
            onPress={() => onSelect(day.iso)}
            style={[
              styles.day,
              { backgroundColor: active ? colors.primary : colors.card },
              active && shadows.lifted,
            ]}
          >
            <Text style={[styles.label, { color: active ? colors.onPrimary : colors.muted }]}>
              {day.label}
            </Text>
            <Text style={[styles.number, { color: active ? colors.onPrimary : colors.text }]}>
              {day.dayNumber}
            </Text>
            {/* small dot under today's date so it's still visible when another day is selected */}
            <View
              style={[
                styles.dot,
                { backgroundColor: day.isToday ? (active ? colors.onPrimary : colors.primary) : 'transparent' },
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  day: {
    width: 42,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  label: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold },
  number: { fontSize: fontSize.lg, fontWeight: fontWeight.heavy, marginTop: 2 },
  dot: { width: 5, height: 5, borderRadius: 3, marginTop: 4 },
});