import { Platform, Share } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { toCSV } from '../utils/csvParser';
import { today } from '../utils/dateUtils';

async function writeCsvFile(csv, fileName) {
  if (FileSystem.File && FileSystem.Paths) {
    const file = new FileSystem.File(FileSystem.Paths.cache, fileName);
    if (file.exists) file.delete();
    file.create();
    file.write(csv);
    return file.uri;
  }

  const uri = `${FileSystem.cacheDirectory}${fileName}`;
  await FileSystem.writeAsStringAsync(uri, csv);
  return uri;
}

export async function exportTasksToCSV(tasks) {
  const csv = toCSV(tasks);
  const fileName = `taskflow-tasks-${today()}.csv`;

  if (Platform.OS === 'web' || !(await Sharing.isAvailableAsync())) {
    await Share.share({ title: fileName, message: csv });
    return;
  }

  const uri = await writeCsvFile(csv, fileName);

  await Sharing.shareAsync(uri, {
    mimeType: 'text/csv',
    dialogTitle: 'Export TaskFlow tasks',
    UTI: 'public.comma-separated-values-text',
  });
}