import 'react-native-gesture-handler';
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from 'react';

import { ThemeProvider, useTheme } from './src/themes/ThemeContext';
import { TaskProvider } from './src/context/TaskContext';
import RootNavigator from './src/navigations/RootNavigator';

function AppShell(){
  const { isDark } = useTheme();

  return(
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
    </>
  )
}

export default function App(){
  return(
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <TaskProvider>
            <AppShell />
          </TaskProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}