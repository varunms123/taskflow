import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { exportTasksToCSV } from '../services/exportService';
import { Ionicons } from '@expo/vector-icons';

import ScreenHeader from '../components/common/ScreenHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

import useTasks from '../hooks/useTasks';
import { useTheme } from '../themes/ThemeContext';
import { fontSize, fontWeight, radius, spacing } from '../themes/layout';

export default function SettingsScreen() {
  const { colors, isDark, setDarkMode } = useTheme();
  const { tasks, clearAllTasks } = useTasks();
  const [exporting, setExporting] = useState(false);

  const hasTasks = tasks.length > 0;

  const handleClear = () => {
    Alert.alert(
      'Clear all tasks',
      `This will permanently delete all ${tasks.length} tasks. This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear all', style: 'destructive', onPress: clearAllTasks },
      ]
    );
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportTasksToCSV(tasks);
    } catch (error) {
      Alert.alert('Export failed', 'We could not export your tasks. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader subtitle="Preferences" title="Settings" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.group, { color: colors.muted }]}>Appearance</Text>
        <Card style={styles.row}>
          <View style={[styles.icon, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={colors.primary} />
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Dark mode</Text>
            <Text style={[styles.rowSub, { color: colors.muted }]}>
              {isDark ? 'Dark theme is on' : 'Light theme is on'}
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={setDarkMode}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </Card>

        <Text style={[styles.group, { color: colors.muted }]}>Your data</Text>
        <Card>
          <View style={styles.rowPlain}>
            <View style={[styles.icon, { backgroundColor: colors.primarySoft }]}>
              <Ionicons name="albums-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, { color: colors.text }]}>Stored tasks</Text>
              <Text style={[styles.rowSub, { color: colors.muted }]}>
                {tasks.length} saved on this device
              </Text>
            </View>
          </View>

          <Button
            title="Export tasks to CSV"
            icon="share-outline"
            variant="secondary"
            onPress={handleExport}
            disabled={!hasTasks}
            loading={exporting}
            style={styles.button}
          />
          <Button
            title="Clear all tasks"
            icon="trash-outline"
            variant="danger"
            onPress={handleClear}
            disabled={!hasTasks}
            style={styles.button}
          />
        </Card>

        <Text style={[styles.footer, { color: colors.muted }]}>TaskFlow · v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 50 },
  group: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowPlain: { flexDirection: 'row', alignItems: 'center' },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.md - 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, marginLeft: spacing.md },
  rowTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold },
  rowSub: { fontSize: fontSize.sm, marginTop: 2 },
  button: { marginTop: spacing.md },
  footer: { textAlign: 'center', fontSize: fontSize.xs, marginTop: spacing.xxl },
});