import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
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
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  BackHandler,
} from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import DatePicker from 'react-native-date-picker';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {EventContext} from '../../../context/EventContext';
import DiscardChangesModal from '../../../components/shared/modals/DiscardChangesModal';
import CustomPlacesAutocomplete from '../../../components/shared/CustomPlacesAutocomplete';
import {primaryColor} from '../../../themes/basics';
// import SkeletonCategoryLoader from '../../../components/shared/skeletonLoaders/SkeletonCategoryLoader';
import ImageGrid from '../../../components/shared/ImageGrid';

const getNextClosest30Minutes = () => {
  const now = new Date();
  const minutes = now.getMinutes();
  const additionalMinutes = minutes % 30 === 0 ? 0 : 30 - (minutes % 30);
  now.setMinutes(minutes + additionalMinutes, 0, 0);
  return now;
};

const EditEventScreen = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { id, event: eventString } = useLocalSearchParams();
  const event = eventString ? JSON.parse(Array.isArray(eventString) ? eventString[0] : eventString) : null;

  const {
    loading,
    categories,
    setCategories,
    amenities,
    setAmenities,
    setFetchRequired,
    editEventWithImages,
    fetchAllEvents,
  } = useContext(EventContext);

  const getLocalDateFromUTC = utcDate => {
    const date = new Date(`${utcDate}Z`);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - userTimezoneOffset + 5.5 * 3600 * 1000);
  };

  const [title, setTitle] = useState(event?.title || '');
  const [address, setAddress] = useState(event?.address || '');
  const [date, setDate] = useState(event ? new Date(event.datetime) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(
    event ? getLocalDateFromUTC(event.datetime) : getNextClosest30Minutes()
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [autoApproval, setAutoApproval] = useState(event?.meta?.auto_approval ?? true);
  const [price, setPrice] = useState(event?.meta?.price?.toString() || '');
  const [description, setDescription] = useState(event?.description || '');
  const [newAmenity, setNewAmenity] = useState('');
  const [restrictionsExpanded, setRestrictionsExpanded] = useState(true);
  const [maxParticipants, setMaxParticipants] = useState(
    event?.meta?.restrictions?.max_participants?.toString() || ''
  );
  const [minAge, setMinAge] = useState(
    event?.meta?.restrictions?.min_age?.toString() || ''
  );
  const [images, setImages] = useState([]);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [errors, setErrors] = useState({});
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [area, setArea] = useState(event?.meta?.area || '');
  const [city, setCity] = useState(event?.location || '');
  const [initialAddress, setInitialAddress] = useState(event?.address || '');

  const isDarkTheme = colorScheme === 'dark';
  const backgroundColor = isDarkTheme ? '#121212' : '#fff';
  const textColor = isDarkTheme ? '#fff' : '#000';
  const defaultBorderColor = isDarkTheme ? '#333' : '#ccc';
  const borderColor = isDarkTheme ? '#333' : '#ccc';

  useEffect(() => {
    if (event?.meta?.images) {
        const initialImages = event.meta.images.map(img => ({
          uri: img.url,
          fileName: img.fileName,
          sequence: img.sequence,
        }));
        setImages(initialImages);
    }
  }, [event?.meta?.images]);

  useEffect(() => {
    if (event?.categories) {
        const updatedCategories = categories.map(cat => ({
          ...cat,
          selected: event.categories.some(ec => ec.id === cat.id),
        }));
        setCategories(updatedCategories);
    }
  }, [event?.categories?.length]);

  useEffect(() => {
    if (event?.amenities) {
        const updatedAmenities = amenities.map(cat => ({
          ...cat,
          selected: event.amenities.some(ec => ec.id === cat.id),
        }));
        setAmenities(updatedAmenities);
    }
  }, [event?.amenities?.length]);

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
    return () => setFetchRequired(false);
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
    const currentSelectedCount = categories.filter(cat => cat.selected).length;
    const updatedCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        if (!cat.selected && currentSelectedCount < 3) {
          return {...cat, selected: true};
        } else if (cat.selected) {
          return {...cat, selected: false};
        }
      }
      return cat;
    });
    setCategories(updatedCategories);
  };

  const handleSetImages = newImages => {
    setImages(newImages);
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

  const validateInputs = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Required';
    if (!description.trim()) newErrors.description = 'Required';
    if (!address.trim()) newErrors.address = 'Required';
    if (!price.trim()) newErrors.price = 'Required';
    if (!maxParticipants.trim()) newErrors.maxParticipants = 'Required';
    if (!minAge.trim()) newErrors.minAge = 'Required';

    const isCategorySelected = categories.some(cat => cat.selected);
    if (!isCategorySelected) newErrors.categories = 'At least 1 category must be selected';

    if (images.length === 0) newErrors.images = 'At least 1 image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const combineDateAndTime = (date, time) => {
    const combined = new Date(date);
    combined.setUTCHours(time.getUTCHours(), time.getUTCMinutes(), 0, 0);
    return combined;
  };

  const handleUpdateEvent = async () => {
    if (validateInputs()) {
      setIsLoading(true);
      try {
        const datetimeUTC = combineDateAndTime(date, startTime);
        const eventDetails = {
          id: event.id,
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
          categories: categories.filter(cat => cat.selected).map(cat => cat.id),
          amenities: amenities
            .filter(amenity => amenity.selected)
            .map(amenity => amenity.id),
        };

        await editEventWithImages(eventDetails, images);
        fetchAllEvents();
        router.back();
      } catch (error) {
        console.error('Error updating event:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoBack = useCallback(() => {
    // For simplicity, always ask if dirty or just go back
    router.back();
    return true;
  }, [router]);

  const dismissKeyboardAndDropdown = () => {
    Keyboard.dismiss();
    setIsDropdownVisible(false);
  };

  if (!event) return <View style={[styles.container, {backgroundColor}]}><Text style={{color: textColor}}>Loading...</Text></View>;

  return (
    <View style={[styles.container, {backgroundColor}]}>
      {/* Header */}
      <View style={[styles.header, {borderBottomColor: isDarkTheme ? '#333' : '#ddd'}]}>
        <TouchableOpacity onPress={handleGoBack}>
          <Ionicons name={'chevron-back'} size={20} color={primaryColor.main} />
        </TouchableOpacity>
        <View style={{flex: 3, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
          <Text style={[styles.headerTitle, {color: textColor}]}>Update Event</Text>
          <MaterialCommunityIcons name={'party-popper'} size={20} style={{marginLeft: 10}} color={primaryColor.main} />
        </View>
      </View>

      <TouchableWithoutFeedback onPress={dismissKeyboardAndDropdown}>
        <ScrollView contentContainerStyle={styles.content} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
          <Text style={[styles.label, {color: textColor}]}>Title of Event</Text>
          <TextInput
            style={[styles.input, {borderColor: errors.title ? 'red' : defaultBorderColor, color: textColor}]}
            placeholder="Enter title"
            placeholderTextColor={isDarkTheme ? '#888' : '#aaa'}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={[styles.label, {color: textColor}]}>Address</Text>
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

          <Text style={[styles.label, {color: textColor}]}>Category</Text>
          <View style={styles.chipContainer}>
             {categories.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.chip, {backgroundColor: cat.selected ? primaryColor.main : (isDarkTheme ? '#333' : '#ddd')}]}
                  onPress={() => toggleCategory(cat.id)}>
                  <Text style={{color: cat.selected ? '#fff' : textColor, fontWeight: 'bold'}}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, {color: textColor}]}>Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.inputRow, {backgroundColor: isDarkTheme ? '#333' : '#ddd'}]}>
              <Ionicons name="calendar-outline" size={20} color={textColor} style={{marginRight: 5}} />
              <Text style={{color: textColor}}>{date.toDateString()}</Text>
            </TouchableOpacity>
            <DatePicker
              modal
              open={showDatePicker}
              date={date}
              mode="date"
              onConfirm={(d) => { setShowDatePicker(false); setDate(d); }}
              onCancel={() => setShowDatePicker(false)}
            />
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, {color: textColor}]}>Start Time</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={[styles.inputRow, {backgroundColor: isDarkTheme ? '#333' : '#ddd'}]}>
              <Ionicons name="time-outline" size={20} color={textColor} style={{marginRight: 5}} />
              <Text style={{color: textColor}}>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
            <DatePicker
              modal
              open={showTimePicker}
              date={startTime}
              mode="time"
              onConfirm={(t) => { setShowTimePicker(false); setStartTime(t); }}
              onCancel={() => setShowTimePicker(false)}
            />
          </View>

          <View style={[styles.row, {justifyContent: 'space-between'}]}>
            <Text style={[styles.label, {color: textColor}]}>Invitation Only</Text>
            <Switch value={autoApproval} onValueChange={setAutoApproval} trackColor={{false: '#ccc', true: primaryColor.main}} />
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, {color: textColor}]}>Price Per Person</Text>
            <View style={[styles.inputRowPrice, {borderColor: errors.price ? 'red' : defaultBorderColor}]}>
              <Text style={{color: textColor, marginRight: 5}}>₹</Text>
              <TextInput style={{flex: 1, color: textColor}} keyboardType="numeric" value={price} onChangeText={setPrice} />
            </View>
          </View>

          <TouchableOpacity style={[styles.restrictionToggle, {borderColor}]} onPress={toggleRestrictions}>
            <Text style={[styles.label, {color: textColor}]}>Restrictions</Text>
            <Ionicons name={restrictionsExpanded ? 'chevron-down' : 'chevron-forward'} size={20} color={textColor} />
          </TouchableOpacity>

          {restrictionsExpanded && (
            <View style={styles.restrictionContent}>
               <View style={styles.row}>
                  <Text style={[styles.label, {color: textColor}]}>Max. Participants</Text>
                  <View style={styles.counterContainer}>
                    <TouchableOpacity onPress={decrementValue(setMaxParticipants)}><Ionicons name="remove-circle-outline" size={20} color={primaryColor.main} /></TouchableOpacity>
                    <TextInput style={[styles.counterInput, {borderColor: defaultBorderColor, color: textColor}]} value={maxParticipants} onChangeText={setMaxParticipants} keyboardType="numeric" />
                    <TouchableOpacity onPress={incrementValue(setMaxParticipants)}><Ionicons name="add-circle-outline" size={20} color={primaryColor.main} /></TouchableOpacity>
                  </View>
               </View>
               <View style={styles.row}>
                  <Text style={[styles.label, {color: textColor}]}>Min. Age</Text>
                  <View style={styles.counterContainer}>
                    <TouchableOpacity onPress={decrementValue(setMinAge)}><Ionicons name="remove-circle-outline" size={20} color={primaryColor.main} /></TouchableOpacity>
                    <TextInput style={[styles.counterInput, {borderColor: defaultBorderColor, color: textColor}]} value={minAge} onChangeText={setMinAge} keyboardType="numeric" />
                    <TouchableOpacity onPress={incrementValue(setMinAge)}><Ionicons name="add-circle-outline" size={20} color={primaryColor.main} /></TouchableOpacity>
                  </View>
               </View>
            </View>
          )}

          <Text style={[styles.label, {color: textColor}]}>Description</Text>
          <TextInput
            style={[styles.input, {height: 100, borderColor: errors.description ? 'red' : defaultBorderColor, textAlignVertical: 'top'}]}
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={[styles.label, {color: textColor}]}>Basic Amenities</Text>
          <FlatList
            data={amenities}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            renderItem={({item}) => (
              <TouchableOpacity style={styles.checkboxContainer} onPress={() => toggleAmenity(item.id)}>
                <Ionicons name={item.selected ? 'checkbox-outline' : 'square-outline'} size={20} color={textColor} />
                <Text style={{color: textColor, marginLeft: 8}}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />

          <Text style={[styles.label, {color: textColor}]}>Images</Text>
          <GestureHandlerRootView style={{height: 200}}>
             <ImageGrid images={images} setImages={handleSetImages} />
          </GestureHandlerRootView>

        </ScrollView>
      </TouchableWithoutFeedback>

      <View style={[styles.footer, {backgroundColor, borderTopColor: isDarkTheme ? '#333' : '#ddd'}]}>
        {isLoading ? (
          <ActivityIndicator size="small" color={primaryColor.main} />
        ) : (
          <TouchableOpacity style={styles.footerCreateButton} onPress={handleUpdateEvent}>
            <Text style={styles.createButtonText}>Update</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20, paddingBottom: 100 },
  label: { fontSize: 16, marginVertical: 8, fontWeight: 'bold' },
  input: { borderWidth: 1, borderRadius: 4, padding: 12, marginBottom: 16 },
  addressContainer: { marginBottom: 10 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, margin: 4 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, justifyContent: 'space-between' },
  inputRow: { flex: 1, maxWidth: 170, flexDirection: 'row', alignItems: 'center', borderRadius: 4, paddingHorizontal: 12, paddingVertical: 8, marginLeft: 20 },
  inputRowPrice: { flex: 1, maxWidth: 150, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 4, paddingHorizontal: 12, marginLeft: 20 },
  restrictionToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  restrictionContent: { paddingHorizontal: 16 },
  counterContainer: { flexDirection: 'row', alignItems: 'center' },
  counterButton: { marginHorizontal: 8 },
  counterInput: { borderWidth: 1, borderRadius: 4, textAlign: 'center', paddingHorizontal: 8, width: 50 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  footer: { padding: 10, borderTopWidth: 1 },
  footerCreateButton: { height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: primaryColor.main },
  createButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default EditEventScreen;
