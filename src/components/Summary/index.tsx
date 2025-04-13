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
  carouselBooks: Book[];
  currentIndex: number;
}

const Summary: FC<SummaryProps> = ({carouselBooks, currentIndex}) => {
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);

  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [errorRecommendations, setErrorRecommendations] =
    useState<Error | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      if (
        !carouselBooks ||
        carouselBooks.length === 0 ||
        !carouselBooks[currentIndex]?.id
      ) {
        setRecommendedBooks([]);
        setLoadingRecommendations(false);
        return;
      }

      setLoadingRecommendations(true);
      setErrorRecommendations(null);

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

        if (
          json &&
          Array.isArray(json.books) &&
          Array.isArray(json.you_will_like_section)
        ) {
          const recommendedIds = json.you_will_like_section;
          const relatedBooks = json.books.filter((b: any) =>
            recommendedIds.includes(b.id),
          );
          setRecommendedBooks(relatedBooks);
        } else {
          setRecommendedBooks([]);
          setErrorRecommendations(
            new Error('Failed to load recommendation data'),
          );
        }
      } catch (error: any) {
        setErrorRecommendations(error);
        setRecommendedBooks([]);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchRecommendedBooks();
  }, []);

  return (
    <>
      {carouselBooks[currentIndex] ? (
        <ScrollView
          style={styles.container}
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoValue}>
                {carouselBooks[currentIndex].views}
              </Text>
              <Text style={styles.infoLabel}>Views</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoValue}>
                {carouselBooks[currentIndex].likes}
              </Text>
              <Text style={styles.infoLabel}>Likes</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoValue}>
                {carouselBooks[currentIndex].quotes}
              </Text>
              <Text style={styles.infoLabel}>Quotes</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoValue}>
                {carouselBooks[currentIndex].genre}
              </Text>
              <Text style={styles.infoLabel}>Genre</Text>
            </View>
          </View>
          <View style={styles.separator} />
          <View style={styles.summaryBlock}>
            <Text style={styles.title}>Summary</Text>
            <Text style={styles.summaryText}>
              {carouselBooks[currentIndex].summary}
            </Text>
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
      ) : (
        <Text style={{padding: 20, color: 'white'}}>No slides available</Text>
      )}
    </>
  );
};

export default Summary;
