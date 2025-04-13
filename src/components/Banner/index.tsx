import remoteConfig from '@react-native-firebase/remote-config';
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
import {Slide} from '../../types';
import BannerItem from '../BannerItem';
import RenderIndicator from '../RenderIndicator';

const {width} = Dimensions.get('window');
const SLIDE_WIDTH = width;

const AUTO_SLIDE_INTERVAL = 3000;

const Banner: FC = () => {
  const [originalSlides, setOriginalSlides] = useState<Slide[]>([]);
  const [displaySlides, setDisplaySlides] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0); // Start at 0 (first cloned item)
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scrolling = useRef(false);

  useEffect(() => {
    const fetchBannerSlides = async () => {
      try {
        await remoteConfig().setDefaults({
          json_data: JSON.stringify({top_banner_slides: []}),
        });

        await remoteConfig().setConfigSettings({
          minimumFetchIntervalMillis: 0,
        });

        await remoteConfig().fetchAndActivate();
        const jsonDataString = remoteConfig().getValue('json_data').asString();
        const json = JSON.parse(jsonDataString);

        if (json && json.top_banner_slides) {
          const slides = json.top_banner_slides;
          setOriginalSlides(slides);

          if (slides.length > 0) {
            const modifiedSlides = [
              slides[slides.length - 1],
              ...slides,
              slides[0],
            ];
            setDisplaySlides(modifiedSlides);
          }
        }
      } catch (error) {
        console.error('Error loading remote config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBannerSlides();
  }, []);

  useEffect(() => {
    if (displaySlides.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: 0,
        animated: false,
      });
      setCurrentIndex(0);
    }
  }, [displaySlides]);

  useEffect(() => {
    if (displaySlides.length === 0 || loading) return;

    timerRef.current = setInterval(() => {
      if (scrolling.current) return;

      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({index: nextIndex, animated: true});
      setCurrentIndex(nextIndex);
    }, AUTO_SLIDE_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (scrolling.current) return;

    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SLIDE_WIDTH);

    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SLIDE_WIDTH);

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

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        const nextIndex = currentIndex + 1;
        flatListRef.current?.scrollToIndex({index: nextIndex, animated: true});
        setCurrentIndex(nextIndex);
      }, AUTO_SLIDE_INTERVAL);
    }

    scrolling.current = false;
  };

  const getAdjustedIndicatorIndex = () => {
    if (displaySlides.length === 0) return 0;

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
          initialScrollIndex={0}
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
      <RenderIndicator
        slides={originalSlides}
        currentIndex={getAdjustedIndicatorIndex()}
      />
    </View>
  );
};

export default Banner;
