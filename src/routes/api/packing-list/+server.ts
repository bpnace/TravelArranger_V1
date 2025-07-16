import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { destination, startDate, endDate, tripType = 'general' } = await request.json();

  // TODO: Replace with actual AI integration (Ollama/Qwen3)
  // For now, return smart packing suggestions based on destination and duration
  const packingLists = {
    'Tokyo': {
      essentials: ['Passport', 'Travel adapter (Type A/B)', 'Comfortable walking shoes', 'Camera'],
      clothing: ['Light layers', 'Rain jacket', 'Comfortable socks', 'Hat for sun protection'],
      electronics: ['Phone charger', 'Power bank', 'Universal adapter', 'Camera/Phone for photos'],
      toiletries: ['Toothbrush/toothpaste', 'Deodorant', 'Sunscreen', 'Hand sanitizer'],
      documents: ['Passport', 'Travel insurance', 'Hotel confirmations', 'Emergency contacts']
    },
    'Paris': {
      essentials: ['Passport', 'Travel adapter (Type E)', 'Comfortable walking shoes', 'Camera'],
      clothing: ['Stylish casual wear', 'Light jacket', 'Comfortable shoes', 'Scarf for fashion'],
      electronics: ['Phone charger', 'Power bank', 'Universal adapter', 'Camera'],
      toiletries: ['Toothbrush/toothpaste', 'Deodorant', 'Perfume/cologne', 'Hand sanitizer'],
      documents: ['Passport', 'Travel insurance', 'Hotel confirmations', 'Emergency contacts']
    },
    'New York': {
      essentials: ['ID/Passport', 'Comfortable walking shoes', 'Camera', 'Metro card'],
      clothing: ['Layers for changing weather', 'Comfortable walking shoes', 'Rain jacket', 'Warm layers'],
      electronics: ['Phone charger', 'Power bank', 'Camera', 'Portable WiFi'],
      toiletries: ['Toothbrush/toothpaste', 'Deodorant', 'Sunscreen', 'Hand sanitizer'],
      documents: ['ID/Passport', 'Travel insurance', 'Hotel confirmations', 'Emergency contacts']
    }
  };

  const duration = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
  const isLongTrip = duration > 7;
  const isShortTrip = duration <= 3;

  const baseList = packingLists[destination as keyof typeof packingLists] || {
    essentials: ['Passport', 'Travel adapter', 'Comfortable shoes', 'Camera'],
    clothing: ['Weather-appropriate clothing', 'Comfortable walking shoes', 'Light jacket'],
    electronics: ['Phone charger', 'Power bank', 'Camera'],
    toiletries: ['Toothbrush/toothpaste', 'Deodorant', 'Sunscreen', 'Hand sanitizer'],
    documents: ['Passport', 'Travel insurance', 'Hotel confirmations', 'Emergency contacts']
  };

  // Add duration-specific items
  if (isLongTrip) {
    baseList.clothing.push('Extra underwear and socks', 'Laundry supplies');
    baseList.electronics.push('Laptop/tablet', 'Extra memory cards');
  }

  if (isShortTrip) {
    baseList.essentials = baseList.essentials.filter(item => !item.includes('adapter'));
  }

  // Add trip type specific items
  if (tripType === 'business') {
    baseList.clothing.push('Business attire', 'Dress shoes', 'Blazer/jacket');
    baseList.electronics.push('Laptop', 'Business cards', 'Portfolio');
  } else if (tripType === 'beach') {
    baseList.clothing.push('Swimsuit', 'Beach towel', 'Sunglasses', 'Beach hat');
    baseList.essentials.push('Sunscreen', 'Beach bag', 'Water bottle');
  } else if (tripType === 'hiking') {
    baseList.clothing.push('Hiking boots', 'Moisture-wicking clothes', 'Hiking socks');
    baseList.essentials.push('Water bottle', 'First aid kit', 'Hiking poles');
  }

  return json({
    categories: baseList,
    duration,
    tripType,
    destination
  });
}; 