import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Alert,
  useColorScheme,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {UserContext} from '../../../context/UserContext';
import {darkColors, lightColors, primaryColor} from '../../../themes/basics';

const sampleUsers = [
  {id: 1, name: 'John Doe', imageUrl: 'https://via.placeholder.com/150'},
  {id: 2, name: 'Jane Smith', imageUrl: 'https://via.placeholder.com/150'},
  {id: 3, name: 'Alice Johnson', imageUrl: 'https://via.placeholder.com/150'},
  {id: 4, name: 'Bob Brown', imageUrl: 'https://via.placeholder.com/150'},
  {id: 5, name: 'Tom Clark', imageUrl: 'https://via.placeholder.com/150'},
  {id: 6, name: 'Tina Adams', imageUrl: 'https://via.placeholder.com/150'},
  {id: 7, name: 'Mike Davis', imageUrl: 'https://via.placeholder.com/150'},
  {id: 8, name: 'Nancy Green', imageUrl: 'https://via.placeholder.com/150'},
  {id: 9, name: 'Lucy Lopez', imageUrl: 'https://via.placeholder.com/150'},
  {id: 10, name: 'Charles Lee', imageUrl: 'https://via.placeholder.com/150'},
];

const ApproveRequestScreen = () => {
  const navigation = useNavigation();
  const {logout, setTheme} = useContext(UserContext);
  const colorScheme = useColorScheme();

  const isDarkTheme = colorScheme === 'dark';
  const backgroundColor =
    colorScheme === 'dark'
      ? darkColors.backgroundColor
      : lightColors.backgroundColor;
  const textColor =
    colorScheme === 'dark' ? darkColors.textColor : lightColors.textColor;
  const inputBackground = 'dark'
    ? darkColors.inputBackground
    : lightColors.inputBackground;
  const borderBottomColor = 'dark'
    ? darkColors.borderBottomColor
    : lightColors.borderBottomColor;
  const informationText = '#333';

  return (
    <ScrollView style={[styles.container, {backgroundColor}]}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={26} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: textColor}]}>
          Approve Requests
        </Text>
        <TouchableOpacity style={styles.manageButton}>
          <Text style={[styles.manageTitle, {color: textColor}]}>Manage</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={sampleUsers}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.userContainer}>
            <Image source={{uri: item.imageUrl}} style={styles.avatar} />
            <Text style={[styles.userName, {color: textColor}]}>
              {item.name}
            </Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[
                  styles.approveButton,
                  {backgroundColor: primaryColor.main},
                ]}
                onPress={() =>
                  Alert.alert('Approved', `${item.name} has been approved.`)
                }>
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.rejectButton,
                  {backgroundColor: informationText},
                ]}
                onPress={() =>
                  Alert.alert('Rejected', `${item.name} has been rejected.`)
                }>
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  manageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  manageButton: {
    marginLeft: 'auto',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    flex: 1,
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  approveButton: {
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  rejectButton: {
    padding: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ApproveRequestScreen;
