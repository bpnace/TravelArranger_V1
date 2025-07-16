import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const { destination } = await request.json();

  // TODO: Replace with actual AI integration (Ollama/Qwen3)
  // For now, return mock suggestions based on destination
  const suggestions = {
    'Tokyo': {
      notes: 'Visit Senso-ji Temple, explore Shibuya Crossing, try authentic ramen, visit Tsukiji Outer Market for sushi, see cherry blossoms in spring.',
      startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]  // 7 days later
    },
    'Paris': {
      notes: 'Visit Eiffel Tower, explore Louvre Museum, walk along Champs-Élysées, visit Notre-Dame Cathedral, enjoy French cuisine.',
      startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 52 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    'New York': {
      notes: 'Visit Times Square, explore Central Park, see Statue of Liberty, visit Metropolitan Museum of Art, walk Brooklyn Bridge.',
      startDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  };

  const suggestion = suggestions[destination as keyof typeof suggestions] || {
    notes: `Explore ${destination}, visit local attractions, try local cuisine, and immerse yourself in the culture.`,
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  };

  return json(suggestion);
}; 