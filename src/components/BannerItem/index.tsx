import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {Slide} from '../../types';
import styles from './styles';

const BannerItem = ({item}: {item: Slide}) => {
  return (
    <TouchableOpacity style={styles.bannerContainer}>
      <Image source={{uri: item.cover}} style={styles.bannerImg} />
    </TouchableOpacity>
  );
};

export default BannerItem;
