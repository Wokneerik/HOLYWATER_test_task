import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import styles from './styles';

const BackButton = () => {
  const navigation = useNavigation();

  const navigateBack = () => {
    navigation.goBack();
  };

  return (
    <TouchableOpacity onPress={navigateBack} style={styles.container}>
      <Image
        source={require('../../assets/backArrow.png')}
        style={{width: 20, height: 12}}
      />
    </TouchableOpacity>
  );
};

export default BackButton;
