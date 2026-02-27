import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import EventSection from '../../components/shared/profile/EventSection';
import { useBusinessContext } from '../../context/businessContext';
import { UserContext } from '../../context/UserContext';
import { darkColors, lightColors, primaryColor } from '../../themes/basics';

const { width: screenWidth } = Dimensions.get('window');

const ProfileScreen = () => {
  const { user } = useContext(UserContext);
  const {
    events,
    userPostedEvents,
    recentEvents,
    pastEvents,
    isLoading,
    fetchUserPostedEvents,
  } = useBusinessContext();
  const colorScheme = useColorScheme();
  const router = useRouter();

  const isDarkTheme = colorScheme === 'dark';
  const backgroundColor = isDarkTheme
    ? darkColors.backgroundColor
    : lightColors.backgroundColor;
  const textColor = isDarkTheme ? darkColors.textColor : lightColors.textColor;

  const [activeSection, setActiveSection] = useState('attended');
  const scrollViewRef = useRef();

  const sections = ['attended', 'posted'];

  useEffect(() => {
    if (activeSection === 'posted') {
      fetchUserPostedEvents();
    }
  }, [activeSection]);

  const handleTabPress = section => {
    setActiveSection(section);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={[styles.headerTitle, { color: textColor }]}>Profile</Text>
          <TouchableOpacity onPress={() => router.push('/profile/settings')}>
            <MaterialIcons name="settings" size={26} color={textColor} />
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Avatar.Image
            source={{ uri: user?.profile_pic }}
            size={100}
            style={styles.avatar}
          />
        </View>
        <Text style={[styles.userName, { color: textColor }]}>
          {user?.full_name || 'User Name'}
        </Text>
        <Text style={[styles.bio, { color: textColor }]}>
          {user?.bio || 'This is your bio'}
        </Text>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {sections.map(section => (
            <TouchableOpacity
              key={section}
              style={[styles.tab, activeSection === section && styles.activeTab]}
              onPress={() => handleTabPress(section)}>
              <Text style={[styles.tabText, { color: textColor }]}>
                {section === 'attended' ? 'My Tickets' : 'My Events'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Swipeable Content */}
        <ScrollView>
          {activeSection === 'attended' && (
            <>
              {events && events.length === 0 ? (
                <View style={styles.noEventsContainer}>
                  <Text style={[styles.noEventsText, { color: textColor }]}>
                    You haven't booked any events, start booking now by clicking
                    below.
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push('/(tabs)')}
                    style={styles.checkOutButton}>
                    <Text style={styles.checkOutText}>
                      Check out events in your area
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <EventSection
                    title="Recent Bookings"
                    data={events}
                    onSeeMore={() =>
                      router.push({
                        pathname: '/profile/see-more',
                        params: { title: 'Recent Bookings', events: JSON.stringify(events) }
                      })
                    }
                  />
                  <EventSection
                    title="Past Events"
                    data={events}
                    onSeeMore={() =>
                      router.push({
                        pathname: '/profile/see-more',
                        params: { title: 'Past Events', events: JSON.stringify(events) }
                      })
                    }
                  />
                </>
              )}
            </>
          )}
          {activeSection === 'posted' && (
            <>
              {isLoading ? (
                <ActivityIndicator size="large" color={primaryColor.main} />
              ) : userPostedEvents.length === 0 ? (
                <View style={styles.noEventsContainer}>
                  <Text style={[styles.noEventsText, { color: textColor }]}>
                    You haven't posted any events yet. Start posting now by
                    clicking below.
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.push('/(tabs)/create')}
                    style={styles.checkOutButton}>
                    <Text style={styles.checkOutText}>
                      Create your first event
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <EventSection
                    title="Upcoming Events"
                    data={recentEvents}
                    onSeeMore={() =>
                      router.push({
                        pathname: '/profile/see-more',
                        params: { title: 'Upcoming Events', events: JSON.stringify(recentEvents) }
                      })
                    }
                  />
                  <EventSection
                    title="Past Events"
                    data={pastEvents}
                    onSeeMore={() =>
                      router.push({
                        pathname: '/profile/see-more',
                        params: { title: 'Past Events', events: JSON.stringify(pastEvents) }
                      })
                    }
                  />
                </>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  avatar: {
    backgroundColor: '#f0f0f0',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bio: {
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: primaryColor.main,
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noEventsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  noEventsText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  checkOutButton: {
    backgroundColor: primaryColor.main,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  checkOutText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
