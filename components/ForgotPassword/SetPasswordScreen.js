import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {lightColors, darkColors, primaryColor} from '../../themes/basics';

const SetPasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const navigation = useNavigation();
  const backgroundColor = isDarkTheme
    ? darkColors.backgroundColor
    : lightColors.backgroundColor;
  const textColor = isDarkTheme ? darkColors.textColor : lightColors.textColor;
  const headerTextColor = isDarkTheme
    ? darkColors.headerTextColor
    : lightColors.headerTextColor;
  const inputBackground = isDarkTheme
    ? darkColors.inputBackground
    : lightColors.inputBackground;
  const placeHolderText = isDarkTheme
    ? darkColors.placeHolderText
    : lightColors.placeHolderText;

  const handleUpdatePassword = () => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 6 characters long and include letters and numbers.',
      );
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      console.log('Password Updated');
      setIsLoading(false);
      navigation.navigate('Login');
    }, 1000);
  };

  return (
    <View style={[styles.container, {backgroundColor: backgroundColor}]}>
      {/* Custom Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} color={textColor} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={[styles.findTitle, {color: textColor}]}>
          Create a new password
        </Text>
        <Text style={[styles.message, {color: textColor}]}>
          Create a password with atleast 6 letters and numbers. You'll need this
          password to login to your account.
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: inputBackground,
              color: textColor,
            },
          ]}
          placeholder="New Password"
          placeholderTextColor={placeHolderText}
          value={password}
          onChangeText={text => {
            setPassword(text);
            setError('');
          }}
          secureTextEntry={!showPassword}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleUpdatePassword}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Password</Text>
          )}
        </TouchableOpacity>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  findTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  continueButton: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    backgroundColor: primaryColor.main,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  googleButton: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#ddd',
    alignItems: 'center',
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    color: primaryColor.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 14,
  },
});

export default SetPasswordScreen;
