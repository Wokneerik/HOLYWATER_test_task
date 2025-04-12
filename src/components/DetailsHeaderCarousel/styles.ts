import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');
const ITEM_WIDTH = 200;
const ITEM_MARGIN = 20;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  contentContainer: {
    paddingHorizontal: (width - ITEM_WIDTH) / 2,
  },
  carouselItem: {
    width: ITEM_WIDTH,
    marginHorizontal: ITEM_MARGIN,
    alignItems: 'center',
  },
  bookCover: {
    width: 200,
    height: 250,
    borderRadius: 10,
  },
  bookInfoContainer: {
    padding: 20,
    alignItems: 'center',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  bookAuthor: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
});

export default styles;
