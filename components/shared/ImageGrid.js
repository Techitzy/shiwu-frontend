import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DraggableFlatList from 'react-native-draggable-flatlist';

const MAX_IMAGES = 6;

const ImageGrid = ({images, setImages}) => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const backgroundColor = isDarkTheme ? '#121212' : '#fff';
  const textColor = isDarkTheme ? '#fff' : '#000';
  const borderColor = isDarkTheme ? '#333' : '#ccc';

  const addImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const newImage = {
        uri: result.assets[0].uri,
        fileName: result.assets[0].fileName || `image_${Date.now()}.jpg`,
        type: 'image/jpeg', // Default type
      };
      setImages(prevImages => [...prevImages, newImage]);
    }
  };

  const removeImage = index => {
    setImages(prevImages => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  const renderItem = ({item, index, drag}) => (
    <TouchableOpacity
      style={[
        styles.imageBox,
        {backgroundColor: isDarkTheme ? '#333' : '#f5f5f5', borderColor},
      ]}
      onLongPress={drag}>
      {item ? (
        <>
          <Image source={{uri: item.uri}} style={styles.image} />
          <TouchableOpacity
            style={styles.removeIcon}
            onPress={() => removeImage(index)}>
            <Ionicons name="close-circle" size={24} color="red" />
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity onPress={addImage} style={styles.addIconContainer}>
          <Ionicons name="add" size={40} color={textColor} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container]}>
      <DraggableFlatList
        data={[...images, ...Array(Math.max(0, MAX_IMAGES - images.length)).fill(null)]}
        renderItem={renderItem}
        keyExtractor={(item, index) => `image-${index}`}
        numColumns={3}
        onDragEnd={({data}) => setImages(data.filter(img => img))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBox: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dotted',
    margin: '1.5%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  addIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 50,
  },
});

export default ImageGrid;
