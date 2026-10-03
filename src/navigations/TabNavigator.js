import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { ROUTES } from './routes';
import { useTheme } from '../themes/ThemeContext';
import { fontWeight } from '../themes/layout';

import DashboardScreen from '../screens/DashboardScreen';
import TaskListScreen from '../screens/TaskListScreen';
import BulkUploadScreen from '../screens/BulkUploadScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

// [focused icon, outline icon]
const ICONS = {
  [ROUTES.HOME]: ['home', 'home-outline'],
  [ROUTES.TASKS]: ['list', 'list-outline'],
  [ROUTES.IMPORT]: ['cloud-upload', 'cloud-upload-outline'],
  [ROUTES.SETTINGS]: ['settings', 'settings-outline'],
};

export default function TabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: fontWeight.semibold },
        tabBarIcon: ({ focused, color, size }) => {
          const [active, inactive] = ICONS[route.name];
          return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name={ROUTES.HOME} component={DashboardScreen} />
      <Tab.Screen name={ROUTES.TASKS} component={TaskListScreen} />
      <Tab.Screen name={ROUTES.IMPORT} component={BulkUploadScreen} options={{ title: 'Import' }} />
      <Tab.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
    </Tab.Navigator>
  );
}