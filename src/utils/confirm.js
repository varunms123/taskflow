import { Alert } from 'react-native';

export function confirmDelete(task, onConfirm) {
  Alert.alert('Delete task', `Delete "${task.title}"? This cannot be undone.`, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: onConfirm },
  ]);
}