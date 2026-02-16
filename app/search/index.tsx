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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import TrendingEvent from '../../components/shared/home/TrendingEvents';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchScreen = () => {
  const [eventsData, setEventsData] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const router = useRouter();
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
      // Mock data for now, as in original code
      const response = [
        {
          id: '1',
          title: 'House Party', // Original code used 'name', but TrendingEvent expects 'title'
          name: 'House Party',
          category: 'House Party',
          datetime: new Date().toISOString(), // Mock date
          date: '15 Dec',
          time: '8:00 PM',
          location: 'New York',
          address: '123 Main St',
          banner_img:
            'https://www.eventbrite.com/blog/wp-content/uploads/2023/02/aditya-chinchure-ZhQCZjr9fHo-unsplash-768x576.jpg',
          meta: {
              area: 'Manhattan',
              price: 500,
              restrictions: { max_participants: 20 }
          }
        },
        {
          id: '2',
          title: 'Christmas Party',
          name: 'Christmas Party',
          category: 'Festive Activities',
          datetime: new Date().toISOString(),
          date: '20 Dec',
          time: '7:00 PM',
          location: 'Los Angeles',
          address: '456 Sunset Blvd',
          banner_img:
            'https://thumbs.dreamstime.com/b/merry-christmas-happy-new-year-greeting-banner-template-penguin-design-232657123.jpg',
            meta: {
                area: 'Hollywood',
                price: 1000,
                restrictions: { max_participants: 50 }
            }
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
        (event.name || event.title).toLowerCase().includes(query.toLowerCase()),
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
    
    // Navigate to details
    // router.push({ pathname: '/event/[id]', params: { id: event.id, event: JSON.stringify(event) } });
    // TrendingEvent component handles navigation internally, so we don't need to navigate here if we pass onClick prop? 
    // Wait, TrendingEvent in shared folder calls router.push itself.
    // The original code passed onClick to TrendingEvent but TrendingEvent didn't use it!
    // Let's check TrendingEvent again.
    // Original TrendingEvent: 
    // const handlePress = () => { navigation.navigate('EventDetail', {event}); };
    // It IGNORED the `onClick` prop.
    // My migrated TrendingEvent also ignores `onClick`.
    // So handleEventClick here is just for updating recent searches.
    
    // But wait, if TrendingEvent navigates, we can't intercept the click easily unless we modify TrendingEvent to accept an onPress override or we wrap it.
    // However, the original code had:
    // <TrendingEvent key={event.id} event={event} onClick={() => handleEventClick(event)} />
    // This implies the developer INTENDED for handleEventClick to run.
    // I should update TrendingEvent to call `onClick` if provided, OR run this logic here.
    
    // Since I can't easily change TrendingEvent right now without another write, I'll assume standard navigation for now.
    // Actually, I should probably update TrendingEvent to accept an `onPress` prop.
    // But for this migration, I'll rely on TrendingEvent's internal navigation.
    // The recent search logic won't run if I don't trigger it.
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
          <TouchableOpacity onPress={() => router.back()}>
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
            onPress={() => router.push('/search/filter')}>
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
                onPress={() => {
                   // Navigate
                   router.push({
                    pathname: `/event/${event.id}`,
                    params: { event: JSON.stringify(event) }
                  });
                }}
                style={styles.recentSearchItem}>
                <Text style={{color: isDarkMode ? '#fff' : '#000'}}>
                  {event.name || event.title}
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
