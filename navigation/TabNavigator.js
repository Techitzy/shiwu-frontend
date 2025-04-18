import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useColorScheme, Text} from 'react-native';
import HomeScreen from '../components/screens/HomeScreen';
import CreateEventScreen from '../components/screens/CreateEventScreen';
import ProfileScreen from '../components/screens/Profile/ProfileScreen';
import SearchScreen from '../components/screens/SearchScreen';
import NotificationScreen from '../components/screens/NotificationScreen';
import SearchFilterScreen from '../components/screens/SearchFilterScreen';
import EventDetailScreen from '../components/screens/Event/EventDetailsScreen';
import CreateScreen from '../components/screens/CreateScreen';
import SettingsScreen from '../components/screens/Profile/SettingsScreen';
import EditProfileScreen from '../components/screens/Profile/EditProfile/EditProfileScreen';
import EditPersonalInfoScreen from '../components/screens/Profile/EditProfile/EditPersonalInfoScreen';
import SeeMoreScreen from '../components/screens/Profile/SeeMoreScreen';
import {UserContext} from '../context/UserContext';
import CustomHeader from '../components/CustomHeader';
import SelectLocationScreen from '../components/home/SelectLocationScreen';
import EditEventScreen from '../components/screens/EditEventScreen';
import ApproveRequestScreen from '../components/screens/Event/ApproveRequestScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CreateStack = () => (
  <Stack.Navigator
    mode="modal"
    screenOptions={{
      headerShown: false,
      gestureEnabled: true,
      cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, // This interpolator makes the screen slide up from the bottom
    }}>
    <Stack.Screen name="CreateEventScreen" component={CreateEventScreen} />
  </Stack.Navigator>
);
const TabNavigator = ({
  user,
  location,
  backgroundColor,
  activeTintColor,
  inactiveTintColor,
}) => (
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
        overflow: 'hidden',
      },
    })}
    sceneContainerStyle={{backgroundColor}}>
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        header: () => <CustomHeader />,
      }}
    />
    <Tab.Screen
      name="Create"
      component={CreateStack}
      listeners={({navigation}) => ({
        tabPress: e => {
          // Prevent default action
          e.preventDefault();
          navigation.navigate('CreateEventScreen');
        },
      })}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{headerShown: false}}
    />
  </Tab.Navigator>
);

const MainNavigator = () => {
  const user = useContext(UserContext);
  const location = user?.user?.location || 'Loading...';
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const activeTintColor = isDarkMode ? '#fff' : '#7373FF';
  const inactiveTintColor = isDarkMode ? '#A9A9A9' : '#888';

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animationEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen
        name="MainTabs"
        children={() => (
          <TabNavigator
            user={user}
            location={location}
            backgroundColor={backgroundColor}
            activeTintColor={activeTintColor}
            inactiveTintColor={inactiveTintColor}
          />
        )}
      />
      <Stack.Screen
        name="SelectLocation"
        component={SelectLocationScreen}
        options={{
          headerShown: false,
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
        name="Notification"
        component={NotificationScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      <Stack.Screen name="ApproveRequest" component={ApproveRequestScreen} />
      <Stack.Screen
        name="CreateEventScreen"
        component={CreateEventScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditEventScreen"
        component={EditEventScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen
        name="EditPersonalInfoScreen"
        component={EditPersonalInfoScreen}
      />
      <Stack.Screen name="SeeMore" component={SeeMoreScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
