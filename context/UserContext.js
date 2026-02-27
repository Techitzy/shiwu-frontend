import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Google from 'expo-auth-session/providers/google';
import * as Location from 'expo-location';
import * as WebBrowser from 'expo-web-browser';
import React, { createContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';

// ─── GOOGLE OAUTH ─────────────────────────────────────────────────────────────
// Replace this with your Web Client ID from the Google Cloud Console.
// Path: APIs & Services → Credentials → OAuth 2.0 Client IDs → Web client
const GOOGLE_WEB_CLIENT_ID = 'YOUR_GOOGLE_WEB_CLIENT_ID_HERE';

// Complete auth sessions when the browser redirects back to the app
WebBrowser.maybeCompleteAuthSession();

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  // ─── Google Auth Request ──────────────────────────────────────────────────
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    // Add androidClientId and iosClientId here if you have them:
    // androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    // iosClientId: 'YOUR_IOS_CLIENT_ID',
  });

  // Handle Google OAuth response
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse;
      if (authentication?.accessToken) {
        handleGoogleToken(authentication.accessToken);
      }
    }
  }, [googleResponse]);

  // Check if the user is logged in by fetching from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        console.log('[UserContext] AsyncStorage.getItem("userDetails") — loading...');
        const savedUser = await AsyncStorage.getItem('userDetails');
        console.log('[UserContext] AsyncStorage.getItem("userDetails") =>', savedUser ? 'found (length: ' + savedUser.length + ')' : null);

        if (savedUser) {
          let latestUserData = JSON.parse(savedUser);
          setUser(latestUserData);

          // Set the authorization header
          if (latestUserData.accessToken) {
            axios.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${latestUserData.accessToken}`;
          }

          // Fetch location if not already saved
          if (!latestUserData.location) {
            try {
              const { status } = await Location.requestForegroundPermissionsAsync();
              if (status === 'granted') {
                const position = await Location.getCurrentPositionAsync({
                  accuracy: Location.Accuracy.High,
                });
                const { latitude, longitude } = position.coords;
                const response = await axios.get(
                  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDEp4eMaWFDi6psYCa4NSc3NONttlxD3Xo`,
                );
                const address = response.data.results[0];
                const city = address.address_components.find(comp =>
                  comp.types.includes('locality'),
                )?.long_name;

                if (city) {
                  const updatedUser = { ...latestUserData, location: city };
                  setUser(updatedUser);
                  console.log('[UserContext] AsyncStorage.setItem("userDetails") — saving location update');
                  await AsyncStorage.setItem('userDetails', JSON.stringify(updatedUser));
                  console.log('[UserContext] AsyncStorage.setItem("userDetails") ✓');
                }
              }
            } catch (locationError) {
              console.warn('Location fetching error:', locationError);
            }
          }
        }
        // No savedUser → user stays null → auth guard kicks in
      } catch (error) {
        console.error('Error loading user data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const isEmailExist = async email => {
    try {
      // Make a GET request to the API with the email parameter
      const response = await axios.get(
        `https://shivoo-backend.onrender.com/user_auth/user`,
        {
          params: {
            _id: email,
            id_src: 'user_email',
          },
        },
      );

      // Check if the API response indicates the email exists
      if (response.status === 200 && response.data) {
        return true;
      }
    } catch (error) {
      console.error(
        'Error checking email existence:',
        error.response?.data || error.message,
      );
    }

    return false;
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `https://shivoo-backend.onrender.com/user_auth/login`,
        { id: email, password },
      );

      if (response.status === 200 && response.data) {
        const accessToken = response.data.access_token;

        // Fetch user details
        const userDetailsResponse = await axios.get(
          `https://shivoo-backend.onrender.com/user_auth/user`,
          { params: { _id: email, id_src: 'user_email' } },
        );

        const userDetails = userDetailsResponse.data;
        const userData = {
          ...userDetails,
          accessToken,
        };

        // Save user details to AsyncStorage
        console.log('[UserContext] login — AsyncStorage.setItem("userDetails") saving...');
        await AsyncStorage.setItem('userDetails', JSON.stringify(userData));
        console.log('[UserContext] login — AsyncStorage.setItem("userDetails") ✓');
        console.log('[UserContext] login — AsyncStorage.setItem("accessToken") saving...');
        await AsyncStorage.setItem('accessToken', JSON.stringify(accessToken));
        console.log('[UserContext] login — AsyncStorage.setItem("accessToken") ✓');

        // Update state and set default headers
        setUser(userData);
        setAccessToken(accessToken);
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${accessToken}`;

        return true;
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
    }

    return false;
  };

  // ─── Google Login ─────────────────────────────────────────────────────────
  /**
   * Called after a successful Google OAuth flow with the Google access token.
   * Fetches the user profile from Google, then tries to log in or register
   * via the backend Google endpoint.
   *
   * TODO: Update the backend URL below to match your actual google-login endpoint.
   */
  const handleGoogleToken = async (googleAccessToken) => {
    try {
      // 1. Get Google user profile
      const googleUserRes = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        { headers: { Authorization: `Bearer ${googleAccessToken}` } },
      );
      const googleUser = await googleUserRes.json();
      const { email, name, picture, id: googleId } = googleUser;

      // 2. Send to your backend (update URL/payload to match your API)
      const response = await axios.post(
        'https://shivoo-backend.onrender.com/user_auth/google-login',
        { email, full_name: name, profile_pic: picture, google_id: googleId },
      );

      if (response.status === 200 && response.data) {
        const backendAccessToken = response.data.access_token;
        const userDetails = response.data.user ?? {
          email,
          full_name: name,
          profile_pic: picture,
        };
        const userData = { ...userDetails, accessToken: backendAccessToken };

        await AsyncStorage.setItem('userDetails', JSON.stringify(userData));
        await AsyncStorage.setItem('accessToken', JSON.stringify(backendAccessToken));
        setUser(userData);
        setAccessToken(backendAccessToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${backendAccessToken}`;
      } else {
        Alert.alert('Google Login', 'Failed to authenticate with the server.');
      }
    } catch (error) {
      console.error('[UserContext] Google login error:', error.response?.data || error.message);
      Alert.alert('Google Login Error', error.response?.data?.detail || 'Something went wrong.');
    }
  };

  /**
   * Trigger the Google OAuth browser flow.
   * Import { useContext } from 'react'; const { googlePromptAsync } = useContext(UserContext);
   * Then call: googlePromptAsync();
   */
  const loginWithGoogle = async () => {
    if (!googleRequest) {
      Alert.alert('Google Login', 'Google sign-in is not ready yet. Please try again.');
      return;
    }
    await googlePromptAsync();
  };

  const logout = async () => {
    try {
      if (user) setUser(null);
      setAccessToken(null);
      console.log('[UserContext] logout — AsyncStorage.removeItem("userDetails") ...');
      await AsyncStorage.removeItem('userDetails');
      console.log('[UserContext] logout — AsyncStorage.removeItem("userDetails") ✓');
      console.log('[UserContext] logout — AsyncStorage.removeItem("accessToken") ...');
      await AsyncStorage.removeItem('accessToken');
      console.log('[UserContext] logout — AsyncStorage.removeItem("accessToken") ✓');
      delete axios.defaults.headers.common['Authorization'];
    } catch (error) {
      console.log(error);
      console.error('Failed to logout:', error.message);
    }
  };

  const signUp = async userDetails => {
    try {
      const formattedBirthday = new Date(userDetails.birthday)
        .toISOString()
        .split('T')[0];

      const payload = {
        full_name: userDetails.fullName,
        email: userDetails.email,
        password: userDetails.password,
        gender: userDetails.gender,
        date_of_birth: formattedBirthday,
        phone_number: '7988078651',
        bio: '',
        profile_pic: '',
        status: 'active',
        location: '',
        theme: 'dark',
      };

      const response = await axios.post(
        `https://shivoo-backend.onrender.com/user_auth/signup`,
        payload,
      );

      if (response.status === 200 && response.data) {
        const accessToken = response.data.access_token;

        const userData = {
          ...userDetails,
          accessToken,
        };

        console.log('[UserContext] signUp — AsyncStorage.setItem("userDetails") saving...');
        await AsyncStorage.setItem('userDetails', JSON.stringify(userData));
        console.log('[UserContext] signUp — AsyncStorage.setItem("userDetails") ✓');
        console.log('[UserContext] signUp — AsyncStorage.setItem("accessToken") saving...');
        await AsyncStorage.setItem('accessToken', JSON.stringify(accessToken));
        console.log('[UserContext] signUp — AsyncStorage.setItem("accessToken") ✓');
        setUser(userData);
        setAccessToken(accessToken);
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${accessToken}`;

        return true;
      }
    } catch (error) {
      console.log('Sign-up failed:', error.response?.data || error.message);
      console.error('Sign-up failed:', error.response?.data || error.message);
      return false;
    }
  };

  const fetchUser = async email => {
    try {
      const userData = await axios.get(
        `https://shivoo-backend.onrender.com/user_auth/user`,
        {
          params: {
            _id: email,
            id_src: 'user_email',
          },
        },
      );
      const data = userData.data;
      setUser(data);
      await AsyncStorage.setItem('userData', data);

      return userData;
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
    }

    return false;
  };

  const updateUserLocation = async location => {
    try {
      console.log('[UserContext] updateUserLocation — AsyncStorage.getItem("accessToken") ...');
      const accessTokenDetails = await AsyncStorage.getItem('accessToken');
      console.log('[UserContext] updateUserLocation — accessToken:', accessTokenDetails ? '✓ found' : '✗ null');

      if (!accessTokenDetails) {
        throw new Error('Access token not found.');
      }
      const response = await axios.patch(
        `https://shivoo-backend.onrender.com/user_auth/users?access_token=${encodeURIComponent(
          accessTokenDetails.trim(),
        )}`,
        { location: location },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        const updatedUser = {
          ...user,
          location: location,
        };
        setUser(updatedUser);

        console.log('[UserContext] updateUserLocation — AsyncStorage.setItem("userDetails") saving...');
        await AsyncStorage.setItem('userDetails', JSON.stringify(updatedUser));
        console.log('[UserContext] updateUserLocation — AsyncStorage.setItem("userDetails") ✓');
      }
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const uploadProfileImage = async imageUri => {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile_image.jpg',
    });

    try {
      const response = await axios.post(
        'https://shivoo-file-server.onrender.com/assets/profile_files/upload',
        formData,
        {
          headers: {
            accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const { file_url, file_name } = response.data;

      const updateResponse = await axios.patch(
        `https://shivoo-backend.onrender.com/user_auth/users/${user.id}`,
        {
          profile_pic: file_url,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const updatedUser = {
        ...user,
        profile_pic: file_url,
      };
      setUser(updatedUser);

      console.log('[UserContext] uploadProfileImage — AsyncStorage.setItem("userDetails") saving...');
      await AsyncStorage.setItem('userDetails', JSON.stringify(updatedUser));
      console.log('[UserContext] uploadProfileImage — AsyncStorage.setItem("userDetails") ✓');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isEmailExist,
        fetchUser,
        signUp,
        updateUserLocation,
        uploadProfileImage,
        loginWithGoogle,
        googlePromptAsync,
      }}>
      {children}
    </UserContext.Provider>
  );
};
