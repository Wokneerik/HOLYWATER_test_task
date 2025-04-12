import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useEffect} from 'react';
import {Image, ImageBackground, Text, View} from 'react-native';
import Loader from '../../components/Loader';
import {RootStackParamList} from '../../navigation/types';
import styles from './styles';

const SplashScreen: FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../../assets/bg2.png')}
      style={styles.backgroundImage}>
      <Image
        source={require('../../assets/bgHeart3.png')}
        style={styles.overlayImage}
        resizeMode="contain"
      />

      <View style={styles.textContainer}>
        <Text style={styles.bookAppText}>Book App</Text>
        <Text style={styles.welcomeText}>Welcome to Book App</Text>
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      </View>
    </ImageBackground>
  );
};

export default SplashScreen;
