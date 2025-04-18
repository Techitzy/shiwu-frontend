import React, {useContext, useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {UserContext} from '../../../context/UserContext';
import EventSection from '../../profile/EventSection';
import {useBusinessContext} from '../../../context/businessContext';
import {lightColors, darkColors, primaryColor} from '../../../themes/basics';

const {width: screenWidth} = Dimensions.get('window');

const ProfileScreen = () => {
  const {user} = useContext(UserContext);
  const {
    events,
    userPostedEvents,
    recentEvents,
    pastEvents,
    isLoading,
    fetchUserPostedEvents,
  } = useBusinessContext();
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const isDarkTheme = colorScheme === 'dark';
  const backgroundColor = isDarkTheme
    ? darkColors.backgroundColor
    : lightColors.backgroundColor;
  const textColor = isDarkTheme ? darkColors.textColor : lightColors.textColor;
  const headerTextColor = isDarkTheme
    ? darkColors.headerTextColor
    : lightColors.headerTextColor;

  const [activeSection, setActiveSection] = useState('attended');
  const scrollViewRef = useRef();

  const sections = ['attended', 'posted'];

  useEffect(() => {
    const initialIndex = sections.indexOf(activeSection);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: initialIndex * screenWidth,
        animated: false,
      });
    }
    if (activeSection === 'posted') {
      fetchUserPostedEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  const handleTabPress = section => {
    const index = sections.indexOf(section);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * screenWidth,
        animated: true,
      });
    }
    setActiveSection(section);
  };

  return (
    <View style={[styles.container, {backgroundColor}]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, {color: textColor}]}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
          <MaterialIcons name="settings" size={26} color={textColor} />
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Avatar.Image
          source={{uri: user?.profile_pic}}
          size={100}
          style={styles.avatar}
        />
      </View>
      <Text style={[styles.userName, {color: textColor}]}>
        {user?.full_name || 'User Name'}
      </Text>
      <Text style={[styles.bio, {color: textColor}]}>
        {user?.bio || 'This is your bio'}
      </Text>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {sections.map(section => (
          <TouchableOpacity
            key={section}
            style={[styles.tab, activeSection === section && styles.activeTab]}
            onPress={() => handleTabPress(section)}>
            <Text style={[styles.tabText, {color: textColor}]}>
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
                <Text style={[styles.noEventsText, {color: textColor}]}>
                  You haven't booked any events, start booking now by clicking
                  below.
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Home')}
                  style={styles.checkOutButton}>
                  <Text style={styles.checkOutText}>
                    Check out events in your area
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* Your Event Sections */}
                <EventSection
                  title="Recent Bookings"
                  data={events}
                  onSeeMore={() =>
                    navigation.navigate('SeeMore', {
                      events,
                      title: 'Recent Bookings',
                    })
                  }
                />
                <EventSection
                  title="Past Events"
                  data={events}
                  onSeeMore={() =>
                    navigation.navigate('SeeMore', {
                      events,
                      title: 'Past Events',
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
                <Text style={[styles.noEventsText, {color: textColor}]}>
                  You haven't posted any events yet. Start posting now by
                  clicking below.
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('CreateEvent')}
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
                    navigation.navigate('SeeMore', {
                      events: recentEvents,
                      title: 'Upcoming Events',
                    })
                  }
                />
                <EventSection
                  title="Past Events"
                  data={pastEvents}
                  onSeeMore={() =>
                    navigation.navigate('SeeMore', {
                      events: pastEvents,
                      title: 'Past Events',
                    })
                  }
                />
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
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
  },
  noEventsText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  checkOutButton: {
    backgroundColor: primaryColor.main,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  checkOutText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ProfileScreen;
