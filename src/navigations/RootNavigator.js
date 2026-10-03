import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROUTES } from './routes';
import TabNavigator from './TabNavigator';
import TaskFormScreen from '../screens/TaskFormScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import { useTheme } from '../themes/ThemeContext';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { colors, isDark } = useTheme();

  const navTheme = {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROUTES.TABS} component={TabNavigator} />
        <Stack.Screen
          name={ROUTES.TASK_FORM}
          component={TaskFormScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen name={ROUTES.TASK_DETAIL} component={TaskDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}