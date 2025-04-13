import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');
const ITEM_WIDTH = 200;
const ITEM_MARGIN = 10;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    width: width,
  },
  carouselItem: {
    width: ITEM_WIDTH,
    marginHorizontal: ITEM_MARGIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookCover: {
    width: ITEM_WIDTH,
    height: 250,
    borderRadius: 10,
  },
  bookInfoContainer: {
    padding: 5,
    alignItems: 'center',
    width: '100%',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
  },
  bookAuthor: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default styles;
