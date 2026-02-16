import React, {useState, useContext, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {useColorScheme} from 'react-native';
import {UserContext} from '../../context/UserContext';
import {lightColors, darkColors, primaryColor} from '../../themes/basics';

const SelectLocationScreen = () => {
  const { location: locationParam } = useLocalSearchParams();
  const location = Array.isArray(locationParam) ? locationParam[0] : locationParam || 'Select Location';

  const router = useRouter();
  const {setTheme, updateUserLocation} = useContext(UserContext);
  const {logout} = useContext(UserContext);
  const colorScheme = useColorScheme();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedCity, setSelectedCity] = useState(location); // Single city selection
  const [selectedTheme, setSelectedTheme] = useState(
    colorScheme === 'dark' ? 'Dark' : 'Light',
  );
  const [searchText, setSearchText] = useState('');

  const scrollViewRef = useRef(null);
  const popularCities = [
    'Mumbai',
    'Delhi',
    'Bengaluru',
    'Hyderabad',
    'Chandigarh',
    'Ahmedabad',
    'Chennai',
    'Pune',
    'Kolkata',
    'Kochi',
  ];
  const allCities = [
    'Agra',
    'Ahmedabad',
    'Bangalore',
    'Bhopal',
    'Chandigarh',
    'Chennai',
    'Delhi',
    'Hyderabad',
    'Jaipur',
    'Kolkata',
    'Lucknow',
    'Mumbai',
    'Nagpur',
    'Pune',
    'Surat',
    'Vadodara',
    'Visakhapatnam',
  ];

  const cityImages = {
    mumbai: require('../../public/images/popularCities/mumbai.png'),
    delhi: require('../../public/images/popularCities/delhi.png'),
    bengaluru: require('../../public/images/popularCities/bengaluru.png'),
    hyderabad: require('../../public/images/popularCities/hyderabad.png'),
    chandigarh: require('../../public/images/popularCities/chandigarh.png'),
    ahmedabad: require('../../public/images/popularCities/ahmedabad.png'),
    chennai: require('../../public/images/popularCities/chennai.png'),
    pune: require('../../public/images/popularCities/pune.png'),
    kolkata: require('../../public/images/popularCities/kolkata.png'),
    kochi: require('../../public/images/popularCities/kochi.png'),
  };

  const isDarkTheme = colorScheme === 'dark';
  const backgroundColor = isDarkTheme
    ? darkColors.backgroundColor
    : lightColors.backgroundColor;
  const textColor = isDarkTheme ? darkColors.textColor : lightColors.textColor;
  const inputBackground = isDarkTheme
    ? darkColors.inputBackground
    : lightColors.inputBackground;
  const borderBottomColor = isDarkTheme
    ? darkColors.borderBottomColor
    : lightColors.borderBottomColor;

  const filteredPopularCities = popularCities.filter(city =>
    city.toLowerCase().includes(searchText.toLowerCase()),
  );
  const filteredOtherCities = allCities.filter(city =>
    city.toLowerCase().includes(searchText.toLowerCase()),
  );

  const noResults =
    filteredPopularCities.length === 0 && filteredOtherCities.length === 0;

  const handleScroll = event => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    setShowBackToTop(currentOffset > 200);
  };

  const handleCitySelection = async city => {
    try {
      setSelectedCity(city);
      await updateUserLocation(city);

      // Navigate back after success
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update location. Please try again.');
      console.error(error);
    }
  };

  const handleBackToTop = () => {
    scrollViewRef.current?.scrollTo({y: 0, animated: true});
  };

  console.log('selected City', selectedCity);

  return (
    <View style={[styles.container, {backgroundColor}]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={26} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: textColor}]}>{location}</Text>
      </View>

      <View
        style={{
          paddingHorizontal: 16,
          backgroundColor: inputBackground,
          paddingBottom: 10,
        }}>
        {/* Search Bar */}
        <View style={[styles.searchBar, {backgroundColor: inputBackground}]}>
          <MaterialIcons name="search" size={20} color={textColor} />
          <TextInput
            style={[styles.searchInput, {color: textColor}]}
            placeholder="Search for your city"
            placeholderTextColor={isDarkTheme ? '#aaa' : '#888'}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close" size={20} color={textColor} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* {showBackToTop && (
        <TouchableOpacity
          style={[styles.backToTopButton, {backgroundColor: 'transparent'}]}
          onPress={handleBackToTop}>
          <Text style={styles.backToTopText}>Back to Top</Text>
        </TouchableOpacity>
      )} */}

      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {noResults ? (
          <Text style={[styles.noResults, {color: textColor}]}>
            We could not find any results. Please try searching some other
            terms.
          </Text>
        ) : (
          <>
            {/* Auto Detect Location */}
            <View
              style={{paddingHorizontal: 16, backgroundColor: inputBackground}}>
              <View style={styles.autoDetectContainer}>
                <Ionicons
                  name="locate-outline"
                  size={20}
                  color={primaryColor.main}
                />
                <Text
                  style={[styles.autoDetectText, {color: primaryColor.main}]}>
                  Auto Detect My Location
                </Text>
              </View>
            </View>

            {/* Popular Cities */}
            {filteredPopularCities.length > 0 && (
              <>
                <Text
                  style={[
                    styles.sectionTitle,
                    {color: textColor, paddingHorizontal: 16},
                  ]}>
                  POPULAR CITIES
                </Text>
                <FlatList
                  data={filteredPopularCities}
                  numColumns={4}
                  keyExtractor={(item, index) => item + index}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={[
                        styles.cityItem,
                        {
                          backgroundColor: inputBackground,
                          borderColor: borderBottomColor,
                        },
                      ]}
                      onPress={() => handleCitySelection(item)}>
                      {item ? (
                        <>
                          <Image
                            source={cityImages[item.toLowerCase()]}
                            style={styles.cityImage}
                          />
                          <View style={styles.cityTextContainer}>
                            <Text style={[styles.cityName, {color: textColor}]}>
                              {item}
                            </Text>
                            {selectedCity === item ? (
                              <Octicons
                                name="dot-fill"
                                color={primaryColor.main}
                                size={14}
                                style={styles.dot}
                              />
                            ) : null}
                          </View>
                        </>
                      ) : null}
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.cityGrid}
                />
              </>
            )}
            {filteredOtherCities.length > 0 && (
              <>
                <Text
                  style={[
                    styles.sectionTitle,
                    {color: textColor, paddingHorizontal: 16, marginBottom: 10},
                  ]}>
                  OTHER CITIES
                </Text>
                <FlatList
                  data={filteredOtherCities.sort((a, b) => a.localeCompare(b))} // Sort alphabetically
                  keyExtractor={(item, index) => item + index}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={[
                        styles.otherCityItem,
                        {
                          backgroundColor: inputBackground,
                          borderColor: borderBottomColor,
                        },
                      ]}
                      onPress={() => handleCitySelection(item)}>
                      <Text
                        style={[
                          styles.cityName,
                          {color: textColor, paddingHorizontal: 8},
                        ]}>
                        {item}
                      </Text>
                      {selectedCity === item && (
                        <Octicons
                          name="dot-fill"
                          color={primaryColor.main}
                          size={14}
                          style={[styles.dot, {marginLeft: 'auto'}]}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.cityList}
                />
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 20,
  },
  searchBar: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  autoDetectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  autoDetectText: {
    fontSize: 16,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '400',
    marginTop: 20,
  },
  cityGrid: {
    marginTop: 10,
    justifyContent: 'space-between',
  },
  cityItem: {
    height: 110,
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderWidth: 0.2,
  },
  cityImage: {
    width: 50,
    height: 50,
    margin: 8,
  },
  cityName: {
    fontSize: 14,
  },
  cityTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  dot: {
    marginLeft: 4,
  },
  otherCityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  cityList: {
    marginBottom: 20,
  },
  noResults: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  backToTopButton: {
    // position: 'absolute',
    // left: '50%',
    // top: '100%',
    // transform: [{translateX: -50}, {translateY: -50}],
    maxWidth: 110,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 5,
    overflow: 'hidden',
  },
  backToTopText: {
    color: primaryColor.main,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SelectLocationScreen;
