// SeeMoreScreen.js
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TrendingEvent from '../../home/TrendingEvents';
import {lightColors, darkColors, primaryColor} from '../../../themes/basics';

const SeeMoreScreen = ({route}) => {
  const {events, title} = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();

  const isDarkTheme = colorScheme === 'dark';
  const backgroundColor = isDarkTheme
    ? darkColors.backgroundColor
    : lightColors.backgroundColor;
  const textColor = isDarkTheme ? darkColors.textColor : lightColors.textColor;
  const headerTextColor = isDarkTheme
    ? darkColors.headerTextColor
    : lightColors.headerTextColor;

  // Filter events based on search query
  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const navigation = useNavigation();

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={26} color={textColor} />
        </TouchableOpacity>
        <TextInput
          style={styles.searchBar}
          placeholder={`Search ${title}`}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.trendingEventsContainer}>
        {filteredEvents.map(event => (
          <TrendingEvent key={event.id} event={event} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  searchBar: {
    height: 40,
    width: '90%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginLeft: 10,
    padding: 10,
  },
  eventCard: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    marginBottom: 12,
    borderRadius: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewDetails: {
    color: primaryColor.main,
    marginTop: 8,
  },
  trendingEventsContainer: {
    borderRadius: 10,
    padding: 20,
  },
});

export default SeeMoreScreen;
