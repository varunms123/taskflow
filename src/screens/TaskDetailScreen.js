import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ScreenHeader from '../components/common/ScreenHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import CategoryIcon from '../components/tasks/CategoryIcon';
import PriorityBadge from '../components/tasks/PriorityBadge';

import useTasks from '../hooks/useTasks';
import { useTheme } from '../themes/ThemeContext';
import { fontSize, fontWeight, radius, spacing } from '../themes/layout';
import { STATUS_LABELS } from '../constants/config';
import { formatDate, getDueLabel, isOverdue } from '../utils/dateUtils';
import { confirmDelete } from '../utils/confirm';
import { ROUTES } from '../navigations/routes';

function InfoRow({ icon, label, value, valueColor }) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name={icon} size={17} color={colors.primary} />
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, { color: colors.muted }]}>{label}</Text>
        <Text style={[styles.rowValue, { color: valueColor || colors.text }]}>{value}</Text>
      </View>
    </View>
  );
}

export default function TaskDetailScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { getTaskById, toggleTask, deleteTask } = useTasks();

  const task = getTaskById(route.params?.taskId);

  if (!task) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScreenHeader title="Task details" onBack={navigation.goBack} />
        <EmptyState
          icon="help-circle-outline"
          title="Task not found"
          message="It may have been deleted."
          actionLabel="Go back"
          onAction={navigation.goBack}
        />
      </View>
    );
  }

  const done = task.status === 'completed';
  const overdue = isOverdue(task);

  const handleDelete = () => {
    confirmDelete(task, () => {
      // leave the screen first so we never render a task that no longer exists
      navigation.goBack();
      deleteTask(task.id);
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader subtitle="Task details" title={task.title} onBack={navigation.goBack} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card>
          <View style={styles.top}>
            <CategoryIcon category={task.category} size={52} />
            <View style={styles.topText}>
              <Text style={[styles.title, { color: colors.text }]}>{task.title}</Text>
              <View style={styles.badges}>
                <PriorityBadge priority={task.priority} />
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: done ? colors.successSoft : colors.primarySoft },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: done ? colors.success : colors.primary },
                    ]}
                  >
                    {STATUS_LABELS[task.status]}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {overdue ? (
            <View style={[styles.overdueBanner, { backgroundColor: colors.dangerSoft }]}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text style={[styles.overdueText, { color: colors.danger }]}>{getDueLabel(task)}</Text>
            </View>
          ) : null}

          <Text style={[styles.sectionLabel, { color: colors.muted }]}>Description</Text>
          <Text style={[styles.description, { color: colors.text }]}>
            {task.description || 'No description added.'}
          </Text>
        </Card>

        <Card style={styles.infoCard}>
          <InfoRow icon="pricetag-outline" label="Category" value={task.category} />
          <InfoRow icon="play-outline" label="Start date" value={formatDate(task.startDate)} />
          <InfoRow
            icon="flag-outline"
            label="Due date"
            value={formatDate(task.dueDate)}
            valueColor={overdue ? colors.danger : undefined}
          />
        </Card>

        <Button
          title={done ? 'Mark as pending' : 'Mark as completed'}
          icon={done ? 'refresh-outline' : 'checkmark-circle-outline'}
          onPress={() => toggleTask(task.id)}
          style={styles.button}
        />
        <Button
          title="Edit task"
          icon="create-outline"
          variant="secondary"
          onPress={() => navigation.navigate(ROUTES.TASK_FORM, { taskId: task.id })}
          style={styles.button}
        />
        <Button
          title="Delete task"
          icon="trash-outline"
          variant="danger"
          onPress={handleDelete}
          style={styles.button}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 50 },
  top: { flexDirection: 'row', alignItems: 'center' },
  topText: { flex: 1, marginLeft: spacing.lg },
  title: { fontSize: fontSize.lg, fontWeight: fontWeight.heavy },
  badges: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  statusPill: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  statusText: { fontSize: fontSize.xs, fontWeight: fontWeight.bold },
  overdueBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md - 4,
    marginTop: spacing.lg,
  },
  overdueText: { marginLeft: spacing.sm, fontWeight: fontWeight.bold, fontSize: fontSize.sm },
  sectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },
  description: { fontSize: fontSize.md, lineHeight: 22 },
  infoCard: { marginTop: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { marginLeft: spacing.md },
  rowLabel: { fontSize: fontSize.xs },
  rowValue: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, marginTop: 1 },
  button: { marginTop: spacing.md },
});