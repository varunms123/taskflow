import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';

export async function loadTasks() {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
  if (!raw) return [];

  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

export async function saveTasks(tasks) {
  await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

export async function clearTasks() {
  await AsyncStorage.removeItem(STORAGE_KEYS.TASKS);
}

export async function loadTheme() {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.THEME);
  } catch (error) {
    return null;
  }
}

export async function saveTheme(mode) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, mode);
  } catch (error) {
    console.warn('Could not save theme', error);
  }
}