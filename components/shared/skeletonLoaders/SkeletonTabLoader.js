import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {ScrollView, View, StyleSheet} from 'react-native';

const SkeletonTabLoader = ({theme}) => {
  const backgroundColor = theme === 'dark' ? '#333333' : '#e1e1e1';
  const highlightColor = theme === 'dark' ? '#121212' : '#f0f0f0';

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalContainer}>
      <SkeletonPlaceholder
        backgroundColor={backgroundColor}
        highlightColor={highlightColor}>
        <View style={styles.skeletonRow}>
          {Array.from({length: 7}).map((_, index) => (
            <SkeletonPlaceholder.Item
              key={index}
              width={80}
              height={30}
              paddingVertical={5}
              borderRadius={10}
              marginRight={10}
              marginTop={15}
            />
          ))}
        </View>
      </SkeletonPlaceholder>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  horizontalContainer: {
    paddingHorizontal: 5,
  },
  skeletonRow: {
    flexDirection: 'row',
    borderRadius: 20,
  },
});

export default SkeletonTabLoader;
