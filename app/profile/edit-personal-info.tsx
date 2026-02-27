import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmailVerificationModal from '../../components/shared/modals/EmailVerificationModal';
import PhoneVerificationModal from '../../components/shared/modals/PhoneVerificationModal';
import { UserContext } from '../../context/UserContext';
import { darkColors, lightColors, primaryColor } from '../../themes/basics';

const EditPersonalInfoScreen = () => {
  const router = useRouter();
  const { label: labelParam } = useLocalSearchParams();
  const label = Array.isArray(labelParam) ? labelParam[0] : labelParam;

  const { user, setUser } = useContext(UserContext);

  const [name, setName] = useState(user?.full_name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [gender, setGender] = useState(
    user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : '',
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
        { [key]: value },
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
      router.back();
    } catch (error) {
      setIsLoading(false);
      console.error(
        'Error updating field:',
        error.response?.data || error.message,
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor }]}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close-sharp" size={26} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>
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
            <Text style={[styles.charCount, { color: textColor }]}>
              {bio.length}/400
            </Text>
          </View>
        )}

        {label === 'Gender' && (
          <FlatList
            data={genderOptions}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.genderListItem}
                onPress={() => setGender(item)}>
                <Ionicons
                  name={gender === item ? 'radio-button-on' : 'radio-button-off'}
                  size={26}
                  color={gender === item ? primaryColor.main : textColor}
                />
                <Text style={[styles.genderText, { color: textColor }]}>
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
                autoCapitalize="none"
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

            <EmailVerificationModal
              visible={isEmailSent}
              email={email}
              onClose={() => setIsEmailSent(false)}
              onVerifySuccess={() => setIsEmailSent(false)}
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
                    flex: 1,
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
            <PhoneVerificationModal
              visible={isPhoneSent}
              phone={phone}
              onClose={() => setIsPhoneSent(false)}
              onVerifySuccess={() => setIsPhoneSent(false)}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 20 },
  saveIcon: { marginLeft: 'auto' },
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
  charCount: { alignSelf: 'flex-end', marginRight: 8, fontSize: 12 },
  genderListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  genderText: { fontSize: 16, marginLeft: 10 },
  emailContainer: {
    marginVertical: 8,
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
