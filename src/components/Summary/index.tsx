import React, {FC, useRef} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import useRecommendedBooks from '../../hooks/useRecommendedBooks';
import {Book} from '../../types';
import styles from './styles';

interface SummaryProps {
  carouselBooks: Book[];
  currentIndex: number;
}

const Summary: FC<SummaryProps> = ({carouselBooks, currentIndex}) => {
  const {recommendedBooks, loadingRecommendations, errorRecommendations} =
    useRecommendedBooks({
      remoteConfigKey: 'json_data',
    });

  const scrollViewRef = useRef<ScrollView>(null);

  if (!carouselBooks[currentIndex]) {
    return <Text style={{padding: 20, color: 'white'}}>No book selected</Text>;
  }

  const currentBook = carouselBooks[currentIndex];

  return (
    <>
      <ScrollView
        style={styles.container}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>{currentBook.views}</Text>
            <Text style={styles.infoLabel}>Views</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>{currentBook.likes}</Text>
            <Text style={styles.infoLabel}>Likes</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>{currentBook.quotes}</Text>
            <Text style={styles.infoLabel}>Quotes</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>{currentBook.genre}</Text>
            <Text style={styles.infoLabel}>Genre</Text>
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.summaryBlock}>
          <Text style={styles.title}>Summary</Text>
          <Text style={styles.summaryText}>{currentBook.summary}</Text>
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
        <View style={{height: 400}} />
      </ScrollView>
    </>
  );
};

export default Summary;
