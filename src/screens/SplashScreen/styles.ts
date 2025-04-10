import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  overlayImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  container: {
    flex: 1,
    zIndex: 2,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookAppText: {
    fontSize: 52,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#DD48A1',
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFFCC',
  },
  loaderContainer: {
    paddingTop: 35,
  },
});

export default styles;
