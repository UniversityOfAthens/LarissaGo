import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // We'll keep track of whether the user is authenticated.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // And also whether we've finished checking auth.
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      const authStatus = !!token;
      setIsAuthenticated(authStatus);
      setAuthChecked(true);

      // If not authenticated, immediately redirect to login
      if (!authStatus) {
        router.replace('/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Wait until fonts and auth are checked before rendering any screens.
  if (!loaded || !authChecked) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName={isAuthenticated ? "dashboard" : "login"}>
        <Stack.Screen
          name="login"
          options={{
            title: 'Login',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            title: 'Sign Up',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="account"
          options={{
            title: 'Account',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="activities"
          options={{
            title: 'Activities',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="rewards"
          options={{
            title: 'Rewards',
            headerShown: false,
          }}
        />
        {/* Additional screens */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
