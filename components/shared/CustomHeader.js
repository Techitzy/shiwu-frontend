import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext } from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../../context/UserContext';

const CustomHeader = () => {
  const { user } = useContext(UserContext);
  const theme = useColorScheme();
  const router = useRouter();
  const styles = getStyles(theme);
  const location = user?.location || 'Select Location';

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Hi, {user?.full_name || 'Guest'}</Text>
          <View style={styles.locationContainer}>
            <TouchableOpacity
              onPress={() => router.push('/location/select')}
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
          <TouchableOpacity onPress={() => router.push('/notification')}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={styles.iconColor}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => router.push('/search')}>
            <Ionicons
              name="search-outline"
              size={24}
              color={styles.iconColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
      paddingHorizontal: 15,
      paddingVertical: 10,
      backgroundColor: isDarkMode ? '#121212' : '#fff',
      borderBottomWidth: 0.5,
      borderBottomColor: isDarkMode ? '#333' : '#ddd',
    },
    avatar: { width: 40, height: 40, borderRadius: 20 },
    greetingContainer: { flex: 1, marginLeft: 10 },
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
    iconContainer: { flexDirection: 'row', alignItems: 'center' },
    iconColor: isDarkMode ? '#fff' : '#333',
  };
};
