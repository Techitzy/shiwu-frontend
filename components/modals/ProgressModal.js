import React, {useContext} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import {primaryColor} from '../../themes/basics';

const ProgressModal = ({isVisible, onCancel, onDelete}) => {
  const theme = useColorScheme();
  const isDarkTheme = theme === 'dark';

  const textColor = isDarkTheme ? '#fff' : '#000';

  return (
    <Modal transparent={true} visible={isVisible} animationType="fade">
      <View style={styles.modalContainer}>
        <View
          style={[
            styles.modalContent,
            isDarkTheme ? styles.darkModalContent : styles.lightModalContent,
          ]}>
          <ActivityIndicator size="small" color={primaryColor.main} />
          <Text
            style={[
              styles.modalTitle,
              isDarkTheme ? styles.darkText : styles.lightText,
            ]}>
            Deleting...
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default ProgressModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 12,
    justifyContent: 'center',
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
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
  },
  darkText: {
    color: '#fff',
  },
  lightText: {
    color: '#000',
  },
});
