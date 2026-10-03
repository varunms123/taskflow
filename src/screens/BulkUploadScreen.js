import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ScreenHeader from '../components/common/ScreenHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

import useTasks from '../hooks/useTasks';
import { useTheme } from '../themes/ThemeContext';
import { fontSize, fontWeight, radius, spacing } from '../themes/layout';
import { buildImportReport, pickCSVFile, readFileAsText } from '../services/importService';
import { ROUTES } from '../navigations/routes';

const MAX_LISTED = 30;

const formatBytes = (bytes) => {
  if (!bytes && bytes !== 0) return 'Unknown size';
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
};

function Counter({ label, value, color }) {
  const { colors } = useTheme();
  return (
    <View style={styles.counter}>
      <Text style={[styles.counterValue, { color }]}>{value}</Text>
      <Text style={[styles.counterLabel, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}

export default function BulkUploadScreen({ navigation }) {
  const { colors } = useTheme();
  const { tasks, importTasks } = useTasks();

  const [file, setFile] = useState(null);
  const [report, setReport] = useState(null);
  const [summary, setSummary] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const handlePick = async () => {
    setError(null);
    setSummary(null);
    setBusy(true);

    try {
      const picked = await pickCSVFile();
      if (!picked) return; // user closed the picker

      const text = await readFileAsText(picked.uri);
      setFile(picked);
      setReport(buildImportReport(text, tasks));
    } catch (e) {
      setFile(null);
      setReport(null);
      setError(e.message || 'We could not read that file.');
    } finally {
      setBusy(false);
    }
  };

  const handleImport = () => {
    if (!report || report.valid.length === 0) return;

    importTasks(report.valid);
    setSummary({
      fileName: file.name,
      total: report.totalRows,
      imported: report.valid.length,
      duplicates: report.duplicates.length,
      failed: report.errors.length,
    });
    setFile(null);
    setReport(null);
  };

  const handleCancel = () => {
    setFile(null);
    setReport(null);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader subtitle="CSV import" title="Bulk upload" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step 1: pick a file */}
        <Card style={styles.pickCard}>
          <View style={[styles.bigIcon, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name="document-text-outline" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Import tasks from CSV</Text>
          <Text style={[styles.cardText, { color: colors.muted }]}>
            Columns: id, title, description, category, priority, start_date, due_date, status.
            Dates must look like 2026-10-01.
          </Text>
          <Button
            title={file ? 'Choose a different file' : 'Choose CSV file'}
            icon="folder-open-outline"
            onPress={handlePick}
            loading={busy}
            style={styles.fullButton}
          />
        </Card>

        {error ? (
          <View style={[styles.notice, { backgroundColor: colors.dangerSoft }]}>
            <Ionicons name="alert-circle" size={20} color={colors.danger} />
            <Text style={[styles.noticeText, { color: colors.danger }]}>{error}</Text>
          </View>
        ) : null}

        {/* Import finished */}
        {summary ? (
          <Card style={styles.block}>
            <View style={styles.summaryHead}>
              <Ionicons
                name={summary.imported > 0 ? 'checkmark-circle' : 'alert-circle'}
                size={26}
                color={summary.imported > 0 ? colors.success : colors.warning}
              />
              <Text style={[styles.cardTitle, styles.summaryTitle, { color: colors.text }]}>
                {summary.imported > 0 ? 'Import complete' : 'Nothing was imported'}
              </Text>
            </View>
            <Text style={[styles.cardText, { color: colors.muted }]}>{summary.fileName}</Text>

            <View style={styles.counters}>
              <Counter label="Rows" value={summary.total} color={colors.text} />
              <Counter label="Imported" value={summary.imported} color={colors.success} />
              <Counter label="Duplicates" value={summary.duplicates} color={colors.warning} />
              <Counter label="Failed" value={summary.failed} color={colors.danger} />
            </View>

            <Button
              title="View tasks"
              icon="list-outline"
              variant="secondary"
              onPress={() => navigation.navigate(ROUTES.TASKS)}
              style={styles.fullButton}
            />
          </Card>
        ) : null}

        {/* Step 2: review the file before importing */}
        {file && report ? (
          <>
            <Card style={styles.block}>
              <Text style={[styles.sectionLabel, { color: colors.muted }]}>Selected file</Text>
              <Text style={[styles.fileName, { color: colors.text }]}>{file.name}</Text>
              <Text style={[styles.cardText, { color: colors.muted }]}>{formatBytes(file.size)}</Text>
            </Card>

            {report.fatalError ? (
              <View style={[styles.notice, { backgroundColor: colors.dangerSoft }]}>
                <Ionicons name="close-circle" size={20} color={colors.danger} />
                <Text style={[styles.noticeText, { color: colors.danger }]}>{report.fatalError}</Text>
              </View>
            ) : (
              <>
                <Card style={styles.block}>
                  <Text style={[styles.sectionLabel, { color: colors.muted }]}>Validation result</Text>
                  <View style={styles.counters}>
                    <Counter label="Rows" value={report.totalRows} color={colors.text} />
                    <Counter label="Valid" value={report.valid.length} color={colors.success} />
                    <Counter label="Duplicates" value={report.duplicates.length} color={colors.warning} />
                    <Counter label="Errors" value={report.errors.length} color={colors.danger} />
                  </View>
                </Card>

                {report.errors.length > 0 ? (
                  <Card style={styles.block}>
                    <Text style={[styles.listTitle, { color: colors.danger }]}>
                      Invalid records ({report.errors.length})
                    </Text>
                    {report.errors.slice(0, MAX_LISTED).map((item) => (
                      <View key={`e-${item.row}`} style={styles.issue}>
                        <Text style={[styles.issueTitle, { color: colors.text }]}>
                          Row {item.row}: {item.title}
                        </Text>
                        {item.messages.map((message) => (
                          <Text key={message} style={[styles.issueText, { color: colors.muted }]}>
                            • {message}
                          </Text>
                        ))}
                      </View>
                    ))}
                    {report.errors.length > MAX_LISTED ? (
                      <Text style={[styles.issueText, { color: colors.muted }]}>
                        ...and {report.errors.length - MAX_LISTED} more
                      </Text>
                    ) : null}
                  </Card>
                ) : null}

                {report.duplicates.length > 0 ? (
                  <Card style={styles.block}>
                    <Text style={[styles.listTitle, { color: colors.warning }]}>
                      Skipped duplicates ({report.duplicates.length})
                    </Text>
                    {report.duplicates.slice(0, MAX_LISTED).map((item) => (
                      <View key={`d-${item.row}`} style={styles.issue}>
                        <Text style={[styles.issueTitle, { color: colors.text }]}>
                          Row {item.row}: {item.title}
                        </Text>
                        <Text style={[styles.issueText, { color: colors.muted }]}>• {item.reason}</Text>
                      </View>
                    ))}
                    {report.duplicates.length > MAX_LISTED ? (
                      <Text style={[styles.issueText, { color: colors.muted }]}>
                        ...and {report.duplicates.length - MAX_LISTED} more
                      </Text>
                    ) : null}
                  </Card>
                ) : null}

                <Button
                  title={
                    report.valid.length > 0
                      ? `Import ${report.valid.length} valid ${report.valid.length === 1 ? 'task' : 'tasks'}`
                      : 'No valid records to import'
                  }
                  icon="download-outline"
                  onPress={handleImport}
                  disabled={report.valid.length === 0}
                  style={styles.block}
                />
              </>
            )}

            <Button title="Cancel" variant="ghost" onPress={handleCancel} />
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 50 },
  pickCard: { alignItems: 'center', paddingVertical: spacing.xxl },
  bigIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  cardTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.heavy, textAlign: 'center' },
  cardText: { fontSize: fontSize.sm, textAlign: 'center', marginTop: spacing.xs, lineHeight: 19 },
  fullButton: { alignSelf: 'stretch', marginTop: spacing.xl },
  block: { marginTop: spacing.lg },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.md,
    marginTop: spacing.lg,
  },
  noticeText: { flex: 1, marginLeft: spacing.md, fontWeight: fontWeight.semibold, fontSize: fontSize.sm },
  summaryHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  summaryTitle: { marginLeft: spacing.sm },
  sectionLabel: { fontSize: fontSize.xs, fontWeight: fontWeight.semibold },
  fileName: { fontSize: fontSize.md, fontWeight: fontWeight.bold, marginTop: spacing.xs },
  counters: { flexDirection: 'row', marginTop: spacing.lg },
  counter: { flex: 1, alignItems: 'center' },
  counterValue: { fontSize: fontSize.xl, fontWeight: fontWeight.heavy },
  counterLabel: { fontSize: fontSize.xs, marginTop: 2 },
  listTitle: { fontSize: fontSize.md, fontWeight: fontWeight.bold, marginBottom: spacing.sm },
  issue: { marginTop: spacing.sm },
  issueTitle: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  issueText: { fontSize: fontSize.xs + 1, marginTop: 2 },
});