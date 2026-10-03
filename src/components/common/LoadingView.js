import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../themes/ThemeContext';
import { fontSize, spacing } from '../../themes/layout';

export default function LoadingView({ message = 'Loading...' }) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.text, { color: colors.muted }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  text: { marginTop: spacing.md, fontSize: fontSize.sm },
});