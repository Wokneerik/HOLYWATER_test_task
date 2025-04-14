import React, {FC, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from 'react-native';
import useBannerSlides from '../../hooks/useBannerSlides';
import {Slide} from '../../types';
import BannerItem from '../BannerItem';
import RenderIndicator from '../RenderIndicator';

const {width} = Dimensions.get('window');
const SLIDE_WIDTH = width;
const AUTO_SLIDE_INTERVAL = 3000;

const Banner: FC = () => {
  const {originalSlides, displaySlides, loading, error} = useBannerSlides({
    remoteConfigKey: 'json_data',
  });

  const [currentIndex, setCurrentIndex] = useState<number>(1);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scrolling = useRef(false);
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (
      displaySlides.length > 0 &&
      flatListRef.current &&
      isInitialRender.current
    ) {
      if (originalSlides.length > 1) {
        flatListRef.current.scrollToIndex({
          index: 0,
          animated: false,
        });
        setCurrentIndex(1);
      }
      isInitialRender.current = false;
    }
  }, [displaySlides, originalSlides.length]);

  useEffect(() => {
    if (displaySlides.length === 0 || loading) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      if (scrolling.current) return;

      let nextIndex = currentIndex + 1;

      if (originalSlides.length <= 1) {
        nextIndex = 0;
      }

      flatListRef.current?.scrollToIndex({index: nextIndex, animated: true});
      setCurrentIndex(nextIndex);
    }, AUTO_SLIDE_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, displaySlides, loading, originalSlides.length]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (scrolling.current) return;

    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(offsetX / SLIDE_WIDTH + 0.5);

    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(offsetX / SLIDE_WIDTH + 0.5);

    if (originalSlides.length > 1) {
      if (index === 0) {
        flatListRef.current?.scrollToIndex({
          index: originalSlides.length,
          animated: false,
        });
        setCurrentIndex(originalSlides.length);
      } else if (index === displaySlides.length - 1) {
        flatListRef.current?.scrollToIndex({
          index: 1,
          animated: false,
        });
        setCurrentIndex(1);
      } else {
        setCurrentIndex(index);
      }
    }

    scrolling.current = false;
  };

  const getAdjustedIndicatorIndex = () => {
    if (originalSlides.length <= 1) return 0;

    if (currentIndex === 0) {
      return originalSlides.length - 1;
    } else if (currentIndex === displaySlides.length - 1) {
      return 0;
    } else {
      return currentIndex - 1;
    }
  };

  const handleBeginDrag = () => {
    scrolling.current = true;
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  return (
    <View style={{position: 'relative'}}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text style={{padding: 20, color: 'red'}}>
          Error loading banner: {error.message}
        </Text>
      ) : displaySlides && displaySlides.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={displaySlides}
          keyExtractor={(item, index) => `${item.id.toString()}-${index}`}
          renderItem={({item}) => <BannerItem item={item} />}
          horizontal
          pagingEnabled
          snapToInterval={SLIDE_WIDTH}
          snapToAlignment="center"
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScrollEnd}
          onScrollBeginDrag={handleBeginDrag}
          scrollEventThrottle={16}
          contentContainerStyle={{
            alignItems: 'center',
          }}
          getItemLayout={(_, index) => ({
            length: SLIDE_WIDTH,
            offset: SLIDE_WIDTH * index,
            index,
          })}
        />
      ) : (
        <Text style={{padding: 20, color: 'white'}}>No slides available</Text>
      )}
      {displaySlides.length > 0 && (
        <RenderIndicator
          slides={originalSlides}
          currentIndex={getAdjustedIndicatorIndex()}
        />
      )}
    </View>
  );
};

export default Banner;
