import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { data: { user } } = await locals.supabase.auth.getUser();
  
  if (!user) {
    return { user: null, trips: [] };
  }

  try {
    // Fetch trips from Supabase
    const { data: trips, error } = await locals.supabase
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Error fetching trips:', error);
      return { user, trips: [] };
    }

    // Process trips to add computed fields
    const processedTrips = trips?.map(trip => ({
      ...trip,
      isPast: new Date(trip.end_date) < new Date(),
      imageUrl: `https://flagcdn.com/w320/${getCountryCode(trip.destination)}.png`
    })) || [];

    return {
      user,
      trips: processedTrips
    };
  } catch (error) {
    console.error('Error in page load:', error);
    return { user, trips: [] };
  }
};

// Helper function to get country code from destination
function getCountryCode(destination: string): string {
  const countryMap: { [key: string]: string } = {
    'Tokyo': 'jp',
    'Japan': 'jp',
    'Paris': 'fr',
    'France': 'fr',
    'New York': 'us',
    'USA': 'us',
    'Barcelona': 'es',
    'Spain': 'es',
    'London': 'gb',
    'UK': 'gb',
    'Rome': 'it',
    'Italy': 'it',
    'Berlin': 'de',
    'Germany': 'de',
    'Amsterdam': 'nl',
    'Netherlands': 'nl',
    'Sydney': 'au',
    'Australia': 'au',
    'Toronto': 'ca',
    'Canada': 'ca'
  };

  for (const [key, code] of Object.entries(countryMap)) {
    if (destination.toLowerCase().includes(key.toLowerCase())) {
      return code;
    }
  }

  return 'un'; // Default to UN flag
} 