import remoteConfig from '@react-native-firebase/remote-config';
import {useEffect, useRef, useState} from 'react';
import {Book} from '../types';

interface UseRecommendedBooksProps {
  remoteConfigKey: string;
}

function useRecommendedBooks({remoteConfigKey}: UseRecommendedBooksProps) {
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [errorRecommendations, setErrorRecommendations] =
    useState<Error | null>(null);
  const hasFetched = useRef(false); // Track if fetched

  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      if (hasFetched.current) {
        return; // Don't fetch again
      }

      setLoadingRecommendations(true);
      setErrorRecommendations(null);

      try {
        await remoteConfig().setDefaults({
          [remoteConfigKey]: JSON.stringify({
            books: [],
            you_will_like_section: [],
          }),
        });
        await remoteConfig().setConfigSettings({
          minimumFetchIntervalMillis: 0,
        });
        await remoteConfig().fetchAndActivate();
        const jsonDataString = remoteConfig()
          .getValue(remoteConfigKey)
          .asString();
        const json = JSON.parse(jsonDataString);

        if (
          json &&
          Array.isArray(json.books) &&
          Array.isArray(json.you_will_like_section)
        ) {
          const recommendedIds = json.you_will_like_section;
          const relatedBooks = json.books.filter((b: any) =>
            recommendedIds.includes(b.id),
          );
          setRecommendedBooks(relatedBooks);
          hasFetched.current = true; // Mark as fetched
        } else {
          setRecommendedBooks([]);
          setErrorRecommendations(
            new Error('Failed to load recommendation data'),
          );
        }
      } catch (error: any) {
        setErrorRecommendations(error);
        setRecommendedBooks([]);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchRecommendedBooks();
  }, [remoteConfigKey]);

  return {recommendedBooks, loadingRecommendations, errorRecommendations};
}

export default useRecommendedBooks;
