import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotificationScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === 'dark';
  const headerBackgroundColor = isDarkMode ? '#000' : '#fff';
  const headerTextColor = isDarkMode ? '#fff' : '#333';

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#000' : '#fff' },
      ]}>
      <View style={{ flex: 1 }}>
        <View style={[styles.header, { backgroundColor: headerBackgroundColor }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={headerTextColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: headerTextColor }]}>
            Notifications
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  },
});
