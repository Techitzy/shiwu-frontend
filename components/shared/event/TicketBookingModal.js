import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { darkColors, lightColors, primaryColor } from '../../../themes/basics';

const TicketBookingModal = ({ isVisible, maxTickets, pricePerTicket = 0, onClose, onContinue }) => {
  const [ticketCount, setTicketCount] = useState(1);
  const colorScheme = useColorScheme();
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

  const totalAmount = ticketCount * pricePerTicket;

  const handleTicketInput = value => {
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue) || numericValue < 1) {
      setTicketCount(1);
    } else if (numericValue > maxTickets) {
      setTicketCount(maxTickets);
    } else {
      setTicketCount(numericValue);
    }
  };

  const incrementTicket = () => {
    if (ticketCount < maxTickets) setTicketCount(ticketCount + 1);
  };

  const decrementTicket = () => {
    if (ticketCount > 1) setTicketCount(ticketCount - 1);
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View
        style={[
          styles.modalContainer,
          isDarkTheme && styles.modalContainerDark,
        ]}>
        <View
          style={[styles.modalContent, isDarkTheme && styles.modalContentDark]}>
          {/* Close Icon */}
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Ionicons name="close-circle" size={28} color={textColor} />
          </TouchableOpacity>

          {/* Modal Title */}
          <Text style={[styles.modalTitle, { color: textColor }]}>
            Select Tickets
          </Text>

          {/* Ticket Counter */}
          <View style={styles.ticketCounter}>
            <TouchableOpacity
              onPress={decrementTicket}
              style={styles.counterButton}>
              <Ionicons
                name="remove-circle"
                size={30}
                color={primaryColor.main}
              />
            </TouchableOpacity>

            <TextInput
              style={[
                styles.ticketInput,
                isDarkTheme ? styles.ticketInputDark : styles.ticketInputLight,
              ]}
              value={String(ticketCount)}
              keyboardType="numeric"
              onChangeText={handleTicketInput}
            />

            <TouchableOpacity
              onPress={incrementTicket}
              style={styles.counterButton}>
              <Ionicons name="add-circle" size={30} color={primaryColor.main} />
            </TouchableOpacity>
          </View>

          {/* Price Summary */}
          {pricePerTicket > 0 && (
            <View style={[styles.priceSummary, { borderColor: isDarkTheme ? '#444' : '#e0e0e0' }]}>
              <View style={styles.priceRow}>
                <Text style={[styles.priceLabel, { color: textColor }]}>
                  ₹{pricePerTicket} × {ticketCount} ticket{ticketCount > 1 ? 's' : ''}
                </Text>
                <Text style={[styles.priceValue, { color: textColor }]}>
                  ₹{totalAmount}
                </Text>
              </View>
              <View style={[styles.priceDivider, { backgroundColor: isDarkTheme ? '#444' : '#e0e0e0' }]} />
              <View style={styles.priceRow}>
                <Text style={[styles.totalLabel, { color: textColor }]}>Total</Text>
                <Text style={[styles.totalValue, { color: primaryColor.main }]}>
                  ₹{totalAmount}
                </Text>
              </View>
            </View>
          )}

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => onContinue({ ticketCount, totalAmount })}>
            <Text style={styles.continueButtonText}>
              {pricePerTicket > 0 ? `Pay ₹${totalAmount}` : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainerDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: 'relative',
  },
  modalContentDark: {
    backgroundColor: '#222',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  ticketCounter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  counterButton: {
    padding: 5,
  },
  ticketInput: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    width: 60,
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 10,
    paddingVertical: 5,
  },
  ticketInputLight: {
    color: '#000',
    borderColor: '#ccc',
  },
  ticketInputDark: {
    color: '#fff',
    borderColor: '#555',
  },
  priceSummary: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  priceLabel: {
    fontSize: 14,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  priceDivider: {
    height: 1,
    marginVertical: 6,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: primaryColor.main,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    color: primaryColor.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TicketBookingModal;
