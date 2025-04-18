import React, {useState, useEffect, useContext} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  useColorScheme, // Import useColorScheme
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TrendingEvent from '../home/TrendingEvents';
import {useBusinessContext} from '../../context/businessContext';
import {lightColors, darkColors, primaryColor} from '../../themes/basics';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {EventContext} from '../../context/EventContext';
import {formatDate, formatTime} from '../../services/utils';
import {UserContext} from '../../context/UserContext';
import SkeletonTabLoader from '../skeletonLoaders/SkeletonTabLoader';
import SkeletonEventLoader from '../skeletonLoaders/SkeletonEventLoader';

const HomeScreen = () => {
  const {user, setUser} = useContext(UserContext);
  const {events, eventsLoading, fetchAllEvents} = useContext(EventContext);
  const {loading, fetchCategories} = useContext(EventContext);
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('All');
  const [categories, setCategories] = useState([]);

  const theme = useColorScheme();
  const colorScheme = useColorScheme();

  const isDarkTheme = colorScheme === 'dark';
  const textColor = isDarkTheme ? darkColors.textColor : lightColors.textColor;

  const getFilteredEvents = () => {
    const filteredByCategory =
      activeTab === 'All'
        ? events
        : events.filter(event =>
            event.categories.some(category => category.name === activeTab),
          );

    // Assuming event.location is the property where event's location is stored
    const filteredByLocation = filteredByCategory.filter(
      event => event.location === user.location,
    );

    return filteredByCategory;
  };

  const fetchData = async () => {
    try {
      const categoriesPromise = fetchCategories();
      const eventsPromise = fetchAllEvents();

      const [eventsFromServer, categoriesFromServer] = await Promise.all([
        eventsPromise,
        categoriesPromise,
      ]);

      setCategories(categoriesFromServer.slice(0, 7));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', e => {
      if (e.data?.state?.routes) {
        const currentRoute =
          e.data.state.routes[e.data.state.routes.length - 1];
        if (currentRoute.params?.fromDelete) {
          fetchData();
          navigation.setParams({fromDelete: undefined});
        }
      }
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchData();
  }, []);

  const tabs = [{id: 'all', label: 'All'}, ...categories];

  // Define dynamic styles based on theme
  const dynamicStyles = styles(theme);

  return (
    <ScrollView
      style={dynamicStyles.container}
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}>
      <View style={dynamicStyles.tabContainer}>
        {loading ? (
          <SkeletonTabLoader theme={theme} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={dynamicStyles.horizontalContainer}>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setActiveTab(tab.label)}
                style={dynamicStyles.tab}>
                {activeTab === tab.label ? (
                  <View
                    style={[
                      dynamicStyles.activeTab,
                      {backgroundColor: primaryColor.main},
                    ]}>
                    <Text style={dynamicStyles.activeTabText}>{tab.label}</Text>
                  </View>
                ) : (
                  <Text style={dynamicStyles.tabText}>{tab.label}</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
      {eventsLoading ? (
        <SkeletonEventLoader theme={theme} />
      ) : getFilteredEvents().length > 0 ? (
        <>
          {/* <View style={{paddingHorizontal: 5}}>
            <Text style={dynamicStyles.trendingTitle}>TRENDING EVENTS</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={dynamicStyles.imageScroll}>
              {getFilteredEvents().map(event => (
                <View key={event.id} style={dynamicStyles.eventImageContainer}>
                  <View style={dynamicStyles.imageWithDateContainer}>
                    <Image
                      source={{uri: event.banner_img}}
                      style={dynamicStyles.eventImage}
                    />
                    <View style={dynamicStyles.dateContainer}>
                      <Text style={dynamicStyles.dateText}>
                        {formatDate(event.datetime)}
                      </Text>
                    </View>
                    <View style={dynamicStyles.nameContainer}>
                      <Text style={dynamicStyles.nameText}>{event.title}</Text>
                    </View>

                    <View style={dynamicStyles.timeCityContainer}>
                      <View style={dynamicStyles.timeCityItem}>
                        <Ionicons name="time-outline" size={20} color="#fff" />
                        <Text style={dynamicStyles.timeText}>
                          {formatTime(event.datetime)}
                        </Text>
                      </View>
                      <View style={dynamicStyles.timeCityItem}>
                        <Ionicons
                          name="location-outline"
                          size={20}
                          color="#fff"
                        />
                        <Text style={dynamicStyles.cityText}>
                          {event.address}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View> */}

          <View style={dynamicStyles.trendingEventsContainer}>
            <Text style={[dynamicStyles.trendingTitle, {color: textColor}]}>
              {getFilteredEvents().length} EVENTS IN YOUR AREA
            </Text>

            {getFilteredEvents()
              .slice(0, 10)
              .map(event => (
                <TrendingEvent key={event.id} event={event} />
              ))}
            {getFilteredEvents().length > 10 && (
              <TouchableOpacity
                onPress={() => navigation.navigate('AllEvents')}>
                <View style={dynamicStyles.seeAllEventsContainer}>
                  <Text
                    style={[
                      dynamicStyles.seeAllEventsText,
                      {color: primaryColor.main},
                    ]}>
                    See All Events
                  </Text>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                      name="arrow-forward"
                      size={24}
                      color={primaryColor.main}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : (
        <View style={dynamicStyles.noEventsContainer}>
          <TouchableOpacity
            style={dynamicStyles.searchIconContainer}
            onPress={() => navigation.navigate('Search')}>
            <Ionicons
              name="search-outline"
              size={24}
              color={dynamicStyles.iconColor}
            />
          </TouchableOpacity>
          <Text style={dynamicStyles.noEventsText}>No Events Found</Text>
          <Text style={dynamicStyles.noEventsDescription}>
            We couldn't find any event with current filters
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default HomeScreen;

// Define dynamic styles based on theme
const styles = theme =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 5,
      paddingTop: 10,
      backgroundColor: theme === 'dark' ? '#121212' : '#fff',
      height: '100%',
    },
    tabContainer: {
      flexDirection: 'row',
    },
    tab: {
      paddingVertical: 15,
      paddingHorizontal: 15,
      marginRight: 5,
      borderRadius: 20,
    },
    tabText: {
      fontSize: 16,
      color: theme === 'dark' ? '#ddd' : '#333',
      marginTop: 5,
    },
    activeTab: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 10,
    },
    activeTabText: {
      color: '#fff',
      fontSize: 16,
    },
    imageScroll: {
      marginBottom: 20,
      marginTop: 10,
    },
    eventImageContainer: {
      marginRight: 15,
      alignItems: 'center',
    },
    imageWithDateContainer: {
      position: 'relative',
    },
    eventImage: {
      width: 300,
      height: 250,
      borderRadius: 30,
      marginBottom: 5,
    },
    dateContainer: {
      position: 'absolute',
      top: 20,
      right: 20,
      paddingVertical: 5,
      paddingHorizontal: 8,
      borderWidth: 2,
      borderRadius: 7,
      borderColor: '#fff',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dateText: {
      color: '#fff',
      fontSize: 12,
    },
    nameContainer: {
      position: 'absolute',
      top: 100,
      left: 20,
      paddingVertical: 5,
      paddingHorizontal: 8,
    },
    timeCityContainer: {
      position: 'absolute',
      top: 220,
      left: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '50%',
    },
    timeCityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 10,
    },
    nameText: {
      position: 'absolute',
      top: 80,
      left: 0,
      color: '#fff',
      fontSize: 25,
    },
    timeText: {
      color: '#fff',
      fontSize: 14,
      marginLeft: 5,
    },
    cityText: {
      color: '#fff',
      fontSize: 14,
      marginLeft: 5,
    },

    trendingEventsContainer: {
      borderRadius: 10,
      padding: 10,
    },
    trendingHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    trendingTitle: {
      marginBottom: 10,
      fontSize: 20,
      fontWeight: '400',
      color: theme === 'dark' ? '#fff' : '#000',
    },
    seeAllButton: {
      alignItems: 'center',
      paddingVertical: 8,
      borderRadius: 25,
      marginLeft: 'auto',
      width: 100,
    },
    seeAllText: {
      fontWeight: 'bold',
      textDecorationLine: 'underline',
      color: theme === 'dark' ? '#fff' : '#1e3c72',
    },
    seeAllEventsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: primaryColor.main,
      marginBottom: 30,
    },
    seeAllEventsText: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    noEventsContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    },
    searchIconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    noEventsText: {
      fontSize: 16,
      color: theme === 'dark' ? '#ddd' : '#333',
    },
    noEventsDescription: {
      marginTop: 10,
      width: '60%',
      fontSize: 14,
      color: theme === 'dark' ? '#aaa' : '#666',
      textAlign: 'center',
    },
    iconColor: primaryColor.main,
  });
