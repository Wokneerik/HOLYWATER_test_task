import {Platform, StatusBar, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#101010',
    flex: 1,
    paddingLeft: 16,
  },
  label: {
    fontSize: 20,
    fontWeight: 700,
    color: '#D0006E',
    paddingVertical: 16,
  },
  AndroidSafeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#101010',
    flex: 1,
  },
});

export default styles;
