/* eslint-disable react-native/no-inline-styles */
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import DatePicker from 'react-native-ui-datepicker';

const SearchFilterScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isDatePickerModalVisible, setDatePickerModalVisibility] =
    useState(false);

  const headerBackgroundColor = isDarkMode ? '#000' : '#fff';
  const headerTextColor = isDarkMode ? '#fff' : '#333';

  const todayAtMidnight = new Date();
  todayAtMidnight.setHours(0, 0, 0, 0);

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#000' : '#fff' },
      ]}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}>
      <View style={[{ backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
        <View style={[styles.header, { backgroundColor: headerBackgroundColor }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={headerTextColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: headerTextColor }]}>
            Filter
          </Text>
        </View>

        <View style={styles.locationContainer}>
          <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#333' }]}>
            Location
          </Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name="location-outline"
              size={20}
              color="#888"
              style={styles.icon}
            />
            <TextInput
              style={[styles.input, { color: isDarkMode ? '#fff' : '#333' }]}
              placeholder="Search your location"
              placeholderTextColor="#888"
            />
          </View>
        </View>

        <View style={styles.dateContainer}>
          <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#333' }]}>
            Select Date
          </Text>
          <TouchableOpacity
            onPress={() => setDatePickerModalVisibility(true)}
            style={styles.datePicker}>
            <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>
              {selectedDate
                ? dayjs(selectedDate).isSame(dayjs(), 'day')
                  ? 'Today'
                  : dayjs(selectedDate).isSame(dayjs().add(1, 'day'), 'day')
                    ? 'Tomorrow'
                    : dayjs(selectedDate).format('ddd D MMM')
                : 'Pick a date'}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={isDatePickerModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setDatePickerModalVisibility(false)}>
          <View style={styles.modalBackground}>
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: isDarkMode ? '#333' : '#fff' },
              ]}>
              <View style={styles.titleContainer}>
                <Text
                  style={[
                    styles.modalTitle,
                    { color: isDarkMode ? '#fff' : '#333' },
                  ]}>
                  When are you planning to go?
                </Text>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setDatePickerModalVisibility(false)}>
                  <Ionicons name="close" size={24} color="#888" />
                </TouchableOpacity>
              </View>

              <DatePicker
                date={selectedDate || new Date()}
                mode="single"
                minDate={todayAtMidnight}
                onChange={params => {
                  setSelectedDate(params.date);
                  setDatePickerModalVisibility(false);
                }}
                theme={isDarkMode ? 'dark' : 'light'}
              />
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default SearchFilterScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  locationContainer: {
    marginVertical: 20,
  },
  dateContainer: {
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  cancelButton: {
    padding: 5,
  },
});
