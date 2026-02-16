import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {View, StyleSheet} from 'react-native';

const SkeletonHostLoader = ({theme}) => {
  const backgroundColor = theme === 'dark' ? '#333333' : '#e1e1e1';
  const highlightColor = theme === 'dark' ? '#121212' : '#f0f0f0';

  return (
    <View style={styles.container}>
      <SkeletonPlaceholder
        backgroundColor={backgroundColor}
        highlightColor={highlightColor}>
        <View style={styles.skeletonContainer}>
          <SkeletonPlaceholder.Item width={50} height={50} borderRadius={25} />
          <SkeletonPlaceholder.Item style={styles.detailsContainer}>
            <SkeletonPlaceholder.Item
              width={100}
              height={20}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              marginTop={6}
              width={250}
              height={40}
              borderRadius={4}
            />
          </SkeletonPlaceholder.Item>
        </View>
      </SkeletonPlaceholder>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  skeletonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsContainer: {
    marginLeft: 10,
    flex: 1,
  },
});

export default SkeletonHostLoader;
