import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const VerifyingScreen = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const isDarkTheme = colorScheme === 'dark';
  const backgroundColor = isDarkTheme ? '#121212' : '#fff';
  const textColor = isDarkTheme ? '#ffffff' : '#000000';
  const headerTextColor = isDarkTheme ? '#fff' : '#333';

  return (
    <View style={[styles.container, {backgroundColor}]}>
      {/* Custom Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: headerTextColor}]}>
          Verifying
        </Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Image
          source={require('../public/images/emailSent.png')}
          style={styles.emailIcon}
        />
        <ActivityIndicator size="large" color="#7373FF" style={styles.loader} />
        <Text style={[styles.message, {color: isDarkTheme ? '#fff' : '#000'}]}>
          Verifying your email address.
        </Text>
        <Text
          style={[styles.subMessage, {color: isDarkTheme ? '#888' : '#555'}]}>
          Please wait...
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emailIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  loader: {
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  subMessage: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default VerifyingScreen;
