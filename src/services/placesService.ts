import { Lead } from '@/src/data/mock';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

interface PlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
  business_status?: string;
  website?: string;
  international_phone_number?: string;
}

interface TextSearchResponse {
  results: PlaceResult[];
  next_page_token?: string;
  status: string;
}

function scoreFromRating(rating?: number, totalRatings?: number): number {
  if (!rating) return 50;
  // Higher rating + more reviews = better fit score
  const ratingScore = (rating / 5) * 60;
  const popularityScore = Math.min((totalRatings ?? 0) / 200, 1) * 40;
  return Math.round(ratingScore + popularityScore);
}

function intentScoreFromTypes(types: string[] = []): number {
  const highIntent = ['establishment', 'point_of_interest', 'store', 'food', 'gym', 'health'];
  const matches = types.filter(t => highIntent.includes(t)).length;
  return Math.min(30 + matches * 15, 85);
}

function placeToPainPoint(types: string[] = []): string {
  if (types.includes('gym') || types.includes('sports_complex')) return 'Gestión de socios y reservas';
  if (types.includes('restaurant') || types.includes('food')) return 'Captación de clientes recurrentes';
  if (types.includes('health') || types.includes('doctor')) return 'Agenda y seguimiento de pacientes';
  if (types.includes('beauty_salon') || types.includes('spa')) return 'Fidelización de clientes';
  if (types.includes('store') || types.includes('shopping_mall')) return 'Conversión de visitas en ventas';
  return 'Prospección y captación de nuevos clientes';
}

async function fetchPage(query: string, pageToken?: string): Promise<TextSearchResponse> {
  const params = new URLSearchParams({
    query,
    key: API_KEY,
    language: 'es',
  });
  if (pageToken) params.set('pagetoken', pageToken);

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`
  );
  if (!res.ok) throw new Error(`Places API error: ${res.status}`);
  return res.json();
}

export async function searchPlaces(keyword: string, location: string, maxResults = 60): Promise<Lead[]> {
  if (!API_KEY) throw new Error('VITE_GOOGLE_MAPS_API_KEY no configurada');

  const query = `${keyword} en ${location}`;
  const leads: Lead[] = [];
  let pageToken: string | undefined;
  let page = 0;

  do {
    // Google requires a short delay before using next_page_token
    if (pageToken) await new Promise(r => setTimeout(r, 2000));

    const data = await fetchPage(query, pageToken);

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Places API: ${data.status}`);
    }

    for (const place of data.results) {
      if (place.business_status === 'CLOSED_PERMANENTLY') continue;

      leads.push({
        id: `gm_${place.place_id}`,
        name: 'Responsable / Gerencia',
        title: 'Decisor',
        company: place.name,
        linkedin: place.formatted_address,
        email: '',
        fitScore: scoreFromRating(place.rating, place.user_ratings_total),
        intentScore: intentScoreFromTypes(place.types),
        status: 'Nuevo',
        painPoint: placeToPainPoint(place.types ?? []),
        lastAction: `Extraído de Google Maps · ${place.rating ? `⭐ ${place.rating} (${place.user_ratings_total ?? 0})` : 'Sin valoraciones'}`,
      });
    }

    pageToken = data.next_page_token;
    page++;
  } while (pageToken && leads.length < maxResults && page < 3);

  return leads;
}
