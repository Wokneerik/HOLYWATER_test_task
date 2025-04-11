import remoteConfig from '@react-native-firebase/remote-config';
import React, {FC, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BannerItem from '../../components/BannerItem';
import RenderIndicator from '../../components/RenderIndicator';
import {Slide} from '../../types';
import styles from './styles';

const {width} = Dimensions.get('window');
const SLIDE_WIDTH = width;
const ITEM_WIDTH = 350;
const ITEM_MARGIN = 10;
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + ITEM_MARGIN * 2;
const SCREEN_WIDTH = Dimensions.get('window').width;

const MainScreen: FC = () => {
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
    if (slides.length === 0) return;

    timerRef.current = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slides.length;
      flatListRef.current?.scrollToIndex({index: nextIndex, animated: true});
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, slides]);

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SLIDE_WIDTH);
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Library</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : slides.length > 0 ? (
        <>
          <View style={styles.bannerContainer}>
            <FlatList
              ref={flatListRef}
              data={slides}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => <BannerItem item={item} />}
              horizontal
              pagingEnabled
              snapToInterval={TOTAL_ITEM_WIDTH}
              snapToAlignment="center"
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: (SCREEN_WIDTH - ITEM_WIDTH) / 2,
              }}
              onMomentumScrollEnd={handleScroll}
            />
            <RenderIndicator slides={slides} currentIndex={currentIndex} />
          </View>
        </>
      ) : (
        <Text style={{padding: 20, color: 'white'}}>No slides available</Text>
      )}
    </SafeAreaView>
  );
};

export default MainScreen;
