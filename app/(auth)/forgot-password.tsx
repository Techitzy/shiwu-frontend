import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {UserContext} from '../../context/UserContext';
import {lightColors, darkColors, primaryColor} from '../../themes/basics';

const ForgotPasswordScreen = () => {
  const { email: emailParam } = useLocalSearchParams();
  const initialEmail = Array.isArray(emailParam) ? emailParam[0] : emailParam || '';

  const {isEmailExist} = useContext(UserContext);
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const router = useRouter();

  const backgroundColor = isDarkTheme
    ? darkColors.backgroundColor
    : lightColors.backgroundColor;
  const textColor = isDarkTheme ? darkColors.textColor : lightColors.textColor;
  const inputBackground = isDarkTheme
    ? darkColors.inputBackground
    : lightColors.inputBackground;
  const placeHolderText = isDarkTheme
    ? darkColors.placeHolderText
    : lightColors.placeHolderText;

  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleContinue = async () => {
    if (!email.trim()) {
      setError('Email is required');
    } else if (!validateEmail(email)) {
      setError('Please enter a valid email');
    } else {
      setError('');
      setIsLoading(true);
      setTimeout(async () => {
        const checkIfEmailExist = await isEmailExist(email);
        setIsLoading(false);
        if (checkIfEmailExist) {
          router.push({ pathname: '/(auth)/verify-email', params: { email } });
        } else {
          setError('Email not registered');
        }
      }, 1000);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: backgroundColor}]}>
      {/* Custom Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} color={textColor} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={[styles.findTitle, {color: textColor}]}>
          Find your account
        </Text>
        <Text style={[styles.message, {color: textColor}]}>
          Enter your email address
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: inputBackground,
              color: textColor,
            },
          ]}
          placeholder="Email Address"
          placeholderTextColor={placeHolderText}
          value={email}
          onChangeText={text => {
            setEmail(text);
            setError('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={[styles.orText, {color: textColor}]}>OR</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.googleButton}>
          <View style={styles.googleButtonContent}>
            <Image
              source={require('../../public/images/googleLogo.png')}
              style={styles.googleLogo}
            />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </View>
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
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButtonText: {
    color: '#333',
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

export default ForgotPasswordScreen;
