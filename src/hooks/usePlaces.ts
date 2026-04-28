import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabase';
import { GetPlacesParams, Place, PlacesResponse } from '../lib/types';

export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaces = useCallback(async (params: GetPlacesParams) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.rpc('get_places_scored', {
        p_latitude: params.latitude,
        p_longitude: params.longitude,
        p_radius_km: params.radius_km ?? 10,
        p_category: params.category ?? null,
        p_limit: params.limit ?? 20,
        p_offset: params.offset ?? 0,
      });

      if (error) throw error;
      setPlaces(data ?? []);
    } catch (e: any) {
      setError(e.message ?? 'Failed to fetch places');
    } finally {
      setLoading(false);
    }
  }, []);

  return { places, loading, error, fetchPlaces };
}
