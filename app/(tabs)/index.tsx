import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import TrendingEvent from '../../components/shared/home/TrendingEvents';
import { EventContext } from '../../context/EventContext';
import { UserContext } from '../../context/UserContext';
import { darkColors, lightColors, primaryColor } from '../../themes/basics';

const HomeScreen = () => {
  const { user } = useContext(UserContext);
  const { events, eventsLoading, fetchAllEvents, fetchCategories, loading } = useContext(EventContext);
  const router = useRouter();
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
          event.categories?.some(category => category.name === activeTab),
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

      if (categoriesFromServer) {
        setCategories(categoriesFromServer.slice(0, 7));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const tabs = [{ id: 'all', label: 'All' }, ...categories.map(c => ({ id: c.id, label: c.name }))];

  const dynamicStyles = styles(theme);

  return (
    <ScrollView
      style={dynamicStyles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}>
      <View style={dynamicStyles.tabContainer}>
        {loading ? (
          // <SkeletonTabLoader theme={theme} />
          <></>
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
                      { backgroundColor: primaryColor.main },
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
        // <SkeletonEventLoader theme={theme} />
        <></>
      ) : getFilteredEvents().length > 0 ? (
        <View style={dynamicStyles.trendingEventsContainer}>
          <Text style={[dynamicStyles.trendingTitle, { color: textColor }]}>
            {getFilteredEvents().length} EVENTS IN YOUR AREA
          </Text>

          {getFilteredEvents()
            .slice(0, 10)
            .map(event => (
              <TrendingEvent key={event.id} event={event} />
            ))}
          {getFilteredEvents().length > 10 && (
            <TouchableOpacity
              onPress={() => router.push('/search')}>
              <View style={dynamicStyles.seeAllEventsContainer}>
                <Text
                  style={[
                    dynamicStyles.seeAllEventsText,
                    { color: primaryColor.main },
                  ]}>
                  See All Events
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={24}
                  color={primaryColor.main}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={dynamicStyles.noEventsContainer}>
          <TouchableOpacity
            style={dynamicStyles.searchIconContainer}
            onPress={() => router.push('/search')}>
            <Ionicons
              name="search-outline"
              size={24}
              color={primaryColor.main}
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
    trendingEventsContainer: {
      borderRadius: 10,
      padding: 10,
    },
    trendingTitle: {
      marginBottom: 10,
      fontSize: 20,
      fontWeight: '400',
      color: theme === 'dark' ? '#fff' : '#000',
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
      marginRight: 5,
    },
    noEventsContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      paddingTop: 50,
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
    horizontalContainer: {
      paddingRight: 20,
    }
  });
