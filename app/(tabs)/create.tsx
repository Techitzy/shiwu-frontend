import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, {
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import {
  ActivityIndicator,
  Animated,
  BackHandler,
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomPlacesAutocomplete from '../../components/shared/CustomPlacesAutocomplete';
import ImageGrid from '../../components/shared/ImageGrid';
import DiscardChangesModal from '../../components/shared/modals/DiscardChangesModal';
import { EventContext } from '../../context/EventContext';
import { primaryColor } from '../../themes/basics';
// import SkeletonCategoryLoader from '../../components/shared/skeletonLoaders/SkeletonCategoryLoader';

const getNextClosest30Minutes = () => {
  const now = new Date();
  const minutes = now.getMinutes();
  const additionalMinutes = minutes % 30 === 0 ? 0 : 30 - (minutes % 30);
  now.setMinutes(minutes + additionalMinutes, 0, 0);
  return now;
};

const CreateEventScreen = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const {
    loading,
    categories,
    setCategories,
    amenities,
    setAmenities,
    setFetchRequired,
    createEventWithImages,
    fetchAllEvents,
  } = useContext(EventContext);
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(getNextClosest30Minutes());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [autoApproval, setAutoApproval] = useState(true);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [restrictionsExpanded, setRestrictionsExpanded] = useState(true);
  const [maxParticipants, setMaxParticipants] = useState('');
  const [minAge, setMinAge] = useState('');
  const [images, setImages] = useState([]);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [errors, setErrors] = useState({
    title: '',
    address: '',
    categories: '',
    price: '',
    maxParticipants: '',
    minAge: '',
    description: '',
    images: '',
  });
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');

  const isDarkTheme = colorScheme === 'dark';
  const backgroundColor = isDarkTheme ? '#121212' : '#fff';
  const textColor = isDarkTheme ? '#fff' : '#000';
  const defaultBorderColor = isDarkTheme ? '#333' : '#ccc';
  const borderColor = isDarkTheme ? '#333' : '#ccc';

  const validateDate = selectedDate => {
    const currentDate = new Date();
    if (selectedDate.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0)) {
      setDateError('Date cannot be in the past');
      return false;
    }
    setDateError('');
    return true;
  };

  const validateTime = selectedTime => {
    const currentDateTime = new Date();
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const currentDateOnly = new Date(currentDateTime);
    currentDateOnly.setHours(0, 0, 0, 0);

    if (
      selectedDate.getTime() === currentDateOnly.getTime() &&
      selectedTime.getTime() <= currentDateTime.getTime()
    ) {
      setTimeError('Time cannot be in the past');
      return false;
    }

    setTimeError('');
    return true;
  };

  const [animationHeight] = useState(new Animated.Value(0));

  useEffect(() => {
    setFetchRequired(true);

    return () => {
      setFetchRequired(false);
    };
  }, []);

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

  const toggleCategory = categoryId => {
    if (!categories || !Array.isArray(categories)) return;
    
    const currentSelectedCount = categories.filter(cat => cat.selected).length;

    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        if (!cat.selected && currentSelectedCount < 3) {
          return { ...cat, selected: true };
        } else if (cat.selected) {
          return { ...cat, selected: false };
        }
      }
      return cat;
    });

    setCategories(updatedCategories);

    const isCategorySelected = updatedCategories.some(cat => cat.selected);
    if (isCategorySelected) {
      setErrors(prevErrors => {
        const { categories, ...rest } = prevErrors;
        return rest;
      });
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        categories: 'At least 1 category must be selected',
      }));
    }
  };

  const handleSetImages = newImages => {
    setImages(newImages);

    // Revalidate the images dynamically
    if (newImages.length > 0) {
      setErrors(prevErrors => {
        const { images, ...rest } = prevErrors;
        return rest;
      });
    } else {
      setErrors(prevErrors => ({
        ...prevErrors,
        images: 'At least 1 image is required',
      }));
    }
  };

  const toggleAmenity = id => {
    if (!amenities || !Array.isArray(amenities)) return;
    
    setAmenities(prev =>
      prev.map(amenity =>
        amenity.id === id ? { ...amenity, selected: !amenity.selected } : amenity,
      ),
    );
  };

  const addAmenity = () => {
    if (!amenities || !Array.isArray(amenities)) return;
    
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

  const validateInputs = () => {
    const newErrors = { ...errors };
    if (!title.trim()) {
      newErrors.title = 'Required';
    } else {
      delete newErrors.title;
    }

    if (!description.trim()) {
      newErrors.description = 'Required';
    } else {
      delete newErrors.description;
    }

    if (!address.trim()) {
      newErrors.address = 'Required';
    } else {
      delete newErrors.address;
    }

    if (!price.trim()) {
      newErrors.price = 'Required';
    } else {
      delete newErrors.price;
    }

    if (!maxParticipants.trim()) {
      newErrors.maxParticipants = 'Required';
    } else {
      delete newErrors.maxParticipants;
    }

    if (!minAge.trim()) {
      newErrors.minAge = 'Required';
    } else {
      delete newErrors.minAge;
    }

    const isCategorySelected = categories && Array.isArray(categories) && categories.some(cat => cat.selected);
    if (!isCategorySelected) {
      newErrors.categories = 'At least 1 category must be selected';
    } else {
      delete newErrors.categories;
    }

    if (images.length === 0) {
      newErrors.images = 'At least 1 image is required';
    } else {
      delete newErrors.images;
    }

    const isDateValid = validateDate(date);
    const isTimeValid = validateTime(new Date(startTime));

    if (!isDateValid) {
      newErrors.date = 'Date cannot be in the past';
    } else {
      delete newErrors.date;
    }

    if (!isTimeValid) {
      newErrors.time = 'Time cannot be in the past';
    } else {
      delete newErrors.time;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const combineDateAndTime = (date, time) => {
    const combined = new Date(date);
    combined.setHours(time.getHours());
    combined.setMinutes(time.getMinutes());
    combined.setSeconds(0);
    combined.setMilliseconds(0);
    return combined;
  };

  const datetimeUTC = combineDateAndTime(date, startTime);

  const handleCreateEvent = async () => {
    if (validateInputs()) {
      setIsLoading(true);
      try {
        const eventDetails = {
          title,
          address,
          description,
          datetime: datetimeUTC.toISOString(),
          banner_img: '',
          number_of_attendees: Number(maxParticipants),
          meta: {
            area: area,
            auto_approval: autoApproval,
            price: price,
            restrictions: {
              max_participants: maxParticipants,
              min_age: minAge,
            },
          },
          location: city,
          categories: categories && Array.isArray(categories) ? categories.filter(cat => cat.selected).map(cat => cat.id) : [],
          amenities: amenities && Array.isArray(amenities)
            ? amenities.filter(amenity => amenity.selected).map(amenity => amenity.id)
            : [],
        };

        const response = await createEventWithImages(eventDetails, images);
        console.log('Event created successfully:', response);
        fetchAllEvents();
        router.back();
      } catch (error) {
        console.error('Error creating event:', error);
      } finally {
        setIsLoading(false); // Hide loader
      }
    }
  };

  const isFormDirty = () => {
    if (!categories || !Array.isArray(categories) || !amenities || !Array.isArray(amenities)) {
      return false;
    }
    
    const initialCategories = categories.map(cat => ({
      id: cat.id,
      selected: cat.selected,
    }));
    const categoryChanged = categories.some(
      (cat, index) => cat.selected !== initialCategories[index].selected,
    );

    const initialAmenities = amenities.map(cat => ({
      id: cat.id,
      selected: cat.selected,
    }));
    const amenitiesChanged = amenities.some(
      (cat, index) => cat.selected !== initialAmenities[index].selected,
    );
    return (
      title !== '' ||
      address !== '' ||
      categoryChanged ||
      autoApproval !== true ||
      price !== '' ||
      description !== '' ||
      newAmenity !== '' ||
      restrictionsExpanded !== true ||
      maxParticipants !== '' ||
      minAge !== '' ||
      amenitiesChanged ||
      images.length > 0
    );
  };

  const handleGoBack = useCallback(() => {
    if (isFormDirty()) {
      setShowPopup(true);
    } else {
      router.back();
    }
    return true;
  }, [isFormDirty]);

  const handleDiscardChanges = () => {
    setTitle('');
    setAddress('');
    setDate(new Date());
    setStartTime(getNextClosest30Minutes());
    setAutoApproval(true);
    setPrice('');
    setDescription('');
    setNewAmenity('');
    setRestrictionsExpanded(true);
    setMaxParticipants('');
    setMinAge('');
    setImages([]);

    if (categories && Array.isArray(categories)) {
      const resetCategories = categories.map(cat => ({ ...cat, selected: false }));
      setCategories(resetCategories);
    }

    if (amenities && Array.isArray(amenities)) {
      const resetAmenities = amenities.map(amenity => ({
        ...amenity,
        selected: false,
      }));
      setAmenities(resetAmenities);
    }

    setShowPopup(false);

    router.back();
  };

  const handleKeepEditing = () => {
    setShowPopup(false);
  };

  const dismissKeyboardAndDropdown = () => {
    Keyboard.dismiss();
    setIsDropdownVisible(false);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleGoBack,
    );
    return () => backHandler.remove();
  }, [handleGoBack]);

  return (
    <SafeAreaView style={[{ flex: 1 }, { backgroundColor }]}>
      <View style={[styles.container, { backgroundColor }]}>
        {/* Header */}
        <View
          style={[
            styles.header,
            { borderBottomColor: isDarkTheme ? '#333' : '#ddd' },
          ]}>
          <TouchableOpacity onPress={handleGoBack}>
            <Ionicons name={'chevron-back'} size={20} color={primaryColor.main} />
          </TouchableOpacity>
          <View
            style={{
              flex: 3,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            {/* Center section */}
            <Text style={[styles.headerTitle, { color: textColor }]}>
              Create Event
            </Text>
            <MaterialCommunityIcons
              name={'party-popper'}
              size={20}
              style={{ marginLeft: 10 }}
              color={primaryColor.main}
            />
          </View>
        </View>
        <DiscardChangesModal
          isVisible={showPopup}
          onClose={() => setShowPopup(false)}
          onDiscard={handleDiscardChanges}
          onKeepEditing={handleKeepEditing}
        />

        <TouchableWithoutFeedback onPress={dismissKeyboardAndDropdown}>
          <ScrollView
            contentContainerStyle={styles.content}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled">
            {/* Title */}
            <Text style={[styles.label, { color: textColor }]}>Title of Event</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: errors.title ? 'red' : defaultBorderColor,
                  color: textColor,
                },
              ]}
              placeholder="Enter title"
              placeholderTextColor={isDarkTheme ? '#aaa' : '#666'}
              value={title}
              onChangeText={text => {
                setTitle(text);
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
            />
            {errors.title ? (
              <Text style={styles.errorText}>*{errors.title}</Text>
            ) : null}

            {/* Address */}
            <Text style={[styles.label, { color: textColor }]}>Address</Text>
            <View style={styles.addressContainer}>
              <CustomPlacesAutocomplete
                isDarkTheme={isDarkTheme}
                address={address}
                setAddress={setAddress}
                errors={errors}
                setErrors={setErrors}
                isDropdownVisible={isDropdownVisible}
                setIsDropdownVisible={setIsDropdownVisible}
                setArea={setArea}
                setCity={setCity}
              />
            </View>
            {errors.address ? (
              <Text style={styles.errorText}>*{errors.address}</Text>
            ) : null}

            {/* Category */}
            <Text style={[styles.label, { color: textColor }]}>Category</Text>
            <View style={styles.iconContainer}>
              <Ionicons
                name="information-circle-outline"
                size={14}
                color={textColor}
              />
              <Text style={[styles.informationText, { color: textColor }]}>
                Select up to 3 categories
              </Text>
            </View>

            <View style={styles.chipContainer}>
              {showAllCategories ? (
                categories && Array.isArray(categories) ? categories.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: cat.selected
                          ? primaryColor.main
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
                )) : null
              ) : loading ? (
                // <SkeletonCategoryLoader theme={colorScheme} />
                <></>
              ) : (
                categories && Array.isArray(categories) ? categories.slice(0, 10).map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: cat.selected
                          ? primaryColor.main
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
                )) : null
              )}
              {!loading && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    marginTop: 10,
                    marginLeft: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => setShowAllCategories(prev => !prev)}>
                    <Text
                      style={[styles.createButton, { color: primaryColor.main }]}>
                      {showAllCategories ? 'Show Less' : 'Show More'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {errors.categories ? (
              <Text style={styles.errorText}>*{errors.categories}</Text>
            ) : null}

            {/* Date */}
            <View style={styles.row}>
              <Text style={[styles.label, { color: textColor }]}>Date</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={[
                  styles.inputRow,
                  { backgroundColor: isDarkTheme ? '#333' : '#ddd' },
                ]}>
                <Ionicons
                  name="calendar-outline"
                  style={{ marginRight: 5 }}
                  size={20}
                  color={textColor}
                />
                <Text style={{ color: textColor }}>
                  {date ? date.toDateString() : 'Select Date'}
                </Text>
              </TouchableOpacity>
              <DatePicker
                modal
                open={showDatePicker}
                date={date}
                mode="date"
                onConfirm={selectedDate => {
                  setShowDatePicker(false);
                  if (validateDate(selectedDate)) {
                    const combinedDateTime = combineDateAndTime(
                      selectedDate,
                      startTime,
                    );
                    setDate(combinedDateTime);
                  }
                }}
                onCancel={() => setShowDatePicker(false)}
              />
            </View>
            {dateError ? (
              <Text style={styles.dateTimeErrorText}>*{dateError}</Text>
            ) : null}

            {/* Start Time */}
            <View style={styles.row}>
              <Text style={[styles.label, { color: textColor }]}>Start Time</Text>
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                style={[
                  styles.inputRow,
                  { backgroundColor: isDarkTheme ? '#333' : '#ddd' },
                ]}>
                <Ionicons
                  name="time-outline"
                  style={{ marginRight: 5 }}
                  size={20}
                  color={textColor}
                />
                <Text style={{ color: textColor }}>
                  {startTime
                    ? startTime.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                    : 'Select Start Time'}
                </Text>
              </TouchableOpacity>
              <DatePicker
                modal
                open={showTimePicker}
                date={startTime}
                mode="time"
                onConfirm={selectedTime => {
                  setShowTimePicker(false);
                  if (validateTime(selectedTime)) {
                    const combinedDateTime = combineDateAndTime(
                      date,
                      selectedTime,
                    );
                    setStartTime(combinedDateTime);
                  }
                }}
                onCancel={() => setShowTimePicker(false)}
              />
            </View>
            {timeError ? (
              <Text style={styles.errorText}>*{timeError}</Text>
            ) : null}

            {/* Auto Approval */}
            <View style={[styles.row, { justifyContent: 'space-between' }]}>
              <Text style={[styles.label, { color: textColor }]}>
                Invitation Only
              </Text>
              <Switch
                value={autoApproval}
                onValueChange={setAutoApproval}
                trackColor={{ false: '#ccc', true: primaryColor.main }}
              />
            </View>

            {/* Price Per Person */}
            <View style={styles.row}>
              <Text style={[styles.label, { color: textColor }]}>
                Price Per Person
              </Text>
              <View
                style={[
                  styles.inputRowPrice,
                  { borderColor: errors.price ? 'red' : defaultBorderColor },
                ]}>
                <Text style={{ color: textColor, marginRight: 5 }}>₹</Text>
                <TextInput
                  style={{ flex: 1, color: textColor }}
                  placeholder="Enter price"
                  placeholderTextColor={isDarkTheme ? '#aaa' : '#666'}
                  keyboardType="numeric"
                  value={price}
                  onChangeText={text => {
                    setPrice(text);
                    if (errors.price) setErrors({ ...errors, price: '' });
                  }}
                />
              </View>
            </View>
            {errors.price ? (
              <Text style={styles.errorText}>*{errors.price}</Text>
            ) : null}

            <TouchableOpacity
              style={[styles.restrictionToggle, { borderColor }]}
              onPress={toggleRestrictions}>
              <Text style={[styles.label, { color: textColor }]}>Restrictions</Text>
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
                { height: restrictionsExpanded ? null : 0, overflow: 'hidden' },
              ]}>
              {restrictionsExpanded && (
                <>
                  {/* Max Participants */}
                  <View style={[styles.row, styles.restrictionRow]}>
                    <Text style={[styles.label, { color: textColor }]}>
                      Max. Participants
                    </Text>
                    <View style={styles.counterContainer}>
                      <TouchableOpacity
                        onPress={decrementValue(setMaxParticipants)}
                        style={styles.counterButton}>
                        <Ionicons
                          name="remove-circle-outline"
                          size={20}
                          color={primaryColor.main}
                        />
                      </TouchableOpacity>
                      <TextInput
                        style={[
                          styles.counterInput,
                          {
                            borderColor: errors.maxParticipants
                              ? 'red'
                              : defaultBorderColor,
                            color: textColor,
                          },
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
                          color={primaryColor.main}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {errors.maxParticipants ? (
                    <Text style={styles.errorText}>
                      *{errors.maxParticipants}
                    </Text>
                  ) : null}

                  {/* Min Age */}
                  <View style={[styles.row, styles.restrictionRow]}>
                    <Text style={[styles.label, { color: textColor }]}>
                      Min. Age
                    </Text>
                    <View style={styles.counterContainer}>
                      <TouchableOpacity
                        onPress={decrementValue(setMinAge)}
                        style={styles.counterButton}>
                        <Ionicons
                          name="remove-circle-outline"
                          size={20}
                          color={primaryColor.main}
                        />
                      </TouchableOpacity>
                      <TextInput
                        style={[
                          styles.counterInput,
                          {
                            borderColor: errors.minAge
                              ? 'red'
                              : defaultBorderColor,
                            color: textColor,
                          },
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
                          color={primaryColor.main}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {errors.minAge ? (
                    <Text style={styles.errorText}>*{errors.minAge}</Text>
                  ) : null}
                </>
              )}
            </Animated.View>

            {/* Description */}
            <Text style={[styles.label, { color: textColor }]}>Description</Text>
            <TextInput
              style={[
                styles.input,
                {
                  height: 100,
                  borderColor: errors.description ? 'red' : defaultBorderColor,
                  textAlignVertical: 'top',
                },
              ]}
              placeholder="Enter description"
              placeholderTextColor={isDarkTheme ? '#aaa' : '#666'}
              value={description}
              onChangeText={text => {
                setDescription(text);
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              multiline
            />
            {errors.description ? (
              <Text style={styles.errorText}>*{errors.description}</Text>
            ) : null}

            {/* Basic Amenities */}
            <Text style={[styles.label, { color: textColor }]}>
              Basic Amenities
            </Text>

            {showAllAmenities ? (
              <FlatList
                data={amenities && Array.isArray(amenities) ? amenities : []}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => toggleAmenity(item.id)}>
                    <Ionicons
                      name={item.selected ? 'checkbox-outline' : 'square-outline'}
                      size={20}
                      color={textColor}
                    />
                    <Text style={{ color: textColor, marginLeft: 8 }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <FlatList
                data={amenities && Array.isArray(amenities) ? amenities.slice(0, 10) : []} // Show only the first 10 items
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => toggleAmenity(item.id)}>
                    <Ionicons
                      name={item.selected ? 'checkbox-outline' : 'square-outline'}
                      size={20}
                      color={textColor}
                    />
                    <Text style={{ color: textColor, marginLeft: 8 }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}

            {showAllAmenities && (
              <View style={styles.newAmenityContainer}>
                <TextInput
                  style={[styles.input, { borderColor, color: textColor }]}
                  placeholder="Add a new amenity"
                  placeholderTextColor={isDarkTheme ? '#aaa' : '#666'}
                  value={newAmenity}
                  onChangeText={setNewAmenity}
                />
                <TouchableOpacity
                  onPress={addAmenity}
                  style={styles.addButton}>
                  <Ionicons
                    name="add-circle-outline"
                    size={30}
                    color={primaryColor.main}
                  />
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={{ marginBottom: 10 }}
              onPress={() => setShowAllAmenities(prev => !prev)}>
              <Text style={[styles.createButton, { color: primaryColor.main }]}>
                {showAllAmenities ? 'Show Less' : 'Show More'}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.label, { color: textColor }]}>
              Add Images for your event
            </Text>
            <View style={styles.iconContainer}>
              <Ionicons
                name="information-circle-outline"
                size={14}
                color={textColor}
              />
              <Text style={[styles.informationText, { color: textColor }]}>
                The first image will be set as the banner
              </Text>
            </View>
            <GestureHandlerRootView style={styles.container}>
              <ImageGrid images={images} setImages={handleSetImages} />
            </GestureHandlerRootView>
            {errors.images ? (
              <Text style={styles.errorText}>*{errors.images}</Text>
            ) : null}

            <View
              style={[
                styles.footerContainer,
                { backgroundColor: isDarkTheme ? '#333' : '#f5f5f5' },
              ]}>
              <Text style={[styles.title, { color: textColor }]}>
                PLEASE READ BEFORE CREATING AN EVENT:
              </Text>
              <View style={styles.pointsContainer}>
                {/* <Text style={[styles.point, {color: textColor}]}>
                1. We will take 15% of the ticket amount as commission.
              </Text> */}
                <Text style={[styles.point, { color: textColor }]}>
                  1. Money will be transferred to the host upon successful
                  completion of the event.
                </Text>
                <Text style={[styles.point, { color: textColor }]}>
                  2. Cancellations within 24 hours of the event will not be
                  refundable.
                </Text>
                <Text style={[styles.point, { color: textColor }]}>
                  3. Any disputes will be handled according to our policy.
                </Text>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
        <View
          style={[
            styles.footer,
            { backgroundColor, borderTopColor: isDarkTheme ? '#333' : '#ddd' },
          ]}>
          {isLoading ? (
            <ActivityIndicator
              style={styles.footerLoadingButton}
              size="small"
              color="#fff"
            />
          ) : (
            <TouchableOpacity
              style={styles.footerCreateButton}
              onPress={handleCreateEvent}>
              <Text style={[styles.createButtonText]}>Publish</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView >
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
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  footer: {
    padding: 10,
    borderTopWidth: 1,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  footerLoadingButton: {
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: primaryColor.main,
    shadowColor: '#7373FF',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  footerCreateButton: {
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: primaryColor.main,
    shadowColor: '#7373FF',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  createButtonText: {
    color: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    borderRadius: 4,
    fontSize: 16,
    fontWeight: 'bold',
  },
  createButton: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateTimeErrorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  content: {
    paddingBottom: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
    fontWeight: 'bold',
  },
  informationText: {
    fontSize: 12,
    marginBottom: 2,
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
  footerContainer: {
    marginVertical: 14,
    marginBottom: 50,
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pointsContainer: {
    marginTop: 8,
  },
  point: {
    marginBottom: 4,
  },
});

export default CreateEventScreen;
