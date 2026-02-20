import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const RoleSelectionScreen = () => {
  const [role, setRole] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (!role || !location) {
      Alert.alert(
        'Missing Information',
        'Please select a role and enter a location.',
      );
      return;
    }
    Alert.alert('Success', `You selected ${role} in ${location}.`);

    if (role === 'Host') {
      router.replace('/(tabs)/create');
    } else {
      router.replace('/(tabs)');
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
          onPress={() => router.replace('/(tabs)/create')}
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
    backgroundColor: '#fff',
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
    backgroundColor: '#7373FF',
  },
  roleText: {
    fontSize: 18,
    color: '#000',
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
