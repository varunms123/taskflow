import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { getCategoryMeta } from '../../constants/config';
import { radius } from '../../themes/layout';

export default function CategoryIcon({ category, size = 40 }) {
  const { icon, color } = getCategoryMeta(category);

  return (
    <View
      style={[
        styles.box,
        { width: size, height: size, backgroundColor: `${color}22` },
      ]}
    >
      <Ionicons name={icon} size={size * 0.5} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: radius.md - 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});