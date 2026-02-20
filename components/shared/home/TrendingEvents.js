import { useRouter } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {lightColors, darkColors, primaryColor} from '../../../themes/basics';
import { Ionicons } from '@expo/vector-icons';
import {formatDate, formatTime} from '../../../services/utils';

const TrendingEvent = ({event}) => {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const isDarkTheme = colorScheme === 'dark';
  const textColor = isDarkTheme ? darkColors.textColor : lightColors.textColor;
  const eventInformation = isDarkTheme ? '#ddd' : '#333';

  const handlePress = () => {
    // Navigate to dynamic route and pass event object as a string parameter
    router.push({
      pathname: `/event/${event.id}`,
      params: { event: JSON.stringify(event) }
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.trendingEventItem, {backgroundColor: isDarkTheme ? '#333' : '#f9f9f9'}]}>
      <View style={styles.imageWithDateContainer}>
        <Image
          source={{uri: event.banner_img}}
          style={styles.trendingEventImage}
        />
      </View>
      <View style={styles.trendingEventDetails}>
        <Text
          style={[
            styles.trendingEventName,
            {color: textColor},
          ]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {event?.title?.toUpperCase()}
        </Text>
        <View style={styles.trendingEventTimeCity}>
          <View style={styles.timeContainer}>
            <Ionicons
              name="calendar-outline"
              size={12}
              color={eventInformation}
            />
            <Text style={[styles.trendingEventDate, {color: eventInformation}]}>
              {formatDate(event.datetime)}
            </Text>
          </View>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={12} color={eventInformation} />
            <Text style={[styles.trendingEventTime, {color: eventInformation}]}>
              {formatTime(event.datetime)}
            </Text>
          </View>
          <View style={styles.locationContainer}>
            <Ionicons
              name="location-outline"
              size={12}
              color={eventInformation}
            />
            <Text
              style={[
                styles.trendingEventCity,
                {color: eventInformation},
              ]}
              numberOfLines={1}
              ellipsizeMode="tail">
            {event?.meta?.area}, {event?.location}
            </Text>
          </View>
          <View style={styles.locationContainer}>
            <Ionicons
              name="person-outline"
              size={12}
              color={eventInformation}
            />
            <Text style={[styles.trendingEventCity, {color: eventInformation}]}>
              {5}/{event?.meta?.restrictions?.max_participants} filled
            </Text>
          </View>
        </View>
        {/* Price Tag */}
        <View style={styles.priceTag}>
          <Text style={[styles.priceText, {color: primaryColor.main}]}>
            Rs{event?.meta?.price}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  trendingEventItem: {
    flexDirection: 'row',
    marginBottom: 10,
    height: 120,
    borderRadius: 10,
    overflow: 'hidden', // Added to ensure radius clips content
    elevation: 2, // Added for slight shadow on Android
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  imageWithDateContainer: {
    position: 'relative',
  },
  trendingEventImage: {
    width: 110,
    height: 120, // Match item height
    margin: 0, // Remove margin to flush
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  priceTag: {
    position: 'absolute',
    right: 10,
    bottom: 10, // Positioned at bottom right
    paddingHorizontal: 5,
    borderRadius: 5,
    zIndex: 1,
  },
  priceText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  trendingEventDetails: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between', // Distribute space
  },
  trendingEventName: {
    width: '100%',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 5,
  },
  trendingEventTimeCity: {
    marginTop: 0,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  trendingEventDate: {
    fontSize: 13,
    marginLeft: 5,
  },
  trendingEventTime: {
    fontSize: 13,
    marginLeft: 5,
  },
  trendingEventCity: {
    fontSize: 13,
    marginLeft: 5,
    flex: 1, // Allow text to take available space
  },
});

export default TrendingEvent;
