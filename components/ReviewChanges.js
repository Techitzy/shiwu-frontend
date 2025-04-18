import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  useColorScheme,
  FlatList,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageGrid from './ImageGrid';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const ReviewChanges = ({
  title,
  setTitle,
  location,
  setLocation,
  categories,
  setCategories,
  images,
  setImages,
  showDateTimePicker,
  dateTime,
  handleDateConfirm,
  hideDateTimePicker,
  isDateTimePickerVisible,
  formatDate,
  amenities,
  setAmenities,
  description,
  setDescription,
  maxParticipants,
  setMaxParticipants,
  minAge,
  setMinAge,
  autoApproval,
  setAutoApproval,
  price,
  setPrice,
}) => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const textColor = isDarkTheme ? '#fff' : '#000';
  const borderColor = isDarkTheme ? '#333' : '#ccc';

  const [newAmenity, setNewAmenity] = useState('');
  const [restrictionsExpanded, setRestrictionsExpanded] = useState(false);
  const [animationHeight] = useState(new Animated.Value(0));

  const toggleRestrictions = () => {
    if (restrictionsExpanded) {
      Animated.timing(animationHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setRestrictionsExpanded(false));
    } else {
      setRestrictionsExpanded(true);
      Animated.timing(animationHeight, {
        toValue: 100,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const toggleCategory = id => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === id ? {...cat, selected: !cat.selected} : cat,
      ),
    );
  };

  const toggleAmenity = id => {
    setAmenities(prev =>
      prev.map(amenity =>
        amenity.id === id ? {...amenity, selected: !amenity.selected} : amenity,
      ),
    );
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      const newAmenityItem = {
        id: amenities.length + 1,
        name: newAmenity,
        selected: true,
      };
      setAmenities([...amenities, newAmenityItem]);
      setNewAmenity('');
    }
  };

  const incrementValue = setter => () =>
    setter(prev => String(Number(prev || 0) + 1));
  const decrementValue = setter => () =>
    setter(prev => String(Math.max(Number(prev || 0) - 1, 0)));

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Title */}
      <Text style={[styles.label, {color: textColor}]}>Title of Event</Text>
      <TextInput
        style={[styles.input, {borderColor, color: textColor}]}
        placeholder="Enter title"
        placeholderTextColor={isDarkTheme ? '#aaa' : '#666'}
        value={title}
        onChangeText={setTitle}
      />

      {/* Location */}
      <Text style={[styles.label, {color: textColor}]}>Location</Text>
      <TextInput
        style={[styles.input, {borderColor, color: textColor}]}
        placeholder="Start typing location"
        placeholderTextColor={isDarkTheme ? '#aaa' : '#666'}
        value={location}
        onChangeText={setLocation}
      />

      {/* Category */}
      <Text style={[styles.label, {color: textColor}]}>Category</Text>
      <View style={styles.chipContainer}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.chip,
              {
                backgroundColor: cat.selected
                  ? '#7373FF'
                  : isDarkTheme
                  ? '#333'
                  : '#ddd',
              },
            ]}
            onPress={() => toggleCategory(cat.id)}>
            <Text
              style={{
                color: cat.selected ? '#fff' : textColor,
                fontWeight: 'bold',
              }}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date */}
      <View style={styles.row}>
        <Text style={[styles.label, {color: textColor}]}>Date and Time</Text>
        <TouchableOpacity
          onPress={showDateTimePicker}
          style={[
            styles.dateTimeInputRow,
            {backgroundColor: isDarkTheme ? '#333' : '#ddd'},
          ]}>
          <Text style={{color: textColor}}>
            {dateTime ? formatDate(dateTime) : 'Select Date and Time'}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDateTimePickerVisible}
          mode="datetime"
          date={dateTime || new Date()}
          onConfirm={handleDateConfirm}
          onCancel={hideDateTimePicker}
          minimumDate={new Date()}
        />
      </View>

      {/* Basic Amenities */}
      <Text style={[styles.label, {color: textColor}]}>Basic Amenities</Text>
      <FlatList
        data={amenities}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => toggleAmenity(item.id)}>
            <Ionicons
              name={item.selected ? 'checkbox-outline' : 'square-outline'}
              size={20}
              color={textColor}
            />
            <Text style={{color: textColor, marginLeft: 8}}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      {/* <View style={styles.newAmenityContainer}>
        <TextInput
          style={[styles.input, {borderColor, color: textColor}]}
          placeholder="Add a new amenity"
          placeholderTextColor={isDarkTheme ? '#aaa' : '#666'}
          value={newAmenity}
          onChangeText={setNewAmenity}
        />
        <TouchableOpacity
          onPress={incrementValue(addAmenity)}
          style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={30} color="#7373FF" />
        </TouchableOpacity>
      </View> */}

      {/* Description */}
      <Text style={[styles.label, {color: textColor}]}>Description</Text>
      <TextInput
        style={[
          styles.input,
          {height: 100, borderColor, textAlignVertical: 'top'},
        ]}
        placeholder="Enter description"
        placeholderTextColor={isDarkTheme ? '#aaa' : '#666'}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity
        style={[styles.restrictionToggle, {borderColor}]}
        onPress={toggleRestrictions}>
        <Text style={[styles.label, {color: textColor}]}>Restrictions</Text>
        <Ionicons
          name={restrictionsExpanded ? 'chevron-down' : 'chevron-forward'}
          size={20}
          color={textColor}
        />
      </TouchableOpacity>
      {/* Animated Restrictions Section */}
      <Animated.View
        style={[
          styles.restrictionContent,
          {height: restrictionsExpanded ? null : 0, overflow: 'hidden'},
        ]}>
        {restrictionsExpanded && (
          <>
            {/* Max Participants */}
            <View style={[styles.row, styles.restrictionRow]}>
              <Text style={[styles.label, {color: textColor}]}>
                Max. Participants
              </Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  onPress={decrementValue(setMaxParticipants)}
                  style={styles.counterButton}>
                  <Ionicons
                    name="remove-circle-outline"
                    size={20}
                    color="#7373FF"
                  />
                </TouchableOpacity>
                <TextInput
                  style={[styles.counterInput, {borderColor, color: textColor}]}
                  value={maxParticipants}
                  onChangeText={setMaxParticipants}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  onPress={incrementValue(setMaxParticipants)}
                  style={styles.counterButton}>
                  <Ionicons
                    name="add-circle-outline"
                    size={20}
                    color="#7373FF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Min Age */}
            <View style={[styles.row, styles.restrictionRow]}>
              <Text style={[styles.label, {color: textColor}]}>Min. Age</Text>
              <View style={styles.counterContainer}>
                <TouchableOpacity
                  onPress={decrementValue(setMinAge)}
                  style={styles.counterButton}>
                  <Ionicons
                    name="remove-circle-outline"
                    size={20}
                    color="#7373FF"
                  />
                </TouchableOpacity>
                <TextInput
                  style={[styles.counterInput, {borderColor, color: textColor}]}
                  value={minAge}
                  onChangeText={setMinAge}
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  onPress={incrementValue(setMinAge)}
                  style={styles.counterButton}>
                  <Ionicons
                    name="add-circle-outline"
                    size={20}
                    color="#7373FF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.row, styles.restrictionRow]}>
              <Text style={[styles.label, {color: textColor}]}>
                Auto Approval
              </Text>
              <Switch
                value={autoApproval}
                onValueChange={setAutoApproval}
                trackColor={{false: '#ccc', true: '#7373FF'}}
              />
            </View>
          </>
        )}
      </Animated.View>

      {/* Price Per Person */}
      <View style={styles.row}>
        <Text style={[styles.label, {color: textColor}]}>Price Per Person</Text>
        <View style={[styles.inputRowPrice, {borderColor}]}>
          <Text style={{color: textColor, marginRight: 5}}>₹</Text>
          <TextInput
            style={{flex: 1, color: textColor}}
            placeholder="Enter price"
            placeholderTextColor={isDarkTheme ? '#aaa' : '#666'}
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
        </View>
      </View>

      <Text style={[styles.label, {color: textColor}]}>
        Add Images for your event
      </Text>
      <GestureHandlerRootView style={styles.container}>
        <ImageGrid images={images} setImages={setImages} />
      </GestureHandlerRootView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  createButton: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    paddingBottom: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  inputRowPrice: {
    flex: 1,
    maxWidth: 150,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    marginLeft: 20,
  },
  dateTimeInputRow: {
    flex: 1,
    maxWidth: 170,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 20,
  },
  inputRow: {
    flex: 1,
    maxWidth: 150,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 20,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    margin: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  newAmenityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    marginBottom: '5%',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  restrictionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  restrictionContent: {
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  restrictionRow: {
    marginVertical: 8,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    marginHorizontal: 8,
  },
  counterInput: {
    borderWidth: 1,
    borderRadius: 4,
    textAlign: 'center',
    paddingHorizontal: 8,
    width: 50,
  },
});

export default ReviewChanges;
