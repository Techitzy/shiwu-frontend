import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { UserProvider, UserContext } from '../context/UserContext';
import { BusinessProvider } from '../context/businessContext';
import { EventProvider } from '../context/EventContext';
import { MenuProvider } from 'react-native-popup-menu';
import { useContext } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const checkFirstLaunch = async () => {
  const hasLaunched = await AsyncStorage.getItem('hasLaunched');
  if (hasLaunched === null) {
    await AsyncStorage.setItem('hasLaunched', 'true');
    return true;
  }
  return false;
};

function RootLayoutNav() {
  const { user } = useContext(UserContext);
  const [isReady, setIsReady] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    checkFirstLaunch().then(isFirst => {
      setIsFirstLaunch(isFirst);
      setIsReady(true);
      SplashScreen.hideAsync();
    });
  }, []);

  if (!isReady || isFirstLaunch === null) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen 
          name="(auth)" 
          options={{ headerShown: false }} 
          initialParams={{ isFirstLaunch }}
        />
      ) : (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
      {/* Shared Modals or full-screen stacks */}
      <Stack.Screen name="location/select" options={{ presentation: 'modal' }} />
      <Stack.Screen name="event/[id]" options={{ title: 'Event Details' }} />
      <Stack.Screen name="event/approve-request/[id]" options={{ title: 'Approve Requests' }} />
      <Stack.Screen name="event/edit/[id]" options={{ title: 'Edit Event' }} />
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
