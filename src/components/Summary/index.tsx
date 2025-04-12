import remoteConfig from '@react-native-firebase/remote-config';
import React, {FC, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Book} from '../../types';
import styles from './styles';

interface SummaryProps {
  initialBookId: number;
}

const Summary: FC<SummaryProps> = ({initialBookId}) => {
  const [book, setBook] = useState<Book | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [errorRecommendations, setErrorRecommendations] =
    useState<Error | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const fetchDetailedBook = async () => {
      setLoading(true);
      setError(null);
      try {
        await remoteConfig().setDefaults({
          json_data: JSON.stringify({books: [], you_will_like_section: []}),
        });
        await remoteConfig().setConfigSettings({
          minimumFetchIntervalMillis: 0,
        });
        await remoteConfig().fetchAndActivate();
        const jsonDataString = remoteConfig().getValue('json_data').asString();
        const json = JSON.parse(jsonDataString);

        if (json && Array.isArray(json.books)) {
          const foundBook = json.books.find(b => b.id === initialBookId);
          setBook(foundBook || null);

          // Fetch recommended books
          if (foundBook && Array.isArray(json.you_will_like_section)) {
            setLoadingRecommendations(true);
            const recommendedIds = json.you_will_like_section;
            const relatedBooks = json.books.filter(b =>
              recommendedIds.includes(b.id),
            );
            setRecommendedBooks(relatedBooks);
            setLoadingRecommendations(false);
          } else {
            setLoadingRecommendations(false);
          }
        } else {
          setError(new Error('Failed to load book data'));
          setLoadingRecommendations(false);
        }
      } catch (error: any) {
        setError(error);
        setErrorRecommendations(error);
        setLoadingRecommendations(false);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedBook();
  }, [initialBookId]);

  if (loading) {
    return <Text style={styles.loadingText}>Loading summary...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>Error loading summary</Text>;
  }

  if (!book) {
    return <Text style={styles.noBookText}>Book details not found</Text>;
  }

  return (
    <ScrollView
      style={styles.container}
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}>
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>{book.views}</Text>
          <Text style={styles.infoLabel}>Views</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>{book.likes}</Text>
          <Text style={styles.infoLabel}>Likes</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>{book.quotes}</Text>
          <Text style={styles.infoLabel}>Quotes</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>{book.genre}</Text>
          <Text style={styles.infoLabel}>Genre</Text>
        </View>
      </View>
      <View style={styles.separator} />
      <View style={styles.summaryBlock}>
        <Text style={styles.title}>Summary</Text>
        <Text style={styles.summaryText}>{book.summary}</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.recommendationBlock}>
        <Text style={styles.title}>You will also like</Text>
        {loadingRecommendations ? (
          <Text style={styles.loadingRecommendationsText}>
            Loading recommendations...
          </Text>
        ) : errorRecommendations ? (
          <Text style={styles.errorRecommendationsText}>
            Error loading recommendations
          </Text>
        ) : recommendedBooks.length > 0 ? (
          <FlatList
            data={recommendedBooks}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <View style={styles.recommendedBookItem}>
                <Image
                  source={{uri: item.cover_url}}
                  style={styles.recommendedBookCover}
                />
                <Text style={styles.recommendedBookTitle}>{item.name}</Text>
              </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedBooksRow}
          />
        ) : (
          <Text style={styles.noRecommendationsText}>
            No recommendations found.
          </Text>
        )}
      </View>
      <TouchableOpacity style={styles.readNowButton}>
        <Text style={styles.readNowText}>Read Now</Text>
      </TouchableOpacity>
      <View style={{height: 370}} />
    </ScrollView>
  );
};

export default Summary;
