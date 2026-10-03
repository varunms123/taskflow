import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Button from './Button';
import { useTheme } from '../../themes/ThemeContext';
import { fontSize, fontWeight, spacing } from '../../themes/layout';

export default function ErrorView({ message = 'Something went wrong.', onRetry }) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.dangerSoft }]}>
        <Ionicons name="alert-circle-outline" size={38} color={colors.danger} />
      </View>

      <Text style={[styles.title, { color: colors.text }]}>Oops!</Text>
      <Text style={[styles.message, { color: colors.muted }]}>{message}</Text>

      {onRetry ? <Button title="Try again" onPress={onRetry} style={styles.button} /> : null}
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
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { fontSize: fontSize.xl, fontWeight: fontWeight.bold },
  message: { fontSize: fontSize.sm, textAlign: 'center', marginTop: spacing.sm },
  button: { marginTop: spacing.xl },
});