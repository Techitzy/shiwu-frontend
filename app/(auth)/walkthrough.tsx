import { useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

// Background image for all slides
const backgroundImage = require('../../public/images/onboarding1.jpg');

// Individual cartoons for each slide
const cartoons = [
  require('../../public/images/CreateEventBG.jpg'),
  require('../../public/images/CreateEventBG.jpg'),
  require('../../public/images/CreateEventBG.jpg'),
];

const slides = [
  {
    key: 'one',
    title: 'Discover Events',
    text: 'Explore and participate in amazing events around you.',
    cartoon: cartoons[0],
    backgroundColor: '#febe29',
  },
  {
    key: 'two',
    title: 'Join the Fun',
    text: 'Join parties, concerts, and much more!',
    cartoon: cartoons[1],
    backgroundColor: '#22bcb5',
  },
  {
    key: 'three',
    title: 'Adventure Awaits',
    text: 'Plan and go on incredible trips.',
    cartoon: cartoons[2],
    backgroundColor: '#3395ff',
  },
];

const WalkthroughScreen = () => {
  const router = useRouter();
  return (
    <AppIntroSlider
      renderItem={({ item }) => (
        <ImageBackground source={backgroundImage} style={styles.background}>
          <View style={[styles.slide]}>
            <Text style={styles.title}>{item.title}</Text>
            {/* <Image source={item.cartoon} style={styles.cartoon} /> */}
            <Text style={styles.text}>{item.text}</Text>
          </View>
        </ImageBackground>
      )}
      data={slides}
      onDone={() => router.replace('/(auth)/login')}
    />
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  cartoon: {
    width: 250, // Adjust based on your actual image dimensions
    height: 250,
    marginBottom: 30,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default WalkthroughScreen;
