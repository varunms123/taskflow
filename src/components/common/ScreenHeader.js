import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../themes/ThemeContext';
import { fontSize, fontWeight, radius, spacing } from '../../themes/layout';

export default function ScreenHeader({ title, subtitle, onBack, right }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top + spacing.md }]}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          hitSlop={8}
          style={[styles.back, { backgroundColor: colors.card }]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
      ) : null}

      <View style={styles.titleBox}>
        {subtitle ? <Text style={[styles.subtitle, { color: colors.muted }]}>{subtitle}</Text> : null}
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {right ? <View>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  titleBox: { flex: 1 },
  subtitle: { fontSize: fontSize.sm },
  title: { fontSize: fontSize.xl, fontWeight: fontWeight.heavy },
});