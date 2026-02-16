// EventItem.js
import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';

const EventItem = ({event}) => {
  return (
    <View style={styles.eventItemContainer}>
      <Image source={{uri: event.imageUrl}} style={styles.eventImage} />
      <Text style={styles.eventName}>{event.name}</Text>
      <View style={styles.eventDetails}>
        <View style={styles.eventDetailItem}>
          <Icon name="access-time" size={20} color="#000" />
          <Text style={styles.eventTime}>{event.time}</Text>
        </View>
        <View style={styles.eventDetailItem}>
          <Icon name="location-on" size={20} color="#000" />
          <Text style={styles.eventLocation}>{event.city}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  eventItemContainer: {
    marginRight: 15,
    alignItems: 'center',
    width: 200,
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  eventName: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTime: {
    marginLeft: 5,
    fontSize: 12,
  },
  eventLocation: {
    marginLeft: 5,
    fontSize: 12,
  },
});

export default EventItem;
