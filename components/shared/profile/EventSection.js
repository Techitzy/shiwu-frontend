import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import {lightColors, darkColors, primaryColor} from '../../../themes/basics';
import {formatDate} from '../../../services/utils';

const EventSection = ({title, data, onSeeMore}) => {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const isDarkTheme = colorScheme === 'dark';
  const backgroundColor = isDarkTheme
    ? darkColors.backgroundColor
    : lightColors.backgroundColor;
  const textColor = isDarkTheme ? darkColors.textColor : lightColors.textColor;
  const headerTextColor = isDarkTheme
    ? darkColors.headerTextColor
    : lightColors.headerTextColor;

  // Limit the number of items to show in the row
  const visibleData = data?.slice(0, 5);

  // If no data, return null (don't render anything)
  if (!data || data.length === 0) {
    return null;
  }

  const renderItem = ({item}) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push({
        pathname: `/event/${item.id}`,
        params: { event: JSON.stringify(item) }
      })}
    >
      <Image source={{uri: item.banner_img}} style={styles.eventImage} />
      <Text
        style={[styles.eventTitle, {color: textColor}]}
        numberOfLines={1}
        ellipsizeMode="tail">
        {item.title}
      </Text>
      <Text style={[styles.eventDate, {color: textColor}]}>
        {formatDate(item.datetime)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.header}>
        <Text style={[styles.title, {color: textColor}]}>{title}</Text>
        {onSeeMore && (
          <TouchableOpacity onPress={onSeeMore}>
            <Text style={styles.seeMore}>See More</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal Scrollable Cards */}
      <FlatList
        data={visibleData}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeMore: {
    fontSize: 14,
    color: primaryColor.main,
    fontWeight: 'bold',
  },
  list: {
    paddingLeft: 16,
  },
  card: {
    width: 140,
    marginRight: 12,
  },
  eventImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  eventDate: {
    fontSize: 12,
    color: '#666',
  },
});

export default EventSection;
