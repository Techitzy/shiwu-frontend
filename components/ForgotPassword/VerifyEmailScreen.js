import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {lightColors, darkColors, primaryColor} from '../../themes/basics';

const VerifyEmailScreen = ({route}) => {
  const navigation = useNavigation();
  const {email} = route.params;
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef([]);
  const isDarkTheme = useColorScheme() === 'dark';

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

  useEffect(() => {
    let interval;
    if (isResendDisabled) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev === 1) {
            setIsResendDisabled(false);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled]);

  const handleResendOtp = () => {
    setIsResendDisabled(true);
    setTimer(60);
    // Add logic to resend OTP
    console.log('OTP Resent');
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    setIsLoading(true);
    try {
      if (enteredOtp === '0000') {
        console.log('OTP Verified');
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigation.navigate('SetPasswordScreen');
      } else {
        console.log('Invalid OTP');
        setError('Invalid OTP');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(-1);
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (event, index) => {
    if (
      event.nativeEvent.key === 'Backspace' &&
      index > 0 &&
      otp[index] === ''
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  const isVerifyDisabled = otp.some(digit => digit === '') || isLoading;

  return (
    <View style={[styles.container, {backgroundColor: backgroundColor}]}>
      {/* Custom Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: textColor}]}>
          Verify Email
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.message, {color: textColor}]}>
          OTP has been sent to <Text style={{fontWeight: 'bold'}}>{email}</Text>
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={value => handleOtpChange(value, index)}
              onKeyPress={event => handleKeyPress(event, index)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.resendButton,
            isResendDisabled && styles.resendButtonDisabled,
          ]}
          onPress={handleResendOtp}
          disabled={isResendDisabled}>
          <Text style={styles.resendText}>
            {isResendDisabled ? `Resend OTP in ${timer}s` : 'Resend OTP'}
          </Text>
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            isVerifyDisabled && styles.verifyButtonDisabled,
          ]}
          onPress={handleVerify}
          disabled={isVerifyDisabled}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify</Text>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '80%',
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    borderColor: '#ccc',
  },
  resendButton: {
    marginBottom: 20,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendText: {
    fontSize: 14,
    color: primaryColor.main,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    alignSelf: 'center',
  },
  verifyButton: {
    width: '90%',
    padding: 15,
    borderRadius: 8,
    backgroundColor: primaryColor.main,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  verifyButtonDisabled: {
    backgroundColor: primaryColor.main,
    opacity: 0.5,
  },
  verifyButtonText: {
    color: primaryColor.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VerifyEmailScreen;
