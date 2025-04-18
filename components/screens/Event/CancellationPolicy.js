import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
  useColorScheme,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {lightColors, darkColors, primaryColor} from '../../../themes/basics';

const CancellationPolicy = () => {
  const colorScheme = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);

  const isDarkTheme = colorScheme === 'dark';
  const backgroundColor = isDarkTheme
    ? darkColors.backgroundColor
    : lightColors.backgroundColor;
  const textColor = isDarkTheme ? darkColors.textColor : lightColors.textColor;
  const headerTextColor = isDarkTheme
    ? darkColors.headerTextColor
    : lightColors.headerTextColor;
  const informationText = isDarkTheme
    ? darkColors.informationText
    : lightColors.informationText;

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <>
      <TouchableOpacity
        style={[
          styles.termsContainer,
          {
            backgroundColor: backgroundColor,
            shadowColor: '#888',
          },
        ]}
        onPress={openModal}>
        <Text style={[styles.header, {color: textColor}]}>
          Cancellation Policy
        </Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={isDarkTheme ? '#ccc' : '#000'}
          style={styles.icon}
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {backgroundColor: isDarkTheme ? '#222' : '#fff'},
            ]}>
            <TouchableOpacity style={styles.closeIcon} onPress={closeModal}>
              <Ionicons name="close-circle" size={28} color={textColor} />
            </TouchableOpacity>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, {color: textColor}]}>
                Terms & Conditions
              </Text>
            </View>
            <Text style={[styles.modalText, {color: informationText}]}>
              Please read and accept the terms and conditions before
              participating in this event. Ensure you are aware of our
              cancellation policy, refund policy, and guidelines. By proceeding,
              you agree to comply with these terms.
            </Text>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText} onPress={closeModal}>
                Okay, Got it
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 4},
    marginHorizontal: 10,
  },
  header: {
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
  },
  icon: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: 'relative',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
  },
  buttonContainer: {
    backgroundColor: primaryColor.main,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: primaryColor.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CancellationPolicy;
