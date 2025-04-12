import remoteConfig from '@react-native-firebase/remote-config';
import React, {FC, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {Book} from '../../types';
import styles from './styles';

interface SummaryProps {
  initialBookId: number;
}

const Summary: FC<SummaryProps> = ({initialBookId}) => {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDetailedBook = async () => {
      setLoading(true);
      setError(null);
      try {
        await remoteConfig().setDefaults({
          json_data: JSON.stringify({books: []}),
        });
        await remoteConfig().setConfigSettings({
          minimumFetchIntervalMillis: 0,
        });
        await remoteConfig().fetchAndActivate();
        const jsonDataString = remoteConfig().getValue('json_data').asString();
        const json = JSON.parse(jsonDataString);

        if (json && Array.isArray(json.books)) {
          const foundBook = json.books.find(b => b.id === initialBookId);
          setBook(foundBook || null);
        } else {
          setError(new Error('Failed to load book data'));
        }
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedBook();
  }, [initialBookId]);

  if (loading) {
    return <Text style={styles.loadingText}>Loading summary...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>Error loading summary</Text>;
  }

  if (!book) {
    return <Text style={styles.noBookText}>Book details not found</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>{book.views}</Text>
          <Text style={styles.infoLabel}>Views</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>{book.likes}</Text>
          <Text style={styles.infoLabel}>Likes</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>{book.quotes}</Text>
          <Text style={styles.infoLabel}>Quotes</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>{book.genre}</Text>
          <Text style={styles.infoLabel}>Genre</Text>
        </View>
      </View>
      <View style={styles.separator} />
      <View style={styles.summaryBlock}>
        <Text style={styles.title}>Summary</Text>
        <Text style={styles.summaryText}>{book.summary}</Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.summaryBlock}>
        <Text style={styles.title}>You will also like</Text>
      </View>
    </View>
  );
};

export default Summary;
