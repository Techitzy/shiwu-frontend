import {useNavigation} from '@react-navigation/native';
import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, useColorScheme} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {UserContext} from '../context/UserContext';

const CustomHeader = () => {
  const {user, setUser} = useContext(UserContext);
  const theme = useColorScheme();
  const navigation = useNavigation();
  const styles = getStyles(theme);
  const location = user?.location;

  return (
    <View style={styles.headerContainer}>
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>Hi, {user.full_name}</Text>
        <View style={styles.locationContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SelectLocation', {location})}
            style={styles.locationButton}>
            <Ionicons
              name="location-outline"
              size={16}
              color={styles.iconColor}
            />
            <Text style={styles.locationText}>{location}</Text>
            <Ionicons
              style={styles.forwardIcon}
              name="chevron-forward"
              size={10}
              color={styles.iconColor}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={styles.iconColor}
            onPress={() => navigation.navigate('Notification')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{marginLeft: 15}}>
          <Ionicons
            name="search-outline"
            size={24}
            color={styles.iconColor}
            onPress={() => navigation.navigate('Search')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomHeader;

// Function to get styles based on the theme
const getStyles = theme => {
  const isDarkMode = theme === 'dark';

  return {
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 5,
      paddingVertical: 10,
      backgroundColor: isDarkMode ? '#333' : '#fff',
      borderColor: isDarkMode ? '#444' : '#ddd',
    },
    avatar: {width: 40, height: 40, borderRadius: 20},
    greetingContainer: {flex: 1, marginLeft: 10},
    greetingText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#333',
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 3,
    },
    locationButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    locationText: {
      fontSize: 14,
      color: isDarkMode ? '#ccc' : '#666',
      marginLeft: 5,
    },
    forwardIcon: {
      marginLeft: 4,
    },
    iconContainer: {flexDirection: 'row', alignItems: 'center'},
    iconColor: isDarkMode ? '#fff' : '#333',
  };
};
