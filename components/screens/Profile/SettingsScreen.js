import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useColorScheme} from 'react-native';
import {UserContext} from '../../../context/UserContext';
import {lightColors, darkColors, primaryColor} from '../../../themes/basics';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const {setTheme} = useContext(UserContext);
  const {logout} = useContext(UserContext);
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

  const handleThemeChange = theme => {
    setSelectedTheme(theme);
    setTheme(theme);
    Alert.alert('Theme Changed', `You selected ${theme} theme.`);
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Log Out', onPress: () => logout()},
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? Account once deleted cannot be recovered.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => console.log('Account Deleted'),
        },
      ],
    );
  };

  return (
    <ScrollView style={[styles.container, {backgroundColor}]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={26} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: textColor}]}>Settings</Text>
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
          style={[styles.row, {borderBottomColor}]}
          onPress={() => navigation.navigate('EditProfile')}>
          <Text style={[styles.rowText, {color: textColor}]}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={24} color={textColor} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.row, {borderBottomColor}]}
          onPress={() => navigation.navigate('VerifyProfile')}>
          <Text style={[styles.rowText, {color: textColor}]}>
            Verify Your Profile
          </Text>
          <Ionicons name="chevron-forward" size={24} color={textColor} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.row, {borderBottomColor}]}
          onPress={() => navigation.navigate('MyTickets')}>
          <Text style={[styles.rowText, {color: textColor}]}>My Tickets</Text>
          <Ionicons name="chevron-forward" size={24} color={textColor} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.row, {borderBottomColor}]}
          onPress={() => navigation.navigate('BookedEvents')}>
          <Text style={[styles.rowText, {color: textColor}]}>
            Booked Events
          </Text>
          <Ionicons name="chevron-forward" size={24} color={textColor} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.row, {borderBottomColor}]}
          onPress={() =>
            Alert.alert(
              'Select Theme',
              'Choose your preferred theme:',
              [
                {text: 'Light', onPress: () => handleThemeChange('Light')},
                {text: 'Dark', onPress: () => handleThemeChange('Dark')},
                {
                  text: 'System Default',
                  onPress: () => handleThemeChange('System Default'),
                },
              ],
              {cancelable: true},
            )
          }>
          <Text style={[styles.rowText, {color: textColor}]}>Theme</Text>
          <Ionicons name="chevron-forward" size={24} color={textColor} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.row, {borderBottomColor}]}
          onPress={() => console.log('Change Password')}>
          <Text style={[styles.rowText, {color: textColor}]}>
            Change Password
          </Text>
          <Ionicons name="chevron-forward" size={24} color={textColor} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.row, styles.lastRow, {borderBottomColor}]}
          onPress={handleDeleteAccount}>
          <Text style={[styles.rowText, {color: textColor}]}>
            Delete My Account
          </Text>
          <Ionicons name="chevron-forward" size={24} color={textColor} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
