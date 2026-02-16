import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Avatar, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import {UserContext} from '../../../context/UserContext';
import {lightColors, darkColors, primaryColor} from '../../../themes/basics';
// import ContentLoader, {Rect} from 'react-content-loader/native'; // Keep or use ActivityIndicator

const EditProfileScreen = () => {
  const router = useRouter();
  const {user, uploadProfileImage} = useContext(UserContext);
  const colorScheme = useColorScheme();
  const [userImage, setUserImage] = useState(user?.profile_pic);
  const [loading, setLoading] = useState(false);

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

  const fields = [
    {
      label: 'Name',
      value: user?.full_name || null,
    },
    { label: 'Bio', value: user?.bio || null },
    {
      label: 'Gender',
      value: user?.gender || null,
    },
    {
      label: 'Email',
      value: user?.email || null,
    },
    {
      label: 'Phone Number',
      value: user?.phone_number || null,
    },
  ];

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setUserImage(uri);
      setLoading(true);

      uploadProfileImage(uri).finally(() => {
        setLoading(false);
      });
    }
  };

  return (
    <ScrollView style={[styles.container, {backgroundColor}]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={26} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: textColor}]}>
          Edit Profile
        </Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {loading ? (
          <View style={[styles.avatar, { width: 100, height: 100, justifyContent: 'center', alignItems: 'center' }]}>
             <ActivityIndicator color={primaryColor.main} />
          </View>
        ) : (
          <Avatar.Image
            source={{uri: userImage}}
            size={100}
            style={styles.avatar}
          />
        )}
      </View>

      {/* Edit Picture */}
      <TouchableOpacity onPress={handleImagePicker}>
        <Text style={[styles.editPicture, {color: primaryColor.main}]}>
          Edit picture
        </Text>
      </TouchableOpacity>

      {/* Fields */}
      <View style={styles.fieldsContainer}>
        {fields.map((field, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.field,
              {backgroundColor: inputBackground, borderColor},
            ]}
            onPress={() =>
              router.push({
                  pathname: '/(tabs)/profile/edit-personal-info',
                  params: { label: field.label, value: field.value }
              })
            }>
            <View>
              {field.value ? (
                <>
                  <Text style={[styles.fieldLabel, {color: textColor}]}>
                    {field.label}
                  </Text>
                  <Text
                    style={[
                      styles.fieldValue,
                      field.label === 'Bio' && styles.bioValue,
                      {color: textColor},
                    ]}
                    numberOfLines={field.label === 'Bio' ? 2 : 1}>
                    {field.value}
                  </Text>
                </>
              ) : (
                <Text
                  style={[
                    styles.fieldValue,
                    field.label === 'Bio' && styles.bioValue,
                    {color: textColor},
                  ]}>
                  {field.label}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
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
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#f0f0f0',
  },
  editPicture: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 8,
  },
  fieldsContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '400',
  },
  bioValue: {
    height: 50,
    overflow: 'hidden',
  },
});

export default EditProfileScreen;
