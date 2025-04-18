import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import TrendingEvent from '../home/TrendingEvents';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchScreen = () => {
  const [eventsData, setEventsData] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Conditionally set colors based on the theme
  const headerTextColor = isDarkMode ? '#fff' : '#333';
  const searchBackgroundColor = isDarkMode ? '#555' : '#fff';
  const searchBorderColor = isDarkMode ? '#fff' : '#000';
  const inputTextColor = isDarkMode ? '#fff' : '#000';
  const placeholderTextColor = isDarkMode ? '#ccc' : '#666';
  const filterIconColor = isDarkMode ? '#fff' : '#000';
  const filterIconBackgroundColor = isDarkMode ? '#444' : '#f0f0f0';
  const backgroundColor = isDarkMode ? '#121212' : '#fff';

  useEffect(() => {
    const fetchEvents = async () => {
      const response = [
        {
          id: '1',
          name: 'House Party',
          category: 'House Party',
          date: '15 Dec',
          time: '8:00 PM',
          city: 'New York',
          imageUrl:
            'https://www.eventbrite.com/blog/wp-content/uploads/2023/02/aditya-chinchure-ZhQCZjr9fHo-unsplash-768x576.jpg',
        },
        {
          id: '2',
          name: 'Christmas Party',
          category: 'Festive Activities',
          date: '20 Dec',
          time: '7:00 PM',
          city: 'Los Angeles',
          imageUrl:
            'https://thumbs.dreamstime.com/b/merry-christmas-happy-new-year-greeting-banner-template-penguin-design-232657123.jpg',
        },
        {
          id: '3',
          name: 'Office Annual Meetup',
          category: 'Corporate Events',
          date: '1 Jan',
          time: '9:00 AM',
          city: 'San Francisco',
          imageUrl:
            'https://www.shutterstock.com/image-vector/dark-blue-purple-pink-golden-600nw-2227855465.jpg',
        },
        // Add other events here...
      ];
      setEventsData(response);
      setFilteredEvents([]);
    };

    fetchEvents();
  }, []);

  // Handle search query change
  const handleSearch = query => {
    setSearchQuery(query);

    if (query === '') {
      setFilteredEvents([]);
      setShowRecentSearches(true);
    } else {
      const filtered = eventsData.filter(event =>
        event.name.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredEvents(filtered);
      setShowRecentSearches(filtered.length === 0);
    }
  };

  // Store recent search in AsyncStorage
  const handleEventClick = async event => {
    const currentRecentSearches = await AsyncStorage.getItem('recentSearches');
    const recentSearches = currentRecentSearches
      ? JSON.parse(currentRecentSearches)
      : [];

    // Add the clicked event to the recent searches
    if (!recentSearches.some(item => item.id === event.id)) {
      recentSearches.push(event);
    }

    await AsyncStorage.setItem(
      'recentSearches',
      JSON.stringify(recentSearches),
    );
    setRecentSearches(recentSearches);
    setShowRecentSearches(false);
  };

  // Load recent searches from AsyncStorage
  useEffect(() => {
    const loadRecentSearches = async () => {
      const recentSearches = await AsyncStorage.getItem('recentSearches');
      if (recentSearches) {
        setRecentSearches(JSON.parse(recentSearches));
      }
    };
    loadRecentSearches();
  }, []);

  return (
    <ScrollView
      style={[styles.container, {backgroundColor}]}
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}>
      <View style={[{backgroundColor}]}>
        <View style={[styles.header, {backgroundColor}]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={headerTextColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: headerTextColor}]}>
            Search
          </Text>
        </View>

        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: searchBackgroundColor,
              borderRadius: 8,
              borderColor: searchBorderColor,
              borderWidth: 1,
            },
          ]}>
          <View style={styles.searchIconContainer}>
            <Ionicons name="search" size={20} color={inputTextColor} />
          </View>
          <TextInput
            placeholder="Search..."
            placeholderTextColor={placeholderTextColor}
            style={[styles.searchInput, {color: inputTextColor}]}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity
            style={[
              styles.filterIconContainer,
              {backgroundColor: filterIconBackgroundColor},
            ]}
            onPress={() => navigation.navigate('SearchFilter')}>
            <Ionicons name="filter" size={20} color={filterIconColor} />
          </TouchableOpacity>
        </View>

        {/* Conditionally show Recent Searches section */}
        {showRecentSearches && recentSearches.length > 0 && (
          <View style={styles.recentSearchesContainer}>
            <Text
              style={[
                styles.recentSearchesTitle,
                {color: isDarkMode ? '#fff' : '#000'},
              ]}>
              Recent Searches
            </Text>
            {recentSearches.map(event => (
              <TouchableOpacity
                key={event.id}
                onPress={() => handleEventClick(event)}
                style={styles.recentSearchItem}>
                <Text style={{color: isDarkMode ? '#fff' : '#000'}}>
                  {event.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Display filtered events based on search query */}
        <View style={styles.trendingEventsContainer}>
          {filteredEvents.length > 0 && (
            <>
              <Text
                style={[
                  styles.trendingTitle,
                  {color: isDarkMode ? '#fff' : '#000'},
                ]}>
                Matching Events
              </Text>
              {filteredEvents.map(event => (
                <TrendingEvent
                  key={event.id}
                  event={event}
                  onClick={() => handleEventClick(event)}
                />
              ))}
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 10,
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
    paddingLeft: 30,
  },
  filterIconContainer: {
    borderRadius: 20,
    padding: 8,
    marginLeft: 10,
  },
  trendingEventsContainer: {
    marginTop: 20,
    borderRadius: 10,
    padding: 10,
  },
  trendingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  recentSearchesContainer: {
    marginTop: 20,
  },
  recentSearchesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recentSearchItem: {
    paddingVertical: 10,
  },
});
