import React, {FC} from 'react';
import {ImageBackground} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
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
      <SafeAreaView>
        <BackButton />
        <DetailsCarousel initialBookId={bookId} />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default DetailsScreen;
