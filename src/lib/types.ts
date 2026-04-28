export interface Place {
  id: string;
  name: string;
  description: string | null;
  category: PlaceCategory;
  latitude: number;
  longitude: number;
  address: string | null;
  city: string | null;
  country: string | null;
  rating_avg: number;
  rating_count: number;
  price_level: 1 | 2 | 3 | 4;
  is_verified: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Virtual fields returned by scoring query
  distance_km?: number;
  score?: number;
}

export type PlaceCategory =
  | 'restaurant'
  | 'cafe'
  | 'bar'
  | 'hotel'
  | 'attraction'
  | 'shop'
  | 'park'
  | 'museum'
  | 'other';

export interface GetPlacesParams {
  latitude: number;
  longitude: number;
  radius_km?: number;       // default 10
  category?: PlaceCategory;
  limit?: number;           // default 20
  offset?: number;          // default 0
}

export interface PlacesResponse {
  data: Place[];
  total: number;
}
