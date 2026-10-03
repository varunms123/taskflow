import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Button from './Button';
import { useTheme } from '../../themes/ThemeContext';
import { fontSize, fontWeight, spacing } from '../../themes/layout';

export default function EmptyState({
  icon = 'checkmark-done-outline',
  title,
  message,
  actionLabel,
  onAction,
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name={icon} size={38} color={colors.primary} />
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {message ? <Text style={[styles.message, { color: colors.muted }]}>{message}</Text> : null}

      {actionLabel && onAction ? (
        <Button title={actionLabel} onPress={onAction} style={styles.button} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, textAlign: 'center' },
  message: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  button: { marginTop: spacing.xl },
});