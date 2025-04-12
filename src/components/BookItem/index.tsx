import React, {FC} from 'react';
import {Image, Text, View} from 'react-native';
import {Book} from '../../types';
import styles from './styles';

interface BookItemProps {
  book: Book;
}

const BookItem: FC<BookItemProps> = ({book}) => {
  return (
    <View style={styles.bookItemContainer}>
      <Image source={{uri: book.cover_url}} style={styles.bookCover} />
      <Text style={styles.bookName}>{book.name}</Text>
    </View>
  );
};

export default BookItem;
