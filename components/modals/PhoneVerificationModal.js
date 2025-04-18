import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  useColorScheme,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ActivityIndicator} from 'react-native-paper';

const PhoneVerificationModal = ({visible, phone, onClose, onVerifySuccess}) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef([]);
  const isDarkMode = useColorScheme() === 'dark';

  const textColor = isDarkMode ? '#ffffff' : '#000000';
  const backgroundColor = isDarkMode ? '#121212' : '#fff';

  const screenHeight = Dimensions.get('window').height;

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

  useEffect(() => {
    if (!visible) {
      setTimer(60);
      setIsResendDisabled(true);
    }
  }, [visible]);

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

  const handleResendOtp = () => {
    setIsResendDisabled(true);
    setTimer(60);
    console.log('OTP Resent');
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    setIsLoading(true);
    try {
      if (enteredOtp === '0000') {
        console.log('OTP Verified');
        setError('');
        onVerifySuccess();
      } else {
        console.log('Invalid OTP');
        setError('Invalid OTP');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isVerifyDisabled = otp.some(digit => digit === '') || isLoading;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={[
          styles.modalBackground,
          {backgroundColor: 'rgba(0, 0, 0, 0.5)'},
        ]}>
        <View
          style={[
            styles.modalContainer,
            {height: screenHeight * 0.3, backgroundColor},
          ]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-outline" size={28} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.modalText, {color: textColor}]}>
            OTP has been sent to{' '}
            <Text style={{fontWeight: 'bold'}}>{phone}</Text>
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

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

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

          <TouchableOpacity
            onPress={handleVerify}
            disabled={isVerifyDisabled}
            style={[
              styles.verifyButton,
              {opacity: isVerifyDisabled ? 0.6 : 1},
            ]}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.verifyButtonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingTop: 24,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 16,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#7373FF',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  resendButton: {
    marginBottom: 20,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendText: {
    fontSize: 14,
    color: '#7373FF',
  },
  verifyButton: {
    backgroundColor: '#7373FF',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PhoneVerificationModal;
