import remoteConfig from '@react-native-firebase/remote-config';
import {useEffect, useState} from 'react';
import {Book} from '../types';

interface GenreGroup {
  genre: string;
  books: Book[];
}

interface UseGroupedRemoteConfigDataProps {
  remoteConfigKey: string;
}

function useGroupedRemoteConfigData({
  remoteConfigKey,
}: UseGroupedRemoteConfigDataProps) {
  const [groupedBooks, setGroupedBooks] = useState<GenreGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAndGroupData = async () => {
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

        if (json && json.books) {
          const books: Book[] = json.books;
          const grouped: {[key: string]: Book[]} = {};
          books.forEach(book => {
            if (grouped[book.genre]) {
              grouped[book.genre].push(book);
            } else {
              grouped[book.genre] = [book];
            }
          });

          const groupedArray: GenreGroup[] = Object.keys(grouped).map(
            genre => ({
              genre,
              books: grouped[genre],
            }),
          );
          setGroupedBooks(groupedArray);
        } else {
          setError(new Error('Invalid data structure in Remote Config'));
          setGroupedBooks([]);
        }
      } catch (err: any) {
        setError(err);
        console.error('Error fetching and grouping remote config:', err);
        setGroupedBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndGroupData();
  }, [remoteConfigKey]);

  return {groupedBooks, loading, error};
}

export default useGroupedRemoteConfigData;
