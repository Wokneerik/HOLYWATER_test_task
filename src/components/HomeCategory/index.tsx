import remoteConfig from '@react-native-firebase/remote-config';
import React, {FC, useEffect, useState} from 'react';
import {FlatList, Image, ScrollView, Text, View} from 'react-native';
import {Book} from '../../types';
import styles from './styles';

interface GenreGroup {
  genre: string;
  books: Book[];
}

const HomeCategory: FC = () => {
  const [groupedBooks, setGroupedBooks] = useState<GenreGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        await remoteConfig().setDefaults({
          json_data: JSON.stringify({books: []}),
        });

        await remoteConfig().setConfigSettings({
          minimumFetchIntervalMillis: 0,
        });

        await remoteConfig().fetchAndActivate();
        const jsonDataString = remoteConfig().getValue('json_data').asString();
        const json = JSON.parse(jsonDataString);

        if (json && json.books) {
          const books: Book[] = json.books;
          const grouped: {[key: string]: Book[]} = {};
          books.forEach(book => {
            if (grouped[book.genre]) {
              grouped[book.genre].push(book);
            } else {
              grouped[book.genre] = [book];
            }
          });

          const groupedArray: GenreGroup[] = Object.keys(grouped).map(
            genre => ({
              genre,
              books: grouped[genre],
            }),
          );
          setGroupedBooks(groupedArray);
        }
      } catch (error) {
        console.error('Error loading remote config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {groupedBooks.map((genreGroup, index) => (
        <View key={index} style={styles.genreContainer}>
          <Text style={styles.genreTitle}>{genreGroup.genre}</Text>
          <FlatList
            data={genreGroup.books}
            keyExtractor={book => book.id.toString()}
            renderItem={({item}) => (
              <View style={styles.bookItemContainer}>
                <Image
                  source={{uri: item.cover_url}}
                  style={styles.bookCover}
                />
                <Text style={styles.bookName}>{item.name}</Text>
              </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.booksRow}
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default HomeCategory;
