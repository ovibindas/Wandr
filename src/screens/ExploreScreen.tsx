import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { usePlaces } from '../hooks/usePlaces';
import { Place, PlaceCategory } from '../lib/types';

const CATEGORIES: PlaceCategory[] = [
  'restaurant', 'cafe', 'bar', 'hotel', 'attraction', 'shop', 'park', 'museum',
];

const PRICE_LABELS = ['', '$', '$$', '$$$', '$$$$'];

function PlaceCard({ place }: { place: Place }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardName} numberOfLines={1}>{place.name}</Text>
        <Text style={styles.cardPrice}>{PRICE_LABELS[place.price_level]}</Text>
      </View>
      <Text style={styles.cardCategory}>{place.category}</Text>
      {place.description ? (
        <Text style={styles.cardDescription} numberOfLines={2}>{place.description}</Text>
      ) : null}
      <View style={styles.cardFooter}>
        <Text style={styles.cardRating}>★ {place.rating_avg.toFixed(1)} ({place.rating_count})</Text>
        {place.distance_km != null && (
          <Text style={styles.cardDistance}>{place.distance_km.toFixed(1)} km away</Text>
        )}
        {place.score != null && (
          <Text style={styles.cardScore}>Score: {place.score.toFixed(0)}</Text>
        )}
      </View>
    </View>
  );
}

export default function ExploreScreen() {
  const { places, loading, error, fetchPlaces } = usePlaces();
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | undefined>();

  // Default to London city centre for demo
  const latitude = 51.5074;
  const longitude = -0.1278;

  useEffect(() => {
    fetchPlaces({ latitude, longitude, category: selectedCategory });
  }, [selectedCategory]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Explore</Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={CATEGORIES}
        keyExtractor={(item) => item}
        style={styles.categoryList}
        contentContainerStyle={styles.categoryContent}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.chip, selectedCategory === item && styles.chipActive]}
            onPress={() => setSelectedCategory(selectedCategory === item ? undefined : item)}
          >
            <Text style={[styles.chipText, selectedCategory === item && styles.chipTextActive]}>
              {item}
            </Text>
          </Pressable>
        )}
      />

      {loading && <ActivityIndicator style={styles.loader} size="large" color="#6366f1" />}
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <PlaceCard place={item} />}
        ListEmptyComponent={!loading ? <Text style={styles.empty}>No places found nearby.</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  heading: { fontSize: 28, fontWeight: '800', color: '#1e293b', paddingHorizontal: 16, paddingTop: 16 },
  categoryList: { maxHeight: 56, marginTop: 12 },
  categoryContent: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
  },
  chipActive: { backgroundColor: '#6366f1' },
  chipText: { color: '#64748b', fontSize: 13, fontWeight: '500', textTransform: 'capitalize' },
  chipTextActive: { color: '#fff' },
  loader: { marginTop: 40 },
  error: { color: '#ef4444', textAlign: 'center', marginTop: 16 },
  list: { padding: 16, gap: 12 },
  empty: { textAlign: 'center', color: '#94a3b8', marginTop: 40, fontSize: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardName: { fontSize: 17, fontWeight: '700', color: '#1e293b', flex: 1 },
  cardPrice: { fontSize: 14, color: '#64748b', marginLeft: 8 },
  cardCategory: { fontSize: 12, color: '#6366f1', textTransform: 'capitalize', marginTop: 2, fontWeight: '600' },
  cardDescription: { fontSize: 13, color: '#64748b', marginTop: 6, lineHeight: 18 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  cardRating: { fontSize: 13, color: '#f59e0b', fontWeight: '600' },
  cardDistance: { fontSize: 13, color: '#94a3b8' },
  cardScore: { fontSize: 13, color: '#10b981', fontWeight: '600' },
});
