import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme, // Import to detect the current theme
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const NotificationScreen = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === 'dark';
  const headerBackgroundColor = isDarkMode ? '#000' : '#fff';
  const headerTextColor = isDarkMode ? '#fff' : '#333';
  const searchBackgroundColor = isDarkMode ? '#555' : '#f0f0f0';
  const inputTextColor = isDarkMode ? '#fff' : '#000';
  const filterIconBackgroundColor = isDarkMode
    ? '#444'
    : 'linear-gradient(90deg, #4e54c8, #8f94fb)';

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#000' : '#fff'},
      ]}>
      <View style={[styles.header, {backgroundColor: headerBackgroundColor}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={headerTextColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: headerTextColor}]}>
          Notifications
        </Text>
      </View>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 15,
  },
  searchIconContainer: {
    position: 'absolute',
    left: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 30, // Add padding to make room for the search icon
  },
  filterIconContainer: {
    borderRadius: 20,
    padding: 8,
    marginLeft: 10,
  },
});
