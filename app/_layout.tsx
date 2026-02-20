import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useContext, useEffect, useState } from 'react';
import { MenuProvider } from 'react-native-popup-menu';
import { BusinessProvider } from '../context/businessContext';
import { EventProvider } from '../context/EventContext';
import { UserContext, UserProvider } from '../context/UserContext';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user } = useContext(UserContext);
  const [isReady, setIsReady] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const prepare = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (hasLaunched === null) {
          await AsyncStorage.setItem('hasLaunched', 'true');
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch {
        setIsFirstLaunch(false);
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    };
    prepare();
  }, []);

  // Redirect unauthenticated users on first load
  useEffect(() => {
    if (!isReady || user) return;
    if (isFirstLaunch) {
      router.replace('/(auth)/walkthrough');
    } else {
      router.replace('/(auth)/login');
    }
  }, [isReady, isFirstLaunch, user]);

  if (!isReady) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? (
        // ── Authenticated ─────────────────────────────────────────────────────
        // Auth screens are NOT registered here → back button has nowhere to go
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="location/select" options={{ presentation: 'modal' }} />
          <Stack.Screen name="event/[id]" options={{ title: 'Event Details' }} />
          <Stack.Screen name="event/approve-request/[id]" options={{ title: 'Approve Requests' }} />
          <Stack.Screen name="event/edit/[id]" options={{ title: 'Edit Event' }} />
        </>
      ) : (
        // ── Unauthenticated ───────────────────────────────────────────────────
        // Tabs are NOT registered here → user cannot deep-link into the app
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <MenuProvider>
      <UserProvider>
        <BusinessProvider>
          <EventProvider>
            <RootLayoutNav />
          </EventProvider>
        </BusinessProvider>
      </UserProvider>
    </MenuProvider>
  );
}
