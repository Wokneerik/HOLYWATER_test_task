import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {FC} from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import {RootStackParamList} from '../../navigation/types';
import {Book} from '../../types';
import styles from './styles';

interface BookItemProps {
  book: Book;
}

type BookItemNavigationProp = NavigationProp<RootStackParamList>;

const BookItem: FC<BookItemProps> = ({book}) => {
  const navigation = useNavigation<BookItemNavigationProp>();

  const handlePress = () => {
    navigation.navigate('Details', {bookId: book.id});
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.bookItemContainer}>
      <Image source={{uri: book.cover_url}} style={styles.bookCover} />
      <Text style={styles.bookName}>{book.name}</Text>
    </TouchableOpacity>
  );
};

export default BookItem;
