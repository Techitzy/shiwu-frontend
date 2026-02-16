import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserService from '../services/UserService';
import {Text, View, ActivityIndicator} from 'react-native';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';

export const UserContext = createContext();

export const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  // Check if the user is logged in by fetching from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const savedUser = await AsyncStorage.getItem('userDetails');
        let latestUserData = null;

        if (savedUser) {
          latestUserData = JSON.parse(savedUser);
          setUser(latestUserData);

          // Set the authorization header
          if (latestUserData.accessToken) {
            axios.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${latestUserData.accessToken}`;
          }
        }

        if (!JSON.parse(savedUser).location) {
          Geolocation.getCurrentPosition(
            async position => {
              const {latitude, longitude} = position.coords;
              const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDEp4eMaWFDi6psYCa4NSc3NONttlxD3Xo`,
              );
              const address = response.data.results[0];
              const city = address.address_components.find(comp =>
                comp.types.includes('locality'),
              ).long_name;

              if (latestUserData) {
                const updatedUser = {...latestUserData, location: city};
                setUser(updatedUser);
                await AsyncStorage.setItem(
                  'userDetails',
                  JSON.stringify(updatedUser),
                );
              }
            },
            error => {
              console.error('Location fetching error:', error);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        }
      } catch (error) {
        console.error('Error loading or updating user data:', error.message);
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
        {id: email, password},
      );

      if (response.status === 200 && response.data) {
        const accessToken = response.data.access_token;

        // Fetch user details
        const userDetailsResponse = await axios.get(
          `https://shivoo-backend.onrender.com/user_auth/user`,
          {params: {_id: email, id_src: 'user_email'}},
        );

        const userDetails = userDetailsResponse.data;
        const userData = {
          ...userDetails,
          accessToken,
        };

        // Save user details to AsyncStorage
        await AsyncStorage.setItem('userDetails', JSON.stringify(userData));
        await AsyncStorage.setItem('accessToken', JSON.stringify(accessToken));

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

  const logout = async () => {
    try {
      if (user) setUser(null);
      setAccessToken(null);
      await AsyncStorage.removeItem('userDetails');
      await AsyncStorage.removeItem('accessToken');
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

        await AsyncStorage.setItem('userDetails', JSON.stringify(userData));
        await AsyncStorage.setItem('accessToken', JSON.stringify(accessToken));
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
      const accessTokenDetails = await AsyncStorage.getItem('accessToken');

      if (!accessTokenDetails) {
        throw new Error('Access token not found.');
      }
      const response = await axios.patch(
        `https://shivoo-backend.onrender.com/user_auth/users?access_token=${encodeURIComponent(
          accessTokenDetails.trim(),
        )}`,
        {location: location},
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

        await AsyncStorage.setItem('userDetails', JSON.stringify(updatedUser));
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

      const {file_url, file_name} = response.data;

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

      await AsyncStorage.setItem('userDetails', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
      }}>
      {children}
    </UserContext.Provider>
  );
};
