// navigation/index.tsx

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import React, {FC} from 'react';
import {DetailsScreen, MainScreen, SplashScreen} from '../screens';
import {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation: FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Splash" component={SplashScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
