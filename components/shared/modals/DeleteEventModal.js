import React, {useContext} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';

const ThemeContext = React.createContext();

const DeleteEventModal = ({isVisible, onCancel, onDelete}) => {
  const theme = useColorScheme();
  const isDarkTheme = theme === 'dark';

  const textColor = isDarkTheme ? '#fff' : '#000';

  return (
    <Modal transparent={true} visible={isVisible} animationType="slide">
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalContent,
            isDarkTheme ? styles.darkModalContent : styles.lightModalContent,
          ]}>
          <Text
            style={[
              styles.modalTitle,
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}>
            Delete Event?
          </Text>
          <Text
            style={[
              styles.modalText,
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}>
            Are you sure you want to delete this event? Once deleted it cannot
            be undone.
          </Text>
          <TouchableOpacity
            onPress={onDelete}
            style={[styles.button, styles.fullWidthButton]}
            activeOpacity={0.7}>
            <Text style={[styles.buttonText, styles.discardText]}>Confirm</Text>
          </TouchableOpacity>
          <View
            style={[
              styles.divider,
              {backgroundColor: isDarkTheme ? '#e0e0e0' : '#333'},
            ]}
          />
          <View
            style={[
              styles.divider,
              {backgroundColor: isDarkTheme ? '#e0e0e0' : '#333'},
            ]}
          />
          <TouchableOpacity
            onPress={onCancel}
            style={[styles.button, styles.fullWidthButton]}
            activeOpacity={0.7}>
            <Text style={[styles.buttonText, {color: textColor}]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteEventModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '70%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  darkModalContent: {
    backgroundColor: '#333',
  },
  lightModalContent: {
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
  },
  button: {
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 10, // Increased vertical margin
    width: '100%',
    backgroundColor: 'transparent',
  },
  fullWidthButton: {
    width: '100%',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  discardText: {
    color: '#FF3b30', // Red text for discard
  },
  darkText: {
    color: '#fff',
  },
  lightText: {
    color: '#000',
  },
  divider: {
    height: 0.2,
    width: '100%',
    opacity: 0.1, // Making the divider less prominent
  },
});
