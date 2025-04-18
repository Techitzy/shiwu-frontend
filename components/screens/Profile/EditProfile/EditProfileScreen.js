import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useColorScheme} from 'react-native';
import {UserContext} from '../../../../context/UserContext';
import {ActivityIndicator, Avatar} from 'react-native-paper';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {lightColors, darkColors, primaryColor} from '../../../../themes/basics';
import ContentLoader, {Rect} from 'react-content-loader/native';

const EditProfileScreen = () => {
  const navigation = useNavigation();
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
      screen: 'EditPersonalInfoScreen',
    },
    {label: 'Bio', value: user?.bio || null, screen: 'EditPersonalInfoScreen'},
    {
      label: 'Gender',
      value: user?.gender || null,
      screen: 'EditPersonalInfoScreen',
    },
    {
      label: 'Email',
      value: user?.email || null,
      screen: 'EditPersonalInfoScreen',
    },
    {
      label: 'Phone Number',
      value: user?.phone_number || null,
      screen: 'EditPersonalInfoScreen',
    },
  ];

  // Function to handle image picker options
  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User canceled image picker');
      } else if (response.errorCode) {
        console.error('Image Picker Error: ', response.errorMessage);
      } else {
        const {uri} = response.assets[0];
        setUserImage(uri);
        setLoading(true);

        // Call the uploadProfileImage from UserContext
        uploadProfileImage(uri).finally(() => {
          setLoading(false); // Stop loading when upload is done
        });
      }
    });
  };

  return (
    <ScrollView style={[styles.container, {backgroundColor}]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={26} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: textColor}]}>
          Edit Profile
        </Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {loading ? (
          <ContentLoader
            speed={2}
            width={100}
            height={100}
            viewBox="0 0 100 100"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb">
            <Rect x="0" y="0" rx="50" ry="50" width="100" height="100" />
          </ContentLoader>
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
              navigation.navigate(field.screen, {
                label: field.label,
                value: field.value,
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
    textOverflow: 'ellipsis',
  },
});

export default EditProfileScreen;
