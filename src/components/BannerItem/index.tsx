import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {RootStackParamList} from '../../navigation/types';
import {Slide} from '../../types';
import styles from './styles';

type BannerItemNavigationProp = NavigationProp<RootStackParamList>;

const BannerItem = ({item}: {item: Slide}) => {
  const navigation = useNavigation<BannerItemNavigationProp>();

  const onBannerPress = () => {
    navigation.navigate('Details', {bookId: item.book_id});
  };

  return (
    <TouchableOpacity onPress={onBannerPress}>
      <Image source={{uri: item.cover}} style={styles.bannerImg} />
    </TouchableOpacity>
  );
};

export default BannerItem;
