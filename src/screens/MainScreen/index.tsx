import React, {FC} from 'react';
import {SafeAreaView, Text, View} from 'react-native';

import Banner from '../../components/Banner';
import HomeCategory from '../../components/HomeCategory';
import styles from './styles';

const MainScreen: FC = () => {
  return (
    <SafeAreaView style={styles.AndroidSafeArea}>
      <View style={styles.container}>
        <Text style={styles.label}>Library</Text>
        <Banner />
        <HomeCategory />
      </View>
    </SafeAreaView>
  );
};

export default MainScreen;
