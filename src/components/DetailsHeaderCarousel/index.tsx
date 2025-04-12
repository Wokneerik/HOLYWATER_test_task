import remoteConfig from '@react-native-firebase/remote-config';
import React, {FC, useEffect, useRef, useState} from 'react';
import {FlatList, Image, Text, View} from 'react-native';
import {Book} from '../../types';
import styles from './styles';

interface DetailsHeaderCarouselProps {
  initialBookId?: number;
}

const ITEM_WIDTH = 200;
const ITEM_MARGIN = 10;
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + ITEM_MARGIN * 2;

const DetailsHeaderCarousel: FC<DetailsHeaderCarouselProps> = ({
  initialBookId,
}) => {
  const [carouselBooks, setCarouselBooks] = useState<Book[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList<Book>>(null);

  useEffect(() => {
    const fetchCarouselBooks = async () => {
      try {
        await remoteConfig().setDefaults({
          details_carousel: JSON.stringify({books: []}),
        });
        await remoteConfig().setConfigSettings({
          minimumFetchIntervalMillis: 0,
        });
        await remoteConfig().fetchAndActivate();
        const jsonDataString = remoteConfig()
          .getValue('details_carousel')
          .asString();
        const json = JSON.parse(jsonDataString);

        if (json && Array.isArray(json.books)) {
          setCarouselBooks(json.books);

          if (initialBookId) {
            const initialIndex = json.books.findIndex(
              (book: Book) => book.id === initialBookId,
            );
            if (initialIndex !== -1) {
              setCurrentIndex(initialIndex);

              setTimeout(() => {
                flatListRef.current?.scrollToIndex({
                  index: initialIndex,
                  animated: false,
                });
              }, 0);
            }
          }
        } else {
          console.warn(
            'details_carousel in Remote Config does not contain a valid "books" array.',
          );
        }
      } catch (error) {
        console.error('Error fetching details carousel:', error);
      }
    };

    fetchCarouselBooks();
  }, [initialBookId]);

  const handleScroll = (event: any) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / TOTAL_ITEM_WIDTH,
    );
    setCurrentIndex(index);
  };

  const renderItem = ({item}: {item: Book}) => (
    <View style={styles.carouselItem}>
      <Image source={{uri: item.cover_url}} style={styles.bookCover} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={carouselBooks}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        snapToInterval={TOTAL_ITEM_WIDTH}
        snapToAlignment="center"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        onMomentumScrollEnd={handleScroll}
      />
      {carouselBooks.length > 0 && (
        <View style={styles.bookInfoContainer}>
          <Text style={styles.bookTitle}>
            {carouselBooks[currentIndex]?.name}
          </Text>
          <Text style={styles.bookAuthor}>
            {carouselBooks[currentIndex]?.author}
          </Text>
        </View>
      )}
    </View>
  );
};

export default DetailsHeaderCarousel;
