import React, {FC} from 'react';
import {ImageBackground, SafeAreaView} from 'react-native';

import BackButton from '../../components/BackButton';

import DetailsCarousel from '../../components/DetailsCarousel';
import {DetailsScreenProps} from '../../navigation/types';
import styles from './styles';

const DetailsScreen: FC<DetailsScreenProps> = ({route}) => {
  const {bookId} = route.params;

  return (
    <ImageBackground
      source={require('../../assets/Group669.png')}
      style={styles.backgroundImage}>
      <SafeAreaView style={styles.AndroidSafeArea}>
        <BackButton />
        <DetailsCarousel initialBookId={bookId} />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default DetailsScreen;
