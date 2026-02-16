import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {ScrollView, View, StyleSheet} from 'react-native';

const SkeletonCategoryLoader = ({theme}) => {
  const backgroundColor = theme === 'dark' ? '#333333' : '#e1e1e1';
  const highlightColor = theme === 'dark' ? '#121212' : '#f0f0f0';

  return (
    <SkeletonPlaceholder
      backgroundColor={backgroundColor}
      highlightColor={highlightColor}>
      <View style={styles.skeletonContainer}>
        {Array.from({length: 10}).map((_, index) => (
          <SkeletonPlaceholder.Item
            key={index}
            width={100}
            height={30}
            borderRadius={16}
            margin={4}
          />
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center', // Ensure alignment if needed
  },
});

export default SkeletonCategoryLoader;
