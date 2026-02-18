import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { darkColors, lightColors, primaryColor } from '../../themes/basics';

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
      try {
        const response = await fetch(apiUrl);
        const json = await response.json();
        setSuggestions(json.predictions);
        setIsDropdownVisible(true);
      } catch (error) {
        console.error(error);
        if (setErrors) setErrors({...errors, address: 'Failed to fetch suggestions'});
      }
    } else {
      setSuggestions([]);
      if (setIsDropdownVisible) setIsDropdownVisible(false);
    }
  };

  const handleSelectItem = async item => {
    setAddress(item.description);
    setSuggestions([]);
    if (setIsDropdownVisible) setIsDropdownVisible(false);
    if (errors?.address && setErrors) setErrors({...errors, address: ''});

    const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&fields=address_component&key=AIzaSyDEp4eMaWFDi6psYCa4NSc3NONttlxD3Xo`;
    try {
      const response = await fetch(placeDetailsUrl);
      const json = await response.json();
      if (json.result) {
        const addressComponents = json.result.address_components;
        const cityComp = addressComponents.find(component =>
          component.types.includes('locality'),
        );
        const areaComp = addressComponents.find(
          component =>
            component.types.includes('sublocality_level_1') ||
            component.types.includes('sublocality'),
        );
        if (setCity && cityComp) setCity(cityComp.long_name);
        if (setArea && areaComp) setArea(areaComp.long_name);
      }
    } catch (error) {
      console.error('Failed to fetch place details:', error);
      if (setErrors) setErrors({...errors, address: 'Failed to fetch detailed location'});
    }
  };

  const requestLocationPermission = async () => {
    try {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        getCurrentLocation();
      } else {
        console.log('Location permission denied');
        if (setErrors) setErrors({...errors, address: 'Location permission denied'});
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      if (setErrors) setErrors({...errors, address: 'Failed to request location permission'});
    }
  };

  const getCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const {latitude, longitude} = position.coords;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDEp4eMaWFDi6psYCa4NSc3NONttlxD3Xo`,
      );
      const data = await response.json();
      
      setIsLoading(false);
      if (data.results && data.results.length > 0) {
        const firstResult = data.results[0];
        setAddress(firstResult.formatted_address);
        const addressComponents = firstResult.address_components;
        const cityComp = addressComponents.find(component =>
          component.types.includes('locality'),
        );
        const areaComp = addressComponents.find(
          component =>
            component.types.includes('sublocality_level_1') ||
            component.types.includes('sublocality'),
        );
        if (setCity && cityComp) setCity(cityComp.long_name);
        if (setArea && areaComp) setArea(areaComp.long_name);
      } else {
        console.log('No address found');
        if (setErrors) setErrors({...errors, address: 'No address found'});
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Location error:', error);
      if (setErrors) setErrors({...errors, address: error.message});
    }
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
                borderColor: errors?.address ? 'red' : defaultBorderColor,
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
            ]}
            onPress={requestLocationPermission}>
            {isLoading ? (
              <ActivityIndicator size="small" color={primaryColor.main} />
            ) : (
              <MaterialIcons
                name="my-location"
                size={24}
                color={primaryColor.main}
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
                  {backgroundColor, borderColor},
                ]}>
                <Text style={[styles.listItemText, {color: textColor}]}>{item.description}</Text>
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
