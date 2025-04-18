import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {lightColors, darkColors, primaryColor} from '../../themes/basics';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {formatDate, formatTime} from '../../services/utils';

const TrendingEvent = ({event}) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const isDarkTheme = colorScheme === 'dark';
  const textColor = isDarkTheme ? darkColors.textColor : lightColors.textColor;
  const eventInformation = isDarkTheme ? '#ddd' : '#333';

  const handlePress = () => {
    navigation.navigate('EventDetail', {event});
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.trendingEventItem, {backgroundColor: '#333'}]}>
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
            {overflow: 'hidden'},
          ]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {event?.title.toUpperCase()}
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
                {overflow: 'hidden'},
              ]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {event.meta?.area}, {event.location}
            </Text>
          </View>
          <View style={styles.locationContainer}>
            <Ionicons
              name="person-outline"
              size={12}
              color={eventInformation}
            />
            <Text style={[styles.trendingEventCity, {color: eventInformation}]}>
              {5}/{event.meta.restrictions.max_participants} filled
            </Text>
          </View>
        </View>
        {/* Price Tag */}
        <View style={styles.priceTag}>
          <Text style={[styles.priceText, {color: primaryColor.main}]}>
            Rs{event.meta.price}
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
  },
  imageWithDateContainer: {
    position: 'relative',
  },
  trendingEventImage: {
    width: 110,
    height: 110,
    margin: 5,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  dateOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 100,
    height: 100,
    marginRight: 10,
  },
  dateText: {
    color: '#fff',
    fontSize: 15,
  },
  priceTag: {
    position: 'absolute',
    right: 0,
    paddingHorizontal: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  priceText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  trendingEventDetails: {
    margin: 5,
    flex: 1,
  },
  trendingEventName: {
    width: '72.5%',
    fontWeight: 'bold',
    fontSize: 15,
  },
  trendingEventTimeCity: {
    marginTop: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingEventDate: {
    fontSize: 13,
    width: '72.5%',
    marginLeft: 5,
  },
  trendingEventTime: {
    fontSize: 13,
    width: '72.5%',
    marginLeft: 5,
  },
  trendingEventCity: {
    fontSize: 13,
    width: '72.5%',
    marginLeft: 5,
  },
});

export default TrendingEvent;
