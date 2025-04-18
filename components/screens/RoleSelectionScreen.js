import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';

const RoleSelectionScreen = ({navigation}) => {
  const [role, setRole] = useState(null);
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    if (!role || !location) {
      Alert.alert(
        'Missing Information',
        'Please select a role and enter a location.',
      );
      return;
    }
    Alert.alert('Success', `You selected ${role} in ${location}.`);

    // If role is 'Host', navigate to CreateEventScreen
    if (role === 'Host') {
      navigation.navigate('CreateEvent');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Role</Text>

      {/* Role Selection Buttons */}
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === 'Attendee' ? styles.selected : null,
          ]}
          onPress={() => setRole('Attendee')}>
          <Text style={styles.roleText}>Attendee</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleButton, role === 'Host' ? styles.selected : null]}
          onPress={() => setRole('Host')}>
          <Text style={styles.roleText}>Host</Text>
        </TouchableOpacity>
      </View>

      {/* Location Input */}
      {role === 'Attendee' && (
        <TextInput
          placeholder="Enter Location"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
        />
      )}

      {/* Show Create Event button if role is 'Host' */}
      {role === 'Host' && (
        <Button
          title="Create Event"
          onPress={() => navigation.navigate('CreateEvent')}
        />
      )}

      {/* Search Button */}
      {role === 'Attendee' && <Button title="Search" onPress={handleSearch} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    marginHorizontal: 10,
    padding: 15,
    backgroundColor: '#ddd',
    borderRadius: 10,
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#4CAF50',
  },
  roleText: {
    fontSize: 18,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default RoleSelectionScreen;
