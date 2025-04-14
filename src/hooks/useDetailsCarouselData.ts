import remoteConfig from '@react-native-firebase/remote-config';
import {useEffect, useState} from 'react';
import {Book} from '../types';

interface UseDetailsCarouselDataProps {
  remoteConfigKey: string;
  initialBookId?: number;
}

interface UseDetailsCarouselDataResult {
  carouselBooks: Book[];
  loading: boolean;
  error: Error | null;
  initialIndex: number;
}

function useDetailsCarouselData({
  remoteConfigKey,
  initialBookId,
}: UseDetailsCarouselDataProps): UseDetailsCarouselDataResult {
  const [carouselBooks, setCarouselBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initialIndex, setInitialIndex] = useState<number>(0);

  useEffect(() => {
    const fetchCarouselBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        await remoteConfig().setDefaults({
          [remoteConfigKey]: JSON.stringify({books: []}),
        });
        await remoteConfig().setConfigSettings({
          minimumFetchIntervalMillis: 0,
        });
        await remoteConfig().fetchAndActivate();
        const jsonDataString = remoteConfig()
          .getValue(remoteConfigKey)
          .asString();
        const json = JSON.parse(jsonDataString);

        if (json && Array.isArray(json.books)) {
          setCarouselBooks(json.books);

          if (initialBookId) {
            const index = json.books.findIndex(
              (book: Book) => book.id === initialBookId,
            );
            if (index !== -1) {
              setInitialIndex(index);
            }
          }
        } else {
          console.warn(
            `${remoteConfigKey} in Remote Config does not contain a valid "books" array.`,
          );
          setCarouselBooks([]);
        }
      } catch (err: any) {
        setError(err);
        console.error('Error fetching details carousel:', err);
        setCarouselBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselBooks();
  }, [remoteConfigKey, initialBookId]);

  return {carouselBooks, loading, error, initialIndex};
}

export default useDetailsCarouselData;
