// EventCard.js
import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';

const EventCard = ({event}) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.imageContainer}>
        <Image source={{uri: event.imageUrl}} style={styles.eventImage} />
      </View>
      <View style={styles.eventInfo}>
        <Text style={styles.eventName}>{event.name}</Text>
        <Text style={styles.eventTime}>{event.time}</Text>
        <Text style={styles.eventLocation}>{event.city}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 10,
  },
  imageContainer: {
    marginRight: 15,
  },
  eventImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  eventInfo: {
    justifyContent: 'center',
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventTime: {
    fontSize: 14,
    color: '#888',
  },
  eventLocation: {
    fontSize: 14,
    color: '#888',
  },
});

export default EventCard;
