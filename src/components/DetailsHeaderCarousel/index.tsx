import remoteConfig from '@react-native-firebase/remote-config';
import React, {FC, useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, FlatList, Image, Text, View} from 'react-native';
import {Book} from '../../types';
import styles from './styles';

interface DetailsHeaderCarouselProps {
  initialBookId?: number;
}

const {width} = Dimensions.get('window');
const ITEM_WIDTH = 200;
const ITEM_MARGIN = 10;
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + ITEM_MARGIN * 2;

// Calculate the offset to center an item
const CENTER_OFFSET = (width - ITEM_WIDTH) / 2 - ITEM_MARGIN;

const DetailsHeaderCarousel: FC<DetailsHeaderCarouselProps> = ({
  initialBookId,
}) => {
  const [carouselBooks, setCarouselBooks] = useState<Book[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList<Book>>(null);
  const [isInitialScrollComplete, setIsInitialScrollComplete] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;

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

              // Delay for scrolling
              setTimeout(() => {
                if (flatListRef.current) {
                  const offset = initialIndex * TOTAL_ITEM_WIDTH;
                  flatListRef.current.scrollToOffset({
                    offset,
                    animated: false,
                  });
                  scrollX.setValue(offset);
                  setIsInitialScrollComplete(true);
                }
              }, 200);
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
  }, [initialBookId, scrollX]);

  const handleScroll = (event: any) => {
    if (!isInitialScrollComplete) return;

    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / TOTAL_ITEM_WIDTH);

    if (index >= 0 && index < carouselBooks.length && index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const getItemLayout = (_data: any, index: number) => ({
    length: TOTAL_ITEM_WIDTH,
    offset: TOTAL_ITEM_WIDTH * index,
    index,
  });

  const renderItem = ({item, index}: {item: Book; index: number}) => {
    const inputRange = [
      (index - 1) * TOTAL_ITEM_WIDTH,
      index * TOTAL_ITEM_WIDTH,
      (index + 1) * TOTAL_ITEM_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.85, 1, 0.85],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.carouselItem}>
        <Animated.View
          style={{
            transform: [{scale}],
            opacity,
          }}>
          <Image source={{uri: item.cover_url}} style={styles.bookCover} />
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {carouselBooks.length > 0 && (
        <>
          <Animated.FlatList
            ref={flatListRef as any}
            data={carouselBooks}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={TOTAL_ITEM_WIDTH}
            snapToAlignment="start"
            contentContainerStyle={{
              paddingHorizontal: CENTER_OFFSET,
            }}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {useNativeDriver: true, listener: event => {}},
            )}
            onMomentumScrollEnd={handleScroll}
            getItemLayout={getItemLayout}
            initialNumToRender={5}
          />
          <View style={styles.bookInfoContainer}>
            <Text style={styles.bookTitle}>
              {carouselBooks[currentIndex]?.name}
            </Text>
            <Text style={styles.bookAuthor}>
              {carouselBooks[currentIndex]?.author}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

export default DetailsHeaderCarousel;
