import React, {FC} from 'react';
import {ImageBackground} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import DetailsHeaderCarousel from '../../components/DetailsHeaderCarousel';
import Summary from '../../components/Summary';
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
        <DetailsHeaderCarousel initialBookId={bookId} />
        <Summary initialBookId={bookId} />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default DetailsScreen;
