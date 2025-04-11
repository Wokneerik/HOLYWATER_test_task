import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  bannerImg: {
    width: width,
    height: 160,
    borderRadius: 10,
    resizeMode: 'cover',
    paddingRight: 30,
  },
});

export default styles;
