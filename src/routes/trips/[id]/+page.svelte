<script lang="ts">
import { goto } from '$app/navigation';
import { format } from 'date-fns';

export let data: { user?: { email?: string } };

// Mock trip data - replace with Supabase fetch
const trip = {
  id: '1',
  destination: 'Tokyo, Japan',
  startDate: '2024-08-01',
  endDate: '2024-08-10',
  notes: 'Visit Senso-ji Temple, explore Shibuya Crossing, try authentic ramen, visit Tsukiji Outer Market for sushi, see cherry blossoms in spring.',
  imageUrl: 'https://flagcdn.com/w320/jp.png',
  createdAt: '2024-01-15T10:30:00Z',
  isPast: false
};

function formatDate(dateString: string) {
  return format(new Date(dateString), 'MMM dd, yyyy');
}

function getDaysBetween(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
</script>

<div class="min-h-screen bg-gray-50 py-8">
  <div class="max-w-4xl mx-auto px-4">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-4">
          <img src={trip.imageUrl} alt={trip.destination} class="w-16 h-16 rounded-lg object-cover" />
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{trip.destination}</h1>
            <p class="text-gray-600">
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              <span class="ml-2 text-sm text-gray-500">
                ({getDaysBetween(trip.startDate, trip.endDate)} days)
              </span>
            </p>
          </div>
        </div>
        <div class="flex space-x-2">
          <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Edit Trip
          </button>
          <button class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
            Delete
          </button>
        </div>
      </div>
      
      {#if trip.notes}
        <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 class="font-semibold text-blue-900 mb-2">Trip Notes</h3>
          <p class="text-blue-800">{trip.notes}</p>
        </div>
      {/if}
    </div>

    <!-- Google Maps Placeholder -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Trip Route</h2>
      <div class="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
        <div class="text-center">
          <div class="text-gray-500 mb-2">🗺️</div>
          <p class="text-gray-600">Google Maps integration coming soon</p>
          <p class="text-sm text-gray-500">Route visualization and location tracking</p>
        </div>
      </div>
    </div>

    <!-- Trip Details Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Packing List -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Packing List</h2>
          <a href="/trips/{trip.id}/packing" class="text-blue-600 hover:text-blue-800 text-sm">View Full List →</a>
        </div>
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <input type="checkbox" class="rounded" />
            <span class="text-sm">Passport</span>
          </div>
          <div class="flex items-center space-x-2">
            <input type="checkbox" class="rounded" />
            <span class="text-sm">Travel adapter</span>
          </div>
          <div class="flex items-center space-x-2">
            <input type="checkbox" class="rounded" />
            <span class="text-sm">Comfortable walking shoes</span>
          </div>
          <div class="flex items-center space-x-2">
            <input type="checkbox" class="rounded" />
            <span class="text-sm">Camera</span>
          </div>
        </div>
        <a href="/trips/{trip.id}/packing" class="mt-4 text-blue-600 hover:text-blue-800 text-sm block">
          Generate AI Packing List →
        </a>
      </div>

      <!-- Trip Timeline -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Trip Timeline</h2>
        <div class="space-y-4">
          <div class="flex items-start space-x-3">
            <div class="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div>
              <p class="font-medium">Day 1 - Arrival</p>
              <p class="text-sm text-gray-600">Check into hotel, explore local area</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <div class="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div>
              <p class="font-medium">Day 2 - Sightseeing</p>
              <p class="text-sm text-gray-600">Visit major attractions</p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <div class="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div>
              <p class="font-medium">Day 3 - Cultural Experience</p>
              <p class="text-sm text-gray-600">Local cuisine and traditions</p>
            </div>
          </div>
        </div>
        <button class="mt-4 text-blue-600 hover:text-blue-800 text-sm">
          Generate AI Timeline →
        </button>
      </div>
    </div>

    <!-- Collaboration Section -->
    <div class="bg-white rounded-lg shadow p-6 mt-6">
      <h2 class="text-xl font-semibold mb-4">Collaboration</h2>
      <div class="flex items-center space-x-4">
        <div class="flex -space-x-2">
          <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
            {data.user?.email?.charAt(0).toUpperCase()}
          </div>
        </div>
        <button class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
          <a href="/trips/{trip.id}/invite">Invite Friends</a>
        </button>
        <span class="text-sm text-gray-500">Share this trip with friends and family</span>
      </div>
    </div>
  </div>
</div> 