import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {UserContext} from '../../context/UserContext';
import {lightColors, darkColors} from '../../themes/basics';

const SignUpScreen = () => {
  const { email: emailParam } = useLocalSearchParams();
  const email = Array.isArray(emailParam) ? emailParam[0] : emailParam;
  
  const colorScheme = useColorScheme();
  const router = useRouter();
  const {signUp} = useContext(UserContext);

  const isDarkTheme = colorScheme === 'dark';
  const backgroundColor = isDarkTheme
    ? darkColors.backgroundColor
    : lightColors.backgroundColor;
  const textColor = isDarkTheme ? darkColors.textColor : lightColors.textColor;
  const headerTextColor = isDarkTheme
    ? darkColors.headerTextColor
    : lightColors.headerTextColor;

  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(1);
  const [birthday, setBirthday] = useState(null);
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Validation for full name
  const validateFullName = name => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
  };

  const calculateAge = date => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleContinue = async () => {
    if (progress === 1 && !fullName.trim()) {
      setError('Full Name is required.');
      return;
    }
    if (progress === 1 && !validateFullName(fullName)) {
      setError('Name cannot contain numbers or special characters.');
      return;
    }
    if (progress === 2) {
      if (!birthday) {
        setError('Date of birth is required.');
        return;
      }
      if (calculateAge(birthday) < 16) {
        setError('You must be at least 16 years old.');
        return;
      }
    }
    if (progress === 3 && !gender) {
      setError('Gender is required.');
      return;
    }
    if (progress === 4 && (!password || password.length < 6)) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');
    if (progress < 4) {
      setProgress(progress + 1);
    } else {
      const userDetails = {
        fullName,
        email,
        birthday,
        gender,
        password,
      };

      const success = await signUp(userDetails);
      if (success) {
        // Assuming signUp updates the user context, which triggers the root layout to switch to tabs
        // If not, we might need to manually navigate, but typically Context updates handle this.
        // For safety/redundancy:
        router.replace('/(tabs)/');
      } else {
        setError('Sign-up failed. Please try again.');
      }
    }
  };

  const handleBirthdayChange = date => {
    setBirthday(date);
    setShowDatePicker(false);
  };

  const handleBack = () => {
    if (progress === 1) {
      router.back();
    } else {
      setProgress(progress - 1);
      setError('');
    }
  };

  return (
    <View style={[styles.container, {backgroundColor}]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: headerTextColor}]}>
          Sign Up
        </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={[styles.cancelButton, {color: headerTextColor}]}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {[...Array(4)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressLine,
              {
                backgroundColor: index < progress ? '#7373FF' : '#ccc',
              },
            ]}
          />
        ))}
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {progress === 1 && (
          <>
            <Text style={[styles.title, {color: textColor}]}>
              Let's sign you up!
            </Text>
            <Text style={[styles.subtitle, {color: textColor}]}>
              What is your full name?
            </Text>
            <TextInput
              style={[styles.input, {color: textColor}]}
              placeholder="Full Name"
              placeholderTextColor={isDarkTheme ? '#888' : '#aaa'}
              value={fullName}
              onChangeText={text => {
                setFullName(text);
                setError('');
              }}
            />
          </>
        )}

        {progress === 2 && (
          <>
            <Text style={[styles.title, {color: textColor}]}>
              When is your birthday?
            </Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={[styles.input, {color: textColor}]}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={isDarkTheme ? '#888' : '#aaa'}
                value={birthday ? birthday.toLocaleDateString('en-GB') : ''}
                editable={false}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePickerModal
                isVisible={showDatePicker}
                mode="date"
                onConfirm={date => {
                  handleBirthdayChange(date);
                  setShowDatePicker(false);
                }}
                onCancel={() => setShowDatePicker(false)}
                maximumDate={new Date()}
                minimumDate={new Date('1900-01-01')}
              />
            )}
          </>
        )}

        {progress === 3 && (
          <>
            <Text style={[styles.title, {color: textColor}]}>
              What is your gender?
            </Text>
            <View style={styles.genderContainer}>
              {['Male', 'Female', 'Other'].map(option => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setGender(option)}
                  style={[
                    styles.genderOption,
                    gender === option && styles.selectedGenderOption,
                  ]}>
                  <Text
                    style={[
                      styles.genderText,
                      gender === option && styles.selectedGenderText,
                      {color: textColor},
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {progress === 4 && (
          <>
            <Text style={[styles.title, {color: textColor}]}>
              Create a password
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, {color: textColor}]}
                placeholder="Password"
                placeholderTextColor={isDarkTheme ? '#888' : '#aaa'}
                value={password}
                onChangeText={text => {
                  setPassword(text);
                  setError('');
                }}
                secureTextEntry={!isPasswordVisible} // Toggle password visibility
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
            </View>
          </>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.buttonText}>
          {progress < 4 ? 'Continue' : 'Finish'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  cancelButton: {
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  progressLine: {
    flex: 1,
    height: 4,
    marginHorizontal: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  continueButton: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#7373FF',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  charCount: {
    textAlign: 'right',
    width: '80%',
    fontSize: 12,
    color: '#888',
  },
  datePicker: {
    marginTop: 20,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  genderOption: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedGenderOption: {
    borderColor: '#7373FF',
    backgroundColor: '#7373FF',
  },
  genderText: {
    fontSize: 16,
  },
  selectedGenderText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    zIndex: 1,
  },
});

export default SignUpScreen;
