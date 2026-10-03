import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../themes/ThemeContext';
import { fontSize, radius, spacing } from '../../themes/layout';

export default function SearchBar({ value, onChangeText, placeholder = 'Search tasks...' }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.box, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Ionicons name="search-outline" size={19} color={colors.muted} />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={[styles.input, { color: colors.text }]}
        returnKeyType="search"
        autoCorrect={false}
      />

      {value.length > 0 ? (
        <Pressable onPress={() => onChangeText('')} hitSlop={10}>
          <Ionicons name="close-circle" size={19} color={colors.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    marginHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
});