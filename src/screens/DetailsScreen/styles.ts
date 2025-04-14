import {Platform, StatusBar, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  AndroidSafeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

export default styles;
