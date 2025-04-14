import React, {FC, useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, FlatList, Image, Text, View} from 'react-native';
import useDetailsCarouselData from '../../hooks/useDetailsCarouselData';
import {Book} from '../../types';
import Summary from '../Summary';
import styles from './styles';

interface DetailsHeaderCarouselProps {
  initialBookId?: number;
}

const {width} = Dimensions.get('window');
const ITEM_WIDTH = 200;
const ITEM_MARGIN = 10;
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + ITEM_MARGIN * 2;
const CENTER_OFFSET = (width - ITEM_WIDTH) / 2 - ITEM_MARGIN;

const DetailsCarousel: FC<DetailsHeaderCarouselProps> = ({initialBookId}) => {
  const {carouselBooks, loading, error, initialIndex} = useDetailsCarouselData({
    remoteConfigKey: 'details_carousel',
    initialBookId,
  });

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const flatListRef = useRef<FlatList<Book>>(null);
  const [isInitialScrollComplete, setIsInitialScrollComplete] = useState(false);
  const scrollX = useRef(
    new Animated.Value(initialIndex * TOTAL_ITEM_WIDTH),
  ).current;

  useEffect(() => {
    if (carouselBooks.length > 0 && flatListRef.current) {
      const initialOffset = initialIndex * TOTAL_ITEM_WIDTH;
      flatListRef.current.scrollToOffset({
        offset: initialOffset,
        animated: false,
      });
      scrollX.setValue(initialOffset);
      setIsInitialScrollComplete(true);
    }
  }, [carouselBooks, initialIndex]);

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

  const carouselBookItem = ({item, index}: {item: Book; index: number}) => {
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

  if (loading) {
    return (
      <Text style={{padding: 20, color: 'white'}}>Loading carousel...</Text>
    );
  }

  if (error) {
    return (
      <Text style={{padding: 20, color: 'red'}}>
        Error loading carousel: {error.message}
      </Text>
    );
  }

  return (
    <>
      <View style={styles.container}>
        {carouselBooks.length > 0 && (
          <>
            <Animated.FlatList
              ref={flatListRef as any}
              data={carouselBooks}
              keyExtractor={item => item.id.toString()}
              renderItem={carouselBookItem}
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
              initialScrollIndex={initialIndex}
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
      <Summary carouselBooks={carouselBooks} currentIndex={currentIndex} />
    </>
  );
};

export default DetailsCarousel;
