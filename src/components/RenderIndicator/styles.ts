import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    bottom: 20,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: '#C1C2CA',
  },
  indicatorDotActive: {
    backgroundColor: '#D0006E',
  },
});

export default styles;
