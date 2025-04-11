import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  Details: {bookId: number};
};

export type DetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Details'
>;
