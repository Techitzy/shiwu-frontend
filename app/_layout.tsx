import { Stack } from 'expo-router';
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

  useEffect(() => {
    SplashScreen.hideAsync();
    setIsReady(true);
  }, []);

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
          <Stack.Screen name="event/manage/[id]" options={{ title: 'Manage Users' }} />
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
