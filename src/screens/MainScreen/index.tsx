import React, {FC} from 'react';
import {Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Banner from '../../components/Banner';
import styles from './styles';

const MainScreen: FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Library</Text>
      <Banner />
    </SafeAreaView>
  );
};

export default MainScreen;
