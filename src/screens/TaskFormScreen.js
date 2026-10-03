import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import ScreenHeader from '../components/common/ScreenHeader';
import AppInput from '../components/common/AppInput';
import DateField from '../components/common/DateField';
import SegmentedControl from '../components/common/SegmentedControl';
import Chip from '../components/common/Chip';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';

import useTasks from '../hooks/useTasks';
import { useTheme } from '../themes/ThemeContext';
import { priorityColors } from '../themes/colors';
import { fontSize, fontWeight, spacing } from '../themes/layout';
import { PRIORITIES, STATUSES, STATUS_LABELS, getCategoryMeta } from '../constants/config';
import { hasErrors, validateTask } from '../utils/validators';
import { today } from '../utils/dateUtils';

const PRIORITY_OPTIONS = PRIORITIES.map((p) => ({ value: p, label: p, color: priorityColors[p] }));
const STATUS_OPTIONS = STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }));

const emptyForm = () => ({
  title: '',
  description: '',
  category: '',
  priority: 'Medium',
  startDate: today(),
  dueDate: today(),
  status: 'pending',
});

export default function TaskFormScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { getTaskById, addTask, updateTask, categories } = useTasks();

  const taskId = route.params?.taskId;
  const isEdit = Boolean(taskId);
  const existing = isEdit ? getTaskById(taskId) : null;

  const [form, setForm] = useState(() =>
    existing
      ? {
          title: existing.title,
          description: existing.description,
          category: existing.category,
          priority: existing.priority,
          startDate: existing.startDate,
          dueDate: existing.dueDate,
          status: existing.status,
        }
      : emptyForm()
  );
  const [errors, setErrors] = useState({});

  if (isEdit && !existing) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScreenHeader title="Edit task" onBack={navigation.goBack} />
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

  // update one field and clear its old error as soon as the user touches it
  const setField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[name];
      // the due date message depends on the start date too
      if (name === 'startDate') delete next.dueDate;
      return next;
    });
  };

  const handleSave = () => {
    const found = validateTask(form);
    if (hasErrors(found)) {
      setErrors(found);
      return;
    }

    if (isEdit) updateTask(taskId, form);
    else addTask(form);

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader
        subtitle={isEdit ? 'Update the details' : 'Create something new'}
        title={isEdit ? 'Edit task' : 'New task'}
        onBack={navigation.goBack}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppInput
          label="Title"
          value={form.title}
          onChangeText={(text) => setField('title', text)}
          placeholder="What needs to be done?"
          error={errors.title}
          maxLength={80}
        />

        <AppInput
          label="Description"
          value={form.description}
          onChangeText={(text) => setField('description', text)}
          placeholder="Add a few details (optional)"
          error={errors.description}
          multiline
          maxLength={300}
        />

        <Text style={[styles.label, { color: colors.text }]}>Category</Text>
        <View style={styles.chipWrap}>
          {categories.map((name) => (
            <Chip
              key={name}
              label={name}
              icon={getCategoryMeta(name).icon}
              selected={form.category === name}
              onPress={() => setField('category', name)}
              style={styles.chip}
            />
          ))}
        </View>
        {errors.category ? (
          <Text style={[styles.error, { color: colors.danger }]}>{errors.category}</Text>
        ) : null}

        <View style={styles.spacer} />

        <SegmentedControl
          label="Priority"
          options={PRIORITY_OPTIONS}
          value={form.priority}
          onChange={(value) => setField('priority', value)}
          error={errors.priority}
        />

        <DateField
          label="Start date"
          value={form.startDate}
          onChange={(value) => setField('startDate', value)}
          error={errors.startDate}
        />

        <DateField
          label="Due date"
          value={form.dueDate}
          onChange={(value) => setField('dueDate', value)}
          error={errors.dueDate}
        />

        <SegmentedControl
          label="Status"
          options={STATUS_OPTIONS}
          value={form.status}
          onChange={(value) => setField('status', value)}
          error={errors.status}
        />

        <Button
          title={isEdit ? 'Update task' : 'Save task'}
          icon={isEdit ? 'checkmark-circle-outline' : 'save-outline'}
          onPress={handleSave}
          style={styles.save}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 60 },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { marginRight: spacing.sm, marginBottom: spacing.sm },
  error: { fontSize: fontSize.xs, marginLeft: spacing.xs },
  spacer: { height: spacing.lg },
  save: { marginTop: spacing.md },
});