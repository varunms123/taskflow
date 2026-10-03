import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Card from '../common/Card';
import CategoryIcon from './CategoryIcon';
import PriorityBadge from './PriorityBadge';
import { useTheme } from '../../themes/ThemeContext';
import { fontSize, fontWeight, spacing } from '../../themes/layout';
import { formatShortDate, getDueLabel, isOverdue } from '../../utils/dateUtils';

export default function TaskCard({ task, onPress, onToggle, onDelete }) {
  const { colors } = useTheme();

  const done = task.status === 'completed';
  const overdue = isOverdue(task);

  return (
    <Card onPress={onPress} style={styles.card}>
      <Pressable onPress={onToggle} hitSlop={10} style={styles.checkWrap}>
        <View
          style={[
            styles.checkbox,
            { borderColor: done ? colors.success : colors.primary },
            done && { backgroundColor: colors.success },
          ]}
        >
          {done ? <Ionicons name="checkmark" size={15} color="#FFFFFF" /> : null}
        </View>
      </Pressable>

      <CategoryIcon category={task.category} />

      <View style={styles.content}>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            { color: colors.text },
            done && { textDecorationLine: 'line-through', opacity: 0.5 },
          ]}
        >
          {task.title}
        </Text>

        <Text numberOfLines={1} style={[styles.meta, { color: colors.muted }]}>
          {task.category} · {formatShortDate(task.startDate)} → {formatShortDate(task.dueDate)}
        </Text>

        <View style={styles.badges}>
          <PriorityBadge priority={task.priority} />
          <Text
            style={[
              styles.due,
              { color: overdue ? colors.danger : colors.muted },
              overdue && { fontWeight: fontWeight.bold },
            ]}
          >
            {getDueLabel(task)}
          </Text>
        </View>
      </View>

      {onDelete ? (
        <Pressable onPress={onDelete} hitSlop={10} style={styles.trash}>
          <Ionicons name="trash-outline" size={19} color={colors.danger} />
        </Pressable>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md + 2,
  },
  checkWrap: { marginRight: spacing.md },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, marginLeft: spacing.md },
  title: { fontSize: fontSize.md, fontWeight: fontWeight.bold },
  meta: { fontSize: fontSize.xs + 1, marginTop: 2 },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  due: { fontSize: fontSize.xs, marginLeft: spacing.sm },
  trash: { padding: spacing.xs, marginLeft: spacing.sm },
});