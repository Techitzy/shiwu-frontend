import React from 'react';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const {width} = Dimensions.get('window');

const ImageCarousel = ({event}) => {
  const renderImage = ({item}) => (
    <View style={styles.imageWithDateContainer}>
      <Image source={{uri: item.image}} style={styles.carouselImage} />
      {/* <View style={styles.dateOverlay}>
        <Text style={styles.dateText}>{item.date}</Text>
      </View> */}
    </View>
  );

  const carouselImages = [
    {image: event.banner_img, date: event.datetime},
    ...event.meta.images.map(img => ({image: img.url, date: event.datetime})),
  ];

  console.log('CAROSEL:: ', carouselImages);

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        data={carouselImages}
        renderItem={renderImage}
        width={width - 30}
        height={200}
        loop={true}
        autoPlay={true}
        autoPlayInterval={3000}
        mode="parallax"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  imageWithDateContainer: {
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  carouselImage: {
    width: width, // Match the carousel width
    height: 180, // Adjust height as desired
    resizeMode: 'cover',
    borderRadius: 10,
  },
  dateOverlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  dateText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default ImageCarousel;
