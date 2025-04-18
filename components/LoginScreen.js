import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {UserContext} from '../context/UserContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {lightColors, darkColors, primaryColor} from '../themes/basics';

const LoginScreen = ({onLogin}) => {
  const {login, isEmailExist} = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('email');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [opacity] = useState(new Animated.Value(1));
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
  const informationText = isDarkTheme
    ? darkColors.informationText
    : lightColors.informationText;

  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleContinue = async () => {
    if (step === 'email') {
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
            smoothTransition('password');
          } else {
            navigation.navigate('EmailSentScreen', {email});
            setError('Email not registered');
          }
        }, 1000);
      }
    } else if (step === 'password') {
      setIsLoading(true);
      const user = await login(email, password);
      setIsLoading(false);
      if (user && user.password === password) {
        onLogin && onLogin(user);
      } else {
        setError('Invalid password');
      }
    }
  };

  const smoothTransition = nextStep => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setStep(nextStep);
      setError('');
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View style={[styles.container, {backgroundColor: backgroundColor}]}>
      <Text style={[styles.title, {color: textColor}]}>Yo, Welcome Back!</Text>
      <Text style={[styles.subtitle, {color: textColor}]}>
        {step === 'email'
          ? 'Enter your email to continue'
          : 'Enter your password to sign in'}
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
      />

      <Animated.View style={{opacity, width: '100%'}}>
        {step === 'password' && (
          <View>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: inputBackground,
                  color: textColor,
                },
              ]}
              placeholder="Password"
              placeholderTextColor={placeHolderText}
              value={password}
              onChangeText={text => {
                setPassword(text);
                setError('');
              }}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.eyeIcon}>
              <Ionicons
                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                color={textColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.forgotPasswordLink}
              onPress={() =>
                navigation.navigate('ForgotPasswordScreen', {email})
              }>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinue}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {step === 'email' ? 'Continue' : 'Sign In'}
          </Text>
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
            source={require('../public/images/googleLogo.png')}
            style={styles.googleLogo}
          />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </View>
      </TouchableOpacity>

      <Text style={[styles.agreementText, {color: informationText}]}>
        By continuing, you agree to our{' '}
        <Text style={styles.linkText}>Terms of Service</Text> and{' '}
        <Text style={styles.linkText}>Privacy Policy</Text>.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
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
    marginBottom: 20,
  },
  forgotPasswordLink: {
    bottom: 5,
    display: 'flex',
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    color: primaryColor.main,
    fontSize: 14,
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
  agreementText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
  linkText: {
    color: primaryColor.main,
    textDecorationLine: 'underline',
  },
  passwordVisibilityToggle: {
    marginTop: 10,
    alignItems: 'flex-start',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 15,
    zIndex: 1,
  },
});

export default LoginScreen;
