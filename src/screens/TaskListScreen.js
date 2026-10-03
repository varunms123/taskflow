import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ScreenHeader from '../components/common/ScreenHeader';
import LoadingView from '../components/common/LoadingView';
import ErrorView from '../components/common/ErrorView';
import EmptyState from '../components/common/EmptyState';
import SearchBar from '../components/tasks/SearchBar';
import FilterTabs from '../components/tasks/FilterTabs';
import SortMenu from '../components/tasks/SortMenu';
import SwipeableTaskCard from '../components/tasks/SwipeableTaskCard';

import useTasks from '../hooks/useTasks';
import useFilteredTasks from '../hooks/useFilteredTasks';
import { useTheme } from '../themes/ThemeContext';
import { radius, spacing } from '../themes/layout';
import { confirmDelete } from '../utils/confirm';
import { ROUTES } from '../navigations/routes';

export default function TaskListScreen({ navigation }) {
  const { colors } = useTheme();
  const { tasks, loading, error, reload, toggleTask, deleteTask } = useTasks();

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('due');

  const visibleTasks = useFilteredTasks({ filter, search, sortBy });

  // numbers shown on the filter chips
  const counts = useMemo(() => {
    const completed = tasks.filter((t) => t.status === 'completed').length;
    return { all: tasks.length, completed, pending: tasks.length - completed };
  }, [tasks]);

  if (loading) return <LoadingView message="Loading your tasks..." />;
  if (error) return <ErrorView message={error} onRetry={reload} />;

  const openForm = () => navigation.navigate(ROUTES.TASK_FORM);

  const renderEmpty = () => {
    if (tasks.length === 0) {
      return (
        <EmptyState
          title="No tasks yet"
          message="Create a task or import them from a CSV file."
          actionLabel="Add a task"
          onAction={openForm}
        />
      );
    }
    return (
      <EmptyState
        icon="search-outline"
        title="No matching tasks"
        message="Try a different search or switch the filter."
      />
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader
        subtitle={`${tasks.length} in total`}
        title="All Tasks"
        right={
          <Pressable
            onPress={openForm}
            style={[styles.addButton, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="add" size={24} color={colors.onPrimary} />
          </Pressable>
        }
      />

      <View style={styles.controls}>
        <SearchBar value={search} onChangeText={setSearch} />
        <View style={styles.controlRow}>
          <FilterTabs value={filter} onChange={setFilter} counts={counts} />
        </View>
        <View style={styles.controlRow}>
          <SortMenu value={sortBy} onChange={setSortBy} />
        </View>
      </View>

      <FlatList
        data={visibleTasks}
        keyExtractor={(task) => task.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <SwipeableTaskCard
            task={item}
            onPress={() => navigation.navigate(ROUTES.TASK_DETAIL, { taskId: item.id })}
            onToggle={() => toggleTask(item.id)}
            onDelete={() => confirmDelete(item, () => deleteTask(item.id))}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  controls: { paddingHorizontal: spacing.xl },
  controlRow: { marginTop: spacing.md },
  list: { padding: spacing.xl, paddingBottom: 40, flexGrow: 1 },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});