/* eslint-disable react/no-unstable-nested-components */
import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../components/screens/HomeScreen';
import CreateEventScreen from '../components/screens/CreateEventScreen';
import ProfileScreen from '../components/screens/Profile/ProfileScreen';
import CustomHeader from '../components/CustomHeader';
import {UserContext} from '../context/UserContext';
import {useColorScheme, View, Text} from 'react-native';
import SearchScreen from '../components/screens/SearchScreen';
import NotificationScreen from '../components/screens/NotificationScreen';
import SearchFilterScreen from '../components/screens/SearchFilterScreen';
import EventDetailScreen from '../components/screens/Event/EventDetailsScreen';
import CreateScreen from '../components/screens/CreateScreen';
import SettingsScreen from '../components/screens/Profile/SettingsScreen';
import EditProfileScreen from '../components/screens/Profile/EditProfile/EditProfileScreen';
import EditPersonalInfoScreen from '../components/screens/Profile/EditProfile/EditPersonalInfoScreen';
import SeeMoreScreen from '../components/screens/Profile/SeeMoreScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const shouldHideTabBar = route => {
  const routeName = route?.state?.routes?.[route.state.index]?.name;
  // Add screens where you want the tab bar hidden
  return ['SettingsScreen'].includes(routeName);
};

const HomeStack = ({user, location}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        animationEnabled: true,
        cardStyleInterpolator: ({current, next, layouts}) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          header: () => <CustomHeader user={user} location={location} />,
        }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SearchFilter"
        component={SearchFilterScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const CreateStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        presentation: 'modal',
        cardStyleInterpolator: ({current, layouts}) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateY: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.height, 0], // Animate bottom-to-top
                  }),
                },
              ],
            },
          };
        },
        gestureEnabled: true, // Allows swipe down to close
        gestureDirection: 'vertical',
      }}>
      <Stack.Screen
        name="CreateScreen"
        component={CreateScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CreateEventScreen"
        component={CreateEventScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        animationEnabled: true,
        cardStyleInterpolator: ({current, next, layouts}) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}>
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditPersonalInfoScreen"
        component={EditPersonalInfoScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SeeMore"
        component={SeeMoreScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  const user = useContext(UserContext);
  const location = user ? user.user.location : 'Loading...';
  const colorScheme = useColorScheme();

  // Adjust colors based on the color scheme
  const isDarkMode = colorScheme === 'dark';
  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const activeTintColor = isDarkMode ? '#fff' : '#7373FF';
  const inactiveTintColor = isDarkMode ? '#A9A9A9' : '#888';

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size, focused}) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Create') iconName = 'add-circle-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: ({focused, color}) =>
          focused ? (
            <Text
              style={{
                color,
                fontWeight: 'bold',
                fontSize: 12,
              }}>
              {route.name}
            </Text>
          ) : null,
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor,
          borderTopWidth: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'hidden',
        },
      })}
      sceneContainerStyle={{backgroundColor}}>
      <Tab.Screen
        name="Home"
        children={() => <HomeStack user={user.user} location={location} />}
        options={{
          headerShown: false,
          tabBarStyle: {backgroundColor},
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateStack}
        options={{
          headerShown: false,
          tabBarStyle: {backgroundColor},
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          headerShown: false,
          tabBarStyle: {backgroundColor},
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
