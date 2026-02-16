import React, {useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const GooglePlacesInput = ({onPlaceSelected}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = async text => {
    setQuery(text);
    if (text.length > 2) {
      // To reduce API calls, only search if text length > 2
      const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyDEp4eMaWFDi6psYCa4NSc3NONttlxD3Xo&input=${encodeURIComponent(
        text,
      )}&language=en`;
      try {
        const result = await fetch(apiUrl);
        const json = await result.json();
        setSuggestions(json.predictions);
      } catch (error) {
        console.error(error);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Search for a place"
        onChangeText={handleSearch}
        value={query}
      />
      <FlatList
        data={suggestions}
        keyExtractor={item => item.place_id}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => onPlaceSelected(item)}>
            <Text style={styles.itemText}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
  },
  itemText: {
    fontSize: 16,
    margin: 10,
  },
});

export default GooglePlacesInput;
