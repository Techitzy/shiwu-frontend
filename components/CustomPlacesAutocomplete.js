import Geolocation from '@react-native-community/geolocation';
import React, {useEffect, useRef, useState} from 'react';
import {
  TextInput,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {darkColors, lightColors, primaryColor} from '../themes/basics';

const CustomPlacesAutocomplete = ({
  isDarkTheme,
  address,
  setAddress,
  errors,
  setErrors,
  isDropdownVisible,
  setIsDropdownVisible,
  setArea,
  setCity,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const backgroundColor = isDarkTheme ? '#121212' : '#fff';
  const defaultBorderColor = isDarkTheme ? '#333' : '#ccc';
  const textColor = isDarkTheme ? darkColors.textColor : lightColors.textColor;
  const borderColor = isDarkTheme ? '#333' : '#ccc';

  const handleSearch = async text => {
    setAddress(text);
    if (text.length > 2) {
      const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        text,
      )}&key=AIzaSyDEp4eMaWFDi6psYCa4NSc3NONttlxD3Xo&language=en`;
      // Replace 'YOUR_API_KEY' with your actual key.
      try {
        const response = await fetch(apiUrl);
        const json = await response.json();
        setSuggestions(json.predictions);
        setIsDropdownVisible(true);
      } catch (error) {
        console.error(error);
        setErrors({...errors, address: 'Failed to fetch suggestions'});
      }
    } else {
      setSuggestions([]);
      setIsDropdownVisible(false);
    }
  };

  const handleSelectItem = async item => {
    setAddress(item.description);
    setSuggestions([]);
    setIsDropdownVisible(false);
    if (errors.address) setErrors({...errors, address: ''});

    const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&fields=address_component&key=AIzaSyDEp4eMaWFDi6psYCa4NSc3NONttlxD3Xo`;
    try {
      const response = await fetch(placeDetailsUrl);
      const json = await response.json();
      if (json.result) {
        const addressComponents = json.result.address_components;
        const city = addressComponents.find(component =>
          component.types.includes('locality'),
        );
        const area = addressComponents.find(
          component =>
            component.types.includes('sublocality_level_1') &&
            component.types.includes('sublocality'),
        );
        setCity(city.long_name);
        setArea(area.long_name);
      }
    } catch (error) {
      console.error('Failed to fetch place details:', error);
      setErrors({...errors, address: 'Failed to fetch detailed location'});
    }
  };

  const requestLocationPermission = async () => {
    let result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (result === RESULTS.GRANTED) {
      getCurrentLocation();
    } else {
      result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (result === RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        console.log('Location permission denied');
        setErrors({...errors, address: 'Location permission denied'});
      }
    }
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDEp4eMaWFDi6psYCa4NSc3NONttlxD3Xo`,
        )
          .then(response => response.json())
          .then(data => {
            setIsLoading(false);
            if (data.results && data.results.length > 0) {
              const firstResult = data.results[0];
              setAddress(firstResult.formatted_address);
              const addressComponents = firstResult.address_components;
              const city = addressComponents.find(component =>
                component.types.includes('locality'),
              );
              const area = addressComponents.find(
                component =>
                  component.types.includes('sublocality_level_1') &&
                  component.types.includes('sublocality'),
              );
              setCity(city.long_name);
              setArea(area.long_name);
            } else {
              console.log('No address found');
              setErrors({...errors, address: 'No address found'});
            }
          })
          .catch(error => {
            console.error(error);
            setIsLoading(false);
            setErrors({...errors, address: 'Failed to fetch address'});
          });
      },
      error => {
        setIsLoading(false);
        console.error(error);
        setErrors({...errors, address: error.message});
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: errors.address ? 'red' : defaultBorderColor,
                color: textColor,
                backgroundColor,
              },
            ]}
            onChangeText={handleSearch}
            value={address}
            placeholder="Enter address"
            placeholderTextColor={isDarkTheme ? '#aaa' : '#666'}
          />
          <TouchableOpacity
            style={[
              styles.icon,
              {backgroundColor: isDarkTheme ? '#333' : '#ddd'},
            ]}>
            {isLoading ? (
              <ActivityIndicator size="small" color={primaryColor.main} />
            ) : (
              <MaterialIcons
                name="my-location"
                size={24}
                color={primaryColor.main}
                onPress={requestLocationPermission}
              />
            )}
          </TouchableOpacity>
        </View>
        {isDropdownVisible && suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={item => item.place_id}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => handleSelectItem(item)}
                style={[
                  styles.listItem,
                  {backgroundColor, color: textColor, borderColor},
                ]}>
                <Text style={styles.listItemText}>{item.description}</Text>
              </TouchableOpacity>
            )}
            style={[styles.listView, {borderColor}]}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    paddingRight: 55,
  },
  icon: {
    position: 'absolute',
    right: 2,
    borderRadius: 4,
    height: '90%',
    justifyContent: 'center',
    padding: 10,
  },
  listView: {
    borderWidth: 1,
    borderTopWidth: 0,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 3,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 0.2,
  },
  listItemText: {
    fontSize: 14,
  },
});

export default CustomPlacesAutocomplete;
