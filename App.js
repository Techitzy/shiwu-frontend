import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {UserProvider, UserContext} from './context/UserContext';
import {BusinessProvider} from './context/businessContext';
import TabNavigator from './navigation/TabNavigator';
import LoginScreen from './components/LoginScreen';
import EmailSentScreen from './components/EmailSentScreen';
import VerifyingScreen from './components/VerifyingScreen';
import SignUpScreen from './components/SignUpScreen';
import {createStackNavigator} from '@react-navigation/stack';
import ForgotPasswordScreen from './components/ForgotPassword/ForgotPasswordScreen';
import VerifyEmailScreen from './components/ForgotPassword/VerifyEmailScreen';
import SetPasswordScreen from './components/ForgotPassword/SetPasswordScreen';
import {EventProvider} from './context/EventContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WalkthroughScreen from './components/screens/WalkthroughScreen';
import {MenuProvider} from 'react-native-popup-menu';

const checkFirstLaunch = async () => {
  const hasLaunched = await AsyncStorage.getItem('hasLaunched');
  if (hasLaunched === null) {
    await AsyncStorage.setItem('hasLaunched', 'true');
    return true;
  }
  return false;
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <MenuProvider>
      <UserProvider>
        <BusinessProvider>
          <EventProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </EventProvider>
        </BusinessProvider>
      </UserProvider>
    </MenuProvider>
  );
}

const RootNavigator = () => {
  const {user} = useContext(UserContext);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    checkFirstLaunch().then(isFirst => {
      setIsFirstLaunch(isFirst);
    });
  }, []);

  if (isFirstLaunch === null) {
    return null;
  }

  if (!user) {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isFirstLaunch && (
          <Stack.Screen name="Walkthrough" component={WalkthroughScreen} />
        )}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="EmailSentScreen" component={EmailSentScreen} />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
        />
        <Stack.Screen name="SetPasswordScreen" component={SetPasswordScreen} />
        <Stack.Screen name="VerifyEmailScreen" component={VerifyEmailScreen} />
        <Stack.Screen name="VerifyingScreen" component={VerifyingScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      </Stack.Navigator>
    );
  }

  return <TabNavigator />;
};
