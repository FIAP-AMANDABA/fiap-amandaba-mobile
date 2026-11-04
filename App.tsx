import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { RootNavigator } from './src/navigation/RootNavigator';
import { navigationRef } from './src/navigation/navigationRef';
import { homeRouteFor } from './src/navigation/homeRoute';
import { useNotificationNavigation } from './src/navigation/useNotificationNavigation';
import { useSessionExpiry } from './src/hooks/useSessionExpiry';
import { AuthProvider, useAuth } from './src/providers/AuthProvider';
import { QueryProvider } from './src/providers/QueryProvider';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import { buildNavigationTheme } from './src/theme/navigationTheme';
import { configureNotificationHandler } from './src/services/notificationService';

SplashScreen.preventAutoHideAsync();
configureNotificationHandler();

function AppContent() {
  const { palette, isDark } = useTheme();
  const { role, restored } = useAuth();
  const tryOpenPendingReminder = useNotificationNavigation();
  useSessionExpiry();

  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const ready = fontsLoaded && restored;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={buildNavigationTheme(palette)}
      onReady={tryOpenPendingReminder}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator initialRouteName={homeRouteFor(role)} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
