import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useColorScheme} from 'react-native';
import {UserContext} from '../../../../context/UserContext';
import OTPVerificationModal from '../../../modals/EmailVerificationModal';
import EmailVerificationModal from '../../../modals/EmailVerificationModal';
import PhoneVerificationModal from '../../../modals/PhoneVerificationModal';
import {lightColors, darkColors, primaryColor} from '../../../../themes/basics';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditPersonalInfoScreen = ({route}) => {
  const navigation = useNavigation();
  const {label} = route.params;
  const {user, setUser} = useContext(UserContext);

  const [name, setName] = useState(user?.full_name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [gender, setGender] = useState(
    capitalizeFirstLetter(user?.gender) || '',
  );
  const [email, setEmail] = useState(user?.email || '');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isPhoneSent, setIsPhoneSent] = useState(false);
  const [phone, setPhone] = useState(user?.phone_number || '');
  const [isLoading, setIsLoading] = useState(false);

  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const backgroundColor = isDarkTheme
    ? darkColors.backgroundColor
    : lightColors.backgroundColor;
  const textColor = isDarkTheme ? darkColors.textColor : lightColors.textColor;
  const inputBackground = isDarkTheme
    ? darkColors.inputBackground
    : lightColors.inputBackground;
  const borderColor = isDarkTheme
    ? darkColors.borderColor
    : lightColors.borderColor;

  const genderOptions = ['Male', 'Female', 'Other'];

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleSave = async () => {
    let key, value;

    switch (label) {
      case 'Name':
        key = 'full_name';
        value = name;
        break;
      case 'Bio':
        key = 'bio';
        value = bio;
        break;
      case 'Gender':
        key = 'gender';
        value = gender.toLowerCase();
        break;
      case 'Email':
        key = 'email';
        value = email;
        break;
      case 'Phone Number':
        key = 'phone_number';
        value = phone;
        break;
      default:
        console.error('Unsupported label');
        return;
    }

    try {
      setIsLoading(true);
      const response = await axios.patch(
        `https://shivoo-backend.onrender.com/user_auth/users/${user.id}`,
        {[key]: value},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        const updatedUser = {
          ...user,
          [key]: value,
        };
        setUser(updatedUser);

        await AsyncStorage.setItem('userDetails', JSON.stringify(updatedUser));
      }

      setIsLoading(false);
      navigation.goBack();
    } catch (error) {
      setIsLoading(false);
      console.error(
        'Error updating field:',
        error.response?.data || error.message,
      );
    }
  };

  const handleCloseModalEmail = () => setIsEmailSent(false);
  const handleVerifySuccessEmail = () => {
    setIsEmailSent(false);
    console.log('Email Verified Successfully');
  };

  const handleCloseModalPhone = () => setIsPhoneSent(false);
  const handleVerifySuccessPhone = () => {
    setIsPhoneSent(false);
    console.log('Phone Verified Successfully');
  };

  return (
    <View style={[styles.container, {backgroundColor}]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close-sharp" size={26} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: textColor}]}>
          Edit {label}
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={isLoading}
          style={styles.saveIcon}>
          {isLoading ? (
            <ActivityIndicator size="small" color={primaryColor.main} />
          ) : (
            <Ionicons
              name="checkmark-sharp"
              size={26}
              color={primaryColor.main}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Conditional Rendering Based on Label */}
      {label === 'Name' && (
        <TextInput
          style={[
            styles.inputField,
            {
              backgroundColor: inputBackground,
              borderColor,
              color: textColor,
            },
          ]}
          placeholder="Enter name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />
      )}

      {label === 'Bio' && (
        <View>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: inputBackground,
                borderColor,
                color: textColor,
              },
            ]}
            placeholder="Enter bio"
            placeholderTextColor="#888"
            value={bio}
            onChangeText={setBio}
            maxLength={400}
            multiline
          />
          <Text style={[styles.charCount, {color: textColor}]}>
            {bio.length}/400
          </Text>
        </View>
      )}

      {label === 'Gender' && (
        <FlatList
          data={genderOptions}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.genderListItem}
              onPress={() => setGender(item)}>
              <Ionicons
                name={gender === item ? 'radio-button-on' : 'radio-button-off'}
                size={26}
                color={gender === item ? primaryColor.main : textColor}
              />
              <Text style={[styles.genderText, {color: textColor}]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {label === 'Email' && (
        <View style={styles.emailContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.inputField,
                {
                  backgroundColor: inputBackground,
                  borderColor,
                  color: textColor,
                  flex: 1,
                },
              ]}
              keyboardType="email-address"
              placeholder="Enter email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
            />
            <Ionicons
              name={
                isEmailSent
                  ? 'checkmark-circle-sharp'
                  : 'checkmark-circle-outline'
              }
              size={24}
              color={primaryColor.main}
              style={styles.icon}
            />
          </View>

          {/* Modal for Email Sent */}
          <EmailVerificationModal
            visible={isEmailSent}
            email={email}
            onClose={handleCloseModalEmail}
            onVerifySuccess={handleVerifySuccessEmail}
          />
        </View>
      )}

      {label === 'Phone Number' && (
        <View style={styles.emailContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.inputField,
                {
                  backgroundColor: inputBackground,
                  borderColor,
                  color: textColor,
                  flex: 1, // Allow input to take up remaining space
                },
              ]}
              keyboardType="phone-pad"
              placeholder="Enter phone number"
              placeholderTextColor="#888"
              value={phone}
              onChangeText={text => {
                const formattedText = text.replace(/[^0-9]/g, '');
                if (formattedText.length <= 10) {
                  setPhone(formattedText);
                }
              }}
            />
            <Ionicons
              name={
                phone.length === 10
                  ? 'checkmark-circle-sharp'
                  : 'checkmark-circle-outline'
              }
              size={24}
              color={primaryColor.main}
              style={styles.icon}
            />
          </View>
          {/* Modal for Phone Sent */}
          <PhoneVerificationModal
            visible={isPhoneSent}
            phone={phone}
            onClose={handleCloseModalPhone}
            onVerifySuccess={handleVerifySuccessPhone}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  headerTitle: {fontSize: 18, fontWeight: 'bold', marginLeft: 20},
  saveIcon: {marginLeft: 'auto'},
  inputField: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    marginVertical: 8,
  },
  charCount: {alignSelf: 'flex-end', marginRight: 8, fontSize: 12},
  genderListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  genderText: {fontSize: 16, marginLeft: 10},
  emailContainer: {
    marginVertical: 8,
  },
  checkmarkButton: {marginLeft: 8},
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalText: {fontSize: 16, textAlign: 'center', marginBottom: 16},
  otpField: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  icon: {
    marginLeft: 8,
  },
});

export default EditPersonalInfoScreen;
