import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import TaskCard from './TaskCard';
import { useTheme } from '../../theme/ThemeContext';
import { fontSize, fontWeight, radius } from '../../theme/layout';

// Swipe right -> complete / reopen.  Swipe left -> delete (with confirmation).
export default function SwipeableTaskCard({ task, onPress, onToggle, onDelete }) {
  const { colors } = useTheme();
  const swipeRef = useRef(null);

  const done = task.status === 'completed';

  const renderLeftActions = () => (
    <View style={[styles.action, styles.leftAction, { backgroundColor: colors.success }]}>
      <Ionicons name={done ? 'refresh' : 'checkmark-circle-outline'} size={24} color="#FFFFFF" />
      <Text style={styles.actionText}>{done ? 'Reopen' : 'Done'}</Text>
    </View>
  );

  const renderRightActions = () => (
    <View style={[styles.action, styles.rightAction, { backgroundColor: colors.danger }]}>
      <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
      <Text style={styles.actionText}>Delete</Text>
    </View>
  );

  // Close the row first so it never stays half open behind the dialog
  const handleComplete = () => {
    swipeRef.current?.close();
    onToggle();
  };

  const handleDelete = () => {
    swipeRef.current?.close();
    onDelete();
  };

  return (
    <Swipeable
      ref={swipeRef}
      friction={2}
      leftThreshold={60}
      rightThreshold={60}
      overshootLeft={false}
      overshootRight={false}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableLeftOpen={handleComplete}
      onSwipeableRightOpen={handleDelete}
    >
      <TaskCard task={task} onPress={onPress} onToggle={onToggle} onDelete={onDelete} />
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  action: {
    width: 92,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftAction: {
    borderTopLeftRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
  },
  rightAction: {
    borderTopRightRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    marginTop: 2,
  },
});