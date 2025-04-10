import remoteConfig from '@react-native-firebase/remote-config';
import React, {FC, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Image, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './styles';

interface Slide {
  id: number;
  book_id: number;
  cover: string;
}

const MainScreen: FC = () => {
  const [slides, setSlides] = useState<Slide[] | null>(null);
  const [loading, setLoading] = useState(true);

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
        console.log('✅ Remote config activated');

        const jsonDataString = remoteConfig().getValue('json_data').asString();
        console.log('📦 Raw json_data:', jsonDataString);

        const json = JSON.parse(jsonDataString);

        if (json && json.top_banner_slides) {
          setSlides(json.top_banner_slides);
          console.log('🎯 Slides set:', json.top_banner_slides);
        } else {
          console.log('⚠️ No slides found in config');
          setSlides(null);
        }
      } catch (error) {
        console.error('❌ Error loading remote config:', error);
        setSlides(null);
      } finally {
        setLoading(false);
        console.log('🛑 Finished loading');
      }
    };

    fetchBannerSlides();
  }, []);

  const renderItem = ({item}: {item: Slide}) => (
    <View style={{marginRight: 10}}>
      <Image
        source={{uri: item.cover}}
        style={{width: 300, height: 150, borderRadius: 10}}
      />
      <Text style={{textAlign: 'center', marginTop: 5}}>
        Book ID: {item.book_id}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Library</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : slides && slides.length > 0 ? (
        <FlatList
          horizontal
          data={slides}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{padding: 10}}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <Text style={{padding: 20, color: 'white'}}>No slides available</Text>
      )}
    </SafeAreaView>
  );
};

export default MainScreen;
