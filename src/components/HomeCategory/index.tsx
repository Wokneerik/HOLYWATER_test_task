import React, {FC} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  View,
} from 'react-native';
import useGroupedRemoteConfigData from '../../hooks/useGroupedRemoteConfigData';
import BookItem from '../BookItem';
import styles from './styles';

const HomeCategory: FC = () => {
  const {groupedBooks, loading} = useGroupedRemoteConfigData({
    remoteConfigKey: 'json_data',
  });

  return (
    <>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <ScrollView style={styles.container}>
          {groupedBooks.map((genreGroup, index) => (
            <View key={index} style={styles.genreContainer}>
              <Text style={styles.genreTitle}>{genreGroup.genre}</Text>
              <FlatList
                data={genreGroup.books}
                keyExtractor={book => book.id.toString()}
                renderItem={({item}) => <BookItem book={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.booksRow}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </>
  );
};

export default HomeCategory;
