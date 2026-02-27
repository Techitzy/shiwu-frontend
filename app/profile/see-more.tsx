import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TrendingEvent from '../../components/shared/home/TrendingEvents';
import { darkColors, lightColors } from '../../themes/basics';

const SeeMoreScreen = () => {
  const router = useRouter();
  const { events: eventsParam, title: titleParam } = useLocalSearchParams();

  const events = eventsParam ? JSON.parse(eventsParam) : [];
  const title = Array.isArray(titleParam) ? titleParam[0] : titleParam || 'Events';

  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();

  const isDarkTheme = colorScheme === 'dark';
  const backgroundColor = isDarkTheme
    ? darkColors.backgroundColor
    : lightColors.backgroundColor;
  const textColor = isDarkTheme ? darkColors.textColor : lightColors.textColor;

  // Filter events based on search query
  const filteredEvents = events.filter(event =>
    (event.name || event.title || '').toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={26} color={textColor} />
          </TouchableOpacity>
          <TextInput
            style={[styles.searchBar, { color: textColor, borderColor: isDarkTheme ? '#444' : '#ccc' }]}
            placeholder={`Search ${title}`}
            placeholderTextColor={isDarkTheme ? '#888' : '#aaa'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView contentContainerStyle={styles.trendingEventsContainer}>
          {filteredEvents.map(event => (
            <TrendingEvent key={event.id} event={event} />
          ))}
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
    alignItems: 'center',
    padding: 16,
  },
  searchBar: {
    height: 40,
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    marginLeft: 10,
    paddingHorizontal: 10,
  },
  trendingEventsContainer: {
    padding: 20,
  },
});

export default SeeMoreScreen;
