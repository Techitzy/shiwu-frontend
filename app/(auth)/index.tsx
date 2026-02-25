import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

export default function AuthIndex() {
    const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

    useEffect(() => {
        console.log('[AuthIndex] Checking hasLaunched in AsyncStorage...');
        AsyncStorage.getItem('hasLaunched')
            .then((value) => {
                console.log('[AuthIndex] AsyncStorage.getItem("hasLaunched") =>', value);
                if (value === null) {
                    console.log('[AuthIndex] First launch detected → setting hasLaunched & redirecting to walkthrough');
                    AsyncStorage.setItem('hasLaunched', 'true')
                        .then(() => console.log('[AuthIndex] AsyncStorage.setItem("hasLaunched", "true") ✓'))
                        .catch((err) => console.error('[AuthIndex] AsyncStorage.setItem failed:', err));
                    setIsFirstLaunch(true);
                } else {
                    console.log('[AuthIndex] Returning user → redirecting to login');
                    setIsFirstLaunch(false);
                }
            })
            .catch((err) => {
                console.error('[AuthIndex] AsyncStorage.getItem("hasLaunched") failed:', err);
                setIsFirstLaunch(false);
            });
    }, []);

    console.log('[AuthIndex] render — isFirstLaunch:', isFirstLaunch);

    // Wait until the AsyncStorage check is done before redirecting
    if (isFirstLaunch === null) return null;

    const destination = isFirstLaunch ? '/(auth)/walkthrough' : '/(auth)/login';
    console.log('[AuthIndex] Redirecting to:', destination);
    return <Redirect href={destination} />;
}
