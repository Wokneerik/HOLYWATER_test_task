import React, {FC} from 'react';
import {ImageBackground} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import styles from './styles';

const DetailsScreen: FC = () => {
  return (
    <ImageBackground
      source={require('../../assets/Group669.png')}
      style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <BackButton />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default DetailsScreen;
