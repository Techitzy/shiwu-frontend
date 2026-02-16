import React from 'react';
import {View, Text, Image, StyleSheet, useColorScheme} from 'react-native';
import {lightColors, darkColors} from '../../../themes/basics';
import SkeletonHostLoader from '../skeletonLoaders/SkeletonHostLoader';

const HostDetails = ({host, loading}) => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const backgroundColor = isDarkTheme
    ? darkColors.backgroundColor
    : lightColors.backgroundColor;
  const textColor = isDarkTheme ? darkColors.textColor : lightColors.textColor;
  const headerTextColor = isDarkTheme
    ? darkColors.headerTextColor
    : lightColors.headerTextColor;
  const informationText = isDarkTheme
    ? darkColors.informationText
    : lightColors.informationText;
  return (
    <View
      style={[
        styles.hostContainer,
        {
          backgroundColor: backgroundColor,
          shadowColor: '#888',
        },
      ]}>
      <Text style={[styles.header, {color: textColor}]}>About the Host</Text>
      {loading ? (
        <SkeletonHostLoader theme={colorScheme} />
      ) : (
        <View style={styles.hostContent}>
          <Image source={{uri: host.profile_pic}} style={styles.avatar} />
          <View style={styles.hostInfo}>
            <Text style={[styles.hostName, {color: textColor}]}>
              {host.full_name}
            </Text>
            <Text style={[styles.hostBio, {color: informationText}]}>
              {host.bio}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  hostContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 8,
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 4},
    marginHorizontal: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  hostContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    fontSize: 16,
    fontWeight: '600',
  },
  hostBio: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default HostDetails;
