import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ProgressHero from '../components/dashboard/ProgressHero';
import StatTile from '../components/dashboard/StatTile';
import WeekStrip from '../components/dashboard/WeekStrip';
import TaskCard from '../components/tasks/TaskCard';
import Card from '../components/common/Card';
import ScreenHeader from '../components/common/ScreenHeader';
import LoadingView from '../components/common/LoadingView';
import ErrorView from '../components/common/ErrorView';
import EmptyState from '../components/common/EmptyState';

import useTasks from '../hooks/useTasks';
import useTaskStats from '../hooks/useTaskStats';
import useFilteredTasks from '../hooks/useFilteredTasks';
import { useTheme } from '../themes/ThemeContext';
import { fontSize, fontWeight, radius, shadows, spacing } from '../themes/layout';
import { formatLongToday, formatShortDate, today } from '../utils/dateUtils';
import { confirmDelete } from '../utils/confirm';
import { ROUTES } from '../navigations/routes';

const MAX_ON_DASHBOARD = 5;

export default function DashboardScreen({ navigation }) {
  const { colors } = useTheme();
  const { tasks, loading, error, reload, toggleTask, deleteTask } = useTasks();
  const stats = useTaskStats();

  const [selectedDay, setSelectedDay] = useState(today());

  // pending tasks whose start-to-due range covers the selected day
  const dayTasks = useFilteredTasks({ filter: 'pending', day: selectedDay, sortBy: 'priority' });

  const isTodaySelected = selectedDay === today();
  const sectionTitle = isTodaySelected ? "Today's tasks" : `Tasks on ${formatShortDate(selectedDay)}`;

  const openForm = () => navigation.navigate(ROUTES.TASK_FORM);
  const openTask = (task) => navigation.navigate(ROUTES.TASK_DETAIL, { taskId: task.id });

  if (loading) return <LoadingView message="Loading your tasks..." />;
  if (error) return <ErrorView message={error} onRetry={reload} />;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader subtitle={formatLongToday()} title="My Tasks" />

        <View style={styles.body}>
          <ProgressHero
            percent={stats.percent}
            completed={stats.completed}
            total={stats.total}
            todayCount={stats.today}
            overdue={stats.overdue}
          />

          <View style={styles.tileRow}>
            <StatTile label="Total" value={stats.total} icon="layers-outline" background={colors.tileTotal} />
            <View style={styles.gap} />
            <StatTile label="Completed" value={stats.completed} icon="checkmark-done-outline" background={colors.tileDone} />
          </View>
          <View style={styles.tileRow}>
            <StatTile label="Pending" value={stats.pending} icon="time-outline" background={colors.tilePending} />
            <View style={styles.gap} />
            <StatTile label="Today" value={stats.today} icon="today-outline" background={colors.tileToday} />
          </View>

          <Card onPress={() => navigation.navigate(ROUTES.IMPORT)} style={styles.importCard}>
            <View style={[styles.importIcon, { backgroundColor: colors.primarySoft }]}>
              <Ionicons name="cloud-upload-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.importText}>
              <Text style={[styles.importTitle, { color: colors.text }]}>Bulk upload</Text>
              <Text style={[styles.importSub, { color: colors.muted }]}>Import tasks from a CSV file</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </Card>

          <Text style={[styles.sectionTitle, styles.weekTitle, { color: colors.text }]}>This week</Text>
          <WeekStrip selected={selectedDay} onSelect={setSelectedDay} />

          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{sectionTitle}</Text>
            {dayTasks.length > MAX_ON_DASHBOARD ? (
              <Pressable onPress={() => navigation.navigate(ROUTES.TASKS)}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
              </Pressable>
            ) : null}
          </View>

          {tasks.length === 0 ? (
            <EmptyState
              title="No tasks yet"
              message="Add your first task, or import a bunch at once from a CSV file."
              actionLabel="Add a task"
              onAction={openForm}
            />
          ) : dayTasks.length === 0 ? (
            <EmptyState
              icon="sunny-outline"
              title="Nothing scheduled"
              message={isTodaySelected ? 'You have no pending tasks for today.' : 'No pending tasks on this day.'}
            />
          ) : (
            dayTasks.slice(0, MAX_ON_DASHBOARD).map((task) => (
              <View key={task.id} style={styles.taskWrap}>
                <TaskCard
                  task={task}
                  onPress={() => openTask(task)}
                  onToggle={() => toggleTask(task.id)}
                  onDelete={() => confirmDelete(task, () => deleteTask(task.id))}
                />
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <Pressable
        onPress={openForm}
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
          shadows.lifted,
        ]}
      >
        <Ionicons name="add" size={30} color={colors.onPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingBottom: 110 },
  body: { paddingHorizontal: spacing.xl },
  tileRow: { flexDirection: 'row', marginTop: spacing.md },
  gap: { width: spacing.md },
  importCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    padding: spacing.md + 2,
  },
  importIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  importText: { flex: 1, marginLeft: spacing.md },
  importTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold },
  importSub: { fontSize: fontSize.sm, marginTop: 2 },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.heavy },
  weekTitle: { marginTop: spacing.xxl, marginBottom: spacing.md },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  seeAll: { fontSize: fontSize.sm, fontWeight: fontWeight.bold },
  taskWrap: { marginBottom: spacing.md },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
    width: 58,
    height: 58,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});