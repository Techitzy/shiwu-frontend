import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const SkeletonEventLoader = ({theme}) => {
  const backgroundColor = theme === 'dark' ? '#333333' : '#e1e1e1';
  const highlightColor = theme === 'dark' ? '#121212' : '#f0f0f0';
  return (
    <SkeletonPlaceholder
      backgroundColor={backgroundColor}
      highlightColor={highlightColor}>
      <View style={{marginTop: '10%'}}>
        {Array.from({length: 5}).map((_, index) => (
          <SkeletonPlaceholder.Item
            key={index}
            flexDirection="row"
            alignItems="center"
            marginBottom={10}>
            <SkeletonPlaceholder.Item padding={5} flex={1}>
              <SkeletonPlaceholder.Item
                marginTop={5}
                width="100%"
                height={120}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        ))}
      </View>
    </SkeletonPlaceholder>
  );
};

export default SkeletonEventLoader;
