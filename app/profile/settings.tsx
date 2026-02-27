import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../../context/UserContext';
import { darkColors, lightColors } from '../../themes/basics';

const SettingsScreen = () => {
  const router = useRouter();
  const { setTheme, logout } = useContext(UserContext);
  const colorScheme = useColorScheme();

  const [selectedTheme, setSelectedTheme] = useState(
    colorScheme === 'dark' ? 'Dark' : 'Light',
  );

  const isDarkTheme = colorScheme === 'dark';
  const backgroundColor = isDarkTheme
    ? darkColors.backgroundColor
    : lightColors.backgroundColor;
  const textColor = isDarkTheme ? darkColors.textColor : lightColors.textColor;
  const inputBackground = isDarkTheme
    ? darkColors.inputBackground
    : lightColors.inputBackground;
  const borderBottomColor = isDarkTheme
    ? darkColors.borderBottomColor
    : lightColors.borderBottomColor;

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    setTheme(theme);
    Alert.alert('Theme Changed', `You selected ${theme} theme.`);
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out', onPress: () => {
          logout();
          router.replace('/(auth)/login');
        }
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? Account once deleted cannot be recovered.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => console.log('Account Deleted'),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={26} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>Settings</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutIcon}>
            <MaterialIcons name="logout" size={26} color="red" />
          </TouchableOpacity>
        </View>

        {/* Section 1 */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: inputBackground,
            },
          ]}>
          <TouchableOpacity
            style={[styles.row, { borderBottomColor }]}
            onPress={() => router.push('/profile/edit')}>
            <Text style={[styles.rowText, { color: textColor }]}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={24} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.row, { borderBottomColor }]}
            onPress={() => console.log("Verify Profile")}>
            <Text style={[styles.rowText, { color: textColor }]}>
              Verify Your Profile
            </Text>
            <Ionicons name="chevron-forward" size={24} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.row, { borderBottomColor }]}
            onPress={() => console.log("My Tickets")}>
            <Text style={[styles.rowText, { color: textColor }]}>My Tickets</Text>
            <Ionicons name="chevron-forward" size={24} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.row, { borderBottomColor }]}
            onPress={() => console.log("Booked Events")}>
            <Text style={[styles.rowText, { color: textColor }]}>
              Booked Events
            </Text>
            <Ionicons name="chevron-forward" size={24} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.row, { borderBottomColor }]}
            onPress={() =>
              Alert.alert(
                'Select Theme',
                'Choose your preferred theme:',
                [
                  { text: 'Light', onPress: () => handleThemeChange('Light') },
                  { text: 'Dark', onPress: () => handleThemeChange('Dark') },
                  {
                    text: 'System Default',
                    onPress: () => handleThemeChange('System Default'),
                  },
                ],
                { cancelable: true },
              )
            }>
            <Text style={[styles.rowText, { color: textColor }]}>Theme</Text>
            <Ionicons name="chevron-forward" size={24} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.row, { borderBottomColor }]}
            onPress={() => console.log('Change Password')}>
            <Text style={[styles.rowText, { color: textColor }]}>
              Change Password
            </Text>
            <Ionicons name="chevron-forward" size={24} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.row, styles.lastRow, { borderBottomColor }]}
            onPress={handleDeleteAccount}>
            <Text style={[styles.rowText, { color: textColor }]}>
              Delete My Account
            </Text>
            <Ionicons name="chevron-forward" size={24} color={textColor} />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  logoutIcon: {
    marginLeft: 'auto',
  },
  section: {
    margin: 16,
    borderRadius: 8,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  rowText: {
    fontSize: 16,
    fontWeight: '500',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
});

export default SettingsScreen;
