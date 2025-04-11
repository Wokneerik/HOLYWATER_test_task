import remoteConfig from '@react-native-firebase/remote-config';
import React, {FC, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
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
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
          setSlides(json.top_banner_slides);
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
    if (slides.length === 0 || loading) return;

    timerRef.current = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slides.length;
      flatListRef.current?.scrollToIndex({index: nextIndex, animated: true});
      setCurrentIndex(nextIndex);
    }, AUTO_SLIDE_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, slides, loading]);

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SLIDE_WIDTH);
    setCurrentIndex(index);
  };

  return (
    <View style={{position: 'relative'}}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : slides && slides.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={slides}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => <BannerItem item={item} />}
          horizontal
          pagingEnabled
          snapToInterval={SLIDE_WIDTH}
          snapToAlignment="center"
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          contentContainerStyle={{
            // This ensures consistent width across all items
            alignItems: 'center',
          }}
          getItemLayout={(_, index) => ({
            // This helps with precise scrolling
            length: SLIDE_WIDTH,
            offset: SLIDE_WIDTH * index,
            index,
          })}
        />
      ) : (
        <Text style={{padding: 20, color: 'white'}}>No slides available</Text>
      )}
      <RenderIndicator slides={slides} currentIndex={currentIndex} />
    </View>
  );
};

export default Banner;
