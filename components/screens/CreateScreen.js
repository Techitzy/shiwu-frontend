import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Easing,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  FlatList,
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import ImageGrid from '../ImageGrid';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Switch} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import ReviewChanges from '../ReviewChanges';

const CreateScreen = () => {
  const colorScheme = useColorScheme();

  const isDarkTheme = colorScheme === 'dark';
  const backgroundColor = isDarkTheme ? '#121212' : '#fff';
  const textColor = isDarkTheme ? '#ffffff' : '#000000';
  const borderColor = isDarkTheme ? '#333' : '#ccc';

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [categories, setCategories] = useState([
    {id: 'house_party', label: 'House Party', selected: false},
    {id: 'birthday', label: 'Birthday', selected: false},
  ]);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(1);
  const [amenities, setAmenities] = useState([
    {id: 1, name: 'WiFi', selected: false},
    {id: 2, name: 'Parking', selected: false},
    {id: 3, name: 'Swimming Pool', selected: false},
    {id: 4, name: 'Food', selected: false},
  ]);
  const [newAmenity, setNewAmenity] = useState('');
  const [description, setDescription] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [minAge, setMinAge] = useState('');
  const [autoApproval, setAutoApproval] = useState(false);
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const [categoryError, setCategoryError] = useState('');
  const [dateTime, setDateTime] = useState(null);
  const [isDateTimePickerVisible, setDateTimePickerVisibility] =
    useState(false);

  const resetFormData = () => {
    setTitle('');
    setLocation('');
    setCategories([
      {id: 'house_party', label: 'House Party', selected: false},
      {id: 'birthday', label: 'Birthday', selected: false},
    ]);
    setProgress(1);
    setNewAmenity('');
    setDescription('');
    setError('');
  };

  const handleCreateEvent = () => {
    Toast.show({
      type: 'success',
      text1: 'Hurrayy!!, Event is now live.',
      text2: 'Your event has been created.',
      position: 'bottom',
      visibilityTime: 4000,
      onHide: () => {
        resetFormData();
      },
    });
  };

  const handleContinue = () => {
    if (progress === 1 && !title.trim()) {
      setError('Title is required.');
      return;
    }

    if (progress === 2 && !location.trim()) {
      setError('Location is required.');
      return;
    }

    if (progress === 3) {
      const selectedCategories = categories.filter(cat => cat.selected);
      if (selectedCategories.length === 0) {
        setCategoryError('At least one category is required.');
        return;
      }
      if (selectedCategories.length > 3) {
        setCategoryError('You can select up to 3 categories only.');
        return;
      }
      setCategoryError('');
    }

    if (progress === 5 && !dateTime) {
      setError('Date and time are required.');
      return;
    }

    if (progress === 8 && !maxParticipants) {
      setError('Participant count is required.');
      return;
    }
    if (progress === 8 && !minAge) {
      setError('Age is required.');
      return;
    }

    setError('');
    setCategoryError('');

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim, {
      toValue: -20,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      setProgress(progress + 1);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    });
  };

  const toggleCategory = id => {
    setCategories(prev => {
      const selectedCount = prev.filter(cat => cat.selected).length;
      const updatedCategories = prev.map(cat => {
        if (cat.id === id) {
          if (!cat.selected && selectedCount >= 3) {
            setCategoryError('You can select up to 3 categories only.');
            return cat;
          }
          setCategoryError('');
          return {...cat, selected: !cat.selected};
        }
        return cat;
      });
      return updatedCategories;
    });
  };

  const handleDateConfirm = date => {
    const currentDate = new Date();
    if (date < currentDate) {
      setError('Date cannot be in the past');
      return;
    }
    // Update date only if it is different
    if (date.getTime() !== dateTime?.getTime()) {
      setDateTime(date);
      setDateTimePickerVisibility(false);
    }
  };

  const showDateTimePicker = () => {
    setDateTimePickerVisibility(true);
  };

  const hideDateTimePicker = () => {
    setDateTimePickerVisibility(false);
  };
  const formatDate = date => {
    const options = {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  const handleBack = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim, {
      toValue: 20,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      setProgress(progress - 1);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    });
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
    <View style={[styles.container, {backgroundColor}]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, {color: textColor}]}>
            {progress === 10 ? 'Review Changes' : 'Create Event'}
          </Text>
        </View>
        {progress === 10 && (
          <TouchableOpacity onPress={handleCreateEvent}>
            <Text style={[styles.createButton, {color: '#7373FF'}]}>
              Create
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {[...Array(10)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressLine,
              {
                backgroundColor: index < progress ? '#7373FF' : '#ccc',
              },
            ]}
          />
        ))}
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          {progress === 1 && (
            <>
              <Text style={[styles.title, {color: textColor}]}>
                Title of Event
              </Text>
              <TextInput
                style={[styles.input, {color: textColor}]}
                placeholder="Enter Title..."
                placeholderTextColor={isDarkTheme ? '#888' : '#aaa'}
                value={title}
                onChangeText={text => {
                  setTitle(text);
                  setError('');
                }}
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </>
          )}
          {progress === 2 && (
            <>
              <Text style={[styles.title, {color: textColor}]}>Location</Text>
              <TextInput
                style={[styles.input, {color: textColor}]}
                placeholder="Start typing location..."
                placeholderTextColor={isDarkTheme ? '#888' : '#aaa'}
                value={location}
                onChangeText={text => {
                  setLocation(text);
                  setError('');
                }}
              />
              {error && <Text style={styles.errorText}>{error}</Text>}
            </>
          )}
          {progress === 3 && (
            <>
              <Text style={[styles.title, {color: textColor}]}>
                Add category of event
              </Text>
              <Text style={[styles.infoText, {color: textColor}]}>
                Select up to 2 categories.
              </Text>
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
              {/* Reserve space for the error */}
              <View style={styles.errorContainer}>
                {categoryError ? (
                  <Text style={styles.errorText}>{categoryError}</Text>
                ) : (
                  <Text style={styles.placeholderText}> </Text> // Invisible placeholder
                )}
              </View>
            </>
          )}
          {progress === 4 && (
            <>
              <View style={[{marginTop: 190}]}>
                <Text style={[styles.title, {color: textColor}]}>
                  Add Images for your event
                </Text>
                <GestureHandlerRootView style={styles.container}>
                  <ImageGrid images={images} setImages={setImages} />
                </GestureHandlerRootView>
              </View>
            </>
          )}
          {progress === 5 && (
            <>
              <Text style={[styles.title, {color: textColor}]}>
                Select Date and Time
              </Text>
              <TouchableOpacity
                onPress={showDateTimePicker}
                style={styles.dateButton}>
                <Text
                  style={[
                    styles.dateText,
                    {color: isDarkTheme ? '#888' : '#aaa'},
                  ]}>
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
              {error && <Text style={styles.errorText}>{error}</Text>}
            </>
          )}
          {progress === 6 && (
            <>
              <View style={[{marginTop: 190}]}>
                <Text style={[styles.title, {color: textColor}]}>
                  Basic Amenities
                </Text>
                <FlatList
                  data={amenities}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={styles.checkboxContainer}
                      onPress={() => toggleAmenity(item.id)}>
                      <Ionicons
                        name={
                          item.selected ? 'checkbox-outline' : 'square-outline'
                        }
                        size={20}
                        color={textColor}
                      />
                      <Text style={{color: textColor, marginLeft: 8}}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </>
          )}
          {progress === 7 && (
            <>
              <Text style={[styles.title, {color: textColor}]}>
                Description
              </Text>
              <TextInput
                style={[styles.descriptionInput, {color: textColor}]}
                placeholder="Please describe about your event..."
                placeholderTextColor={isDarkTheme ? '#888' : '#aaa'}
                value={description}
                onChangeText={text => {
                  setDescription(text);
                  setError('');
                }}
                multiline={true} // Ensures multiline input is enabled
                numberOfLines={4}
              />
              {error && <Text style={styles.errorText}>{error}</Text>}
            </>
          )}
          {progress === 8 && (
            <>
              <Text
                style={[styles.title, {color: textColor, marginBottom: 30}]}>
                Restrictions
              </Text>
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
                    style={[
                      styles.counterInput,
                      {borderColor, color: textColor},
                    ]}
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
                    style={[
                      styles.counterInput,
                      {borderColor, color: textColor},
                    ]}
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
              <View style={[styles.row, {justifyContent: 'space-between'}]}>
                <Text style={[styles.label, {color: textColor}]}>
                  Invite Only
                </Text>
                <Switch
                  value={autoApproval}
                  onValueChange={setAutoApproval}
                  trackColor={{false: '#ccc', true: '#7373FF'}}
                />
              </View>
              {error && <Text style={styles.errorText}>{error}</Text>}
            </>
          )}
          {progress === 9 && (
            <>
              <Text
                style={[styles.title, {color: textColor, marginBottom: 10}]}>
                Entry Price
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 0,
                  maxWidth: 120,
                }}>
                <Text style={{color: textColor, marginRight: 5, fontSize: 16}}>
                  ₹
                </Text>
                <TextInput
                  style={[styles.input, {color: textColor, width: '100%'}]}
                  placeholder="Entry Price"
                  placeholderTextColor={isDarkTheme ? '#888' : '#aaa'}
                  keyboardType="numeric"
                  value={price}
                  onChangeText={text => {
                    setPrice(text);
                    setError('');
                  }}
                />
              </View>
              {error && <Text style={styles.errorText}>{error}</Text>}
            </>
          )}
          {progress === 10 && (
            <>
              <ReviewChanges
                title={title}
                setTitle={setTitle}
                location={location}
                setLocation={setLocation}
                categories={categories}
                setCategories={setCategories}
                images={images}
                setImages={setImages}
                amenities={amenities}
                setAmenities={setAmenities}
                description={description}
                setDescription={setDescription}
                maxParticipants={maxParticipants}
                setMaxParticipants={setMaxParticipants}
                minAge={minAge}
                setMinAge={setMinAge}
                autoApproval={autoApproval}
                setAutoApproval={setAutoApproval}
                price={price}
                setPrice={setPrice}
                showDateTimePicker={showDateTimePicker}
                dateTime={dateTime}
                handleDateConfirm={handleDateConfirm}
                hideDateTimePicker={hideDateTimePicker}
                isDateTimePickerVisible={isDateTimePickerVisible}
                formatDate={formatDate}
              />
            </>
          )}
        </Animated.View>
      </View>
      {progress > 1 && (
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={30} color="#fff" />
        </TouchableOpacity>
      )}
      {progress < 10 && (
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}>
          <Ionicons name={'chevron-forward'} size={30} color={'#fff'} />
        </TouchableOpacity>
      )}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  createButton: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  progressLine: {
    flex: 1,
    height: 4,
    marginHorizontal: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    maxWidth: '100%',
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  descriptionInput: {
    maxWidth: '100%',
    width: 350,
    height: 200,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    textAlign: 'left',
    fontWeight: 'bold',
    borderWidth: 0.5,
    textAlignVertical: 'top',
    borderRadius: 8,
    borderColor: '#888',
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
  centeredContent: {
    marginTop: 180,
  },
  dateButton: {
    width: '100%',
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    bottom: 40,
    height: 60,
    width: 60,
    backgroundColor: '#7373FF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButton: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    height: 60,
    width: 60,
    padding: 15,
    borderRadius: 30,
    backgroundColor: '#7373FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontStyle: 'italic',
  },
  charCount: {
    textAlign: 'right',
    width: '80%',
    fontSize: 12,
    color: '#888',
  },
  datePicker: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
    flex: 1,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
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
  restrictionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensures the label stays on the left and controls on the right
  },
});

export default CreateScreen;
