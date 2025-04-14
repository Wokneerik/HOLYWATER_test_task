import remoteConfig from '@react-native-firebase/remote-config';
import {useEffect, useState} from 'react';
import {Slide} from '../types';

interface UseBannerSlidesProps {
  remoteConfigKey: string;
}

function useBannerSlides({remoteConfigKey}: UseBannerSlidesProps) {
  const [originalSlides, setOriginalSlides] = useState<Slide[]>([]);
  const [displaySlides, setDisplaySlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBannerSlides = async () => {
      setLoading(true);
      setError(null);
      try {
        await remoteConfig().setDefaults({
          [remoteConfigKey]: JSON.stringify({top_banner_slides: []}),
        });

        await remoteConfig().setConfigSettings({
          minimumFetchIntervalMillis: 0,
        });

        await remoteConfig().fetchAndActivate();
        const jsonDataString = remoteConfig()
          .getValue(remoteConfigKey)
          .asString();
        const json = JSON.parse(jsonDataString);

        if (json && json.top_banner_slides) {
          const slides = json.top_banner_slides;
          setOriginalSlides(slides);

          if (slides.length > 0) {
            if (slides.length === 1) {
              setDisplaySlides(slides);
            } else {
              const modifiedSlides = [
                slides[slides.length - 1],
                ...slides,
                slides[0],
              ];
              setDisplaySlides(modifiedSlides);
            }
          } else {
            setDisplaySlides([]);
          }
        } else {
          setDisplaySlides([]);
          setError(new Error('Invalid data structure for banner slides'));
        }
      } catch (err: any) {
        setError(err);
        console.error('Error loading banner slides:', err);
        setDisplaySlides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBannerSlides();
  }, [remoteConfigKey]);

  return {originalSlides, displaySlides, loading, error};
}

export default useBannerSlides;
