<script lang="ts">
import { onMount } from 'svelte';
import { format } from 'date-fns';

export let data: { user?: { email?: string } };

interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  notes?: string;
  imageUrl?: string;
  isPast: boolean;
  totalDays: number;
  year: number;
}

let pastTrips: Trip[] = [];
let filteredTrips: Trip[] = [];
let searchTerm = '';
let selectedYear = 'all';
let selectedDestination = 'all';
let isLoading = false;

// Mock data - replace with Supabase fetch
const mockTrips: Trip[] = [
  {
    id: '1',
    destination: 'Paris, France',
    startDate: '2023-05-10',
    endDate: '2023-05-20',
    notes: 'Eiffel Tower visit, Louvre Museum, amazing croissants',
    imageUrl: 'https://flagcdn.com/w320/fr.png',
    isPast: true,
    totalDays: 10,
    year: 2023
  },
  {
    id: '2',
    destination: 'New York, USA',
    startDate: '2023-08-15',
    endDate: '2023-08-22',
    notes: 'Times Square, Central Park, Broadway show',
    imageUrl: 'https://flagcdn.com/w320/us.png',
    isPast: true,
    totalDays: 7,
    year: 2023
  },
  {
    id: '3',
    destination: 'Barcelona, Spain',
    startDate: '2022-09-05',
    endDate: '2022-09-12',
    notes: 'Sagrada Familia, La Rambla, tapas tour',
    imageUrl: 'https://flagcdn.com/w320/es.png',
    isPast: true,
    totalDays: 7,
    year: 2022
  }
];

onMount(() => {
  if (!data.user) {
    return;
  }
  
  pastTrips = mockTrips;
  filteredTrips = pastTrips;
});

function filterTrips() {
  let filtered = pastTrips;

  // Filter by search term
  if (searchTerm) {
    filtered = filtered.filter(trip => 
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Filter by year
  if (selectedYear !== 'all') {
    filtered = filtered.filter(trip => trip.year.toString() === selectedYear);
  }

  // Filter by destination
  if (selectedDestination !== 'all') {
    filtered = filtered.filter(trip => trip.destination.includes(selectedDestination));
  }

  filteredTrips = filtered;
}

function getUniqueYears() {
  const years = [...new Set(pastTrips.map(trip => trip.year))];
  return years.sort((a, b) => b - a);
}

function getUniqueDestinations() {
  const destinations = [...new Set(pastTrips.map(trip => trip.destination.split(',')[0]))];
  return destinations.sort();
}

function getTotalDays() {
  return filteredTrips.reduce((total, trip) => total + trip.totalDays, 0);
}

function getAverageTripLength() {
  if (filteredTrips.length === 0) return 0;
  return Math.round(getTotalDays() / filteredTrips.length);
}

function getMostVisitedDestination() {
  const destinationCounts: { [key: string]: number } = {};
  filteredTrips.forEach(trip => {
    const country = trip.destination.split(',')[1]?.trim() || trip.destination;
    destinationCounts[country] = (destinationCounts[country] || 0) + 1;
  });
  
  const maxCount = Math.max(...Object.values(destinationCounts));
  return Object.keys(destinationCounts).find(key => destinationCounts[key] === maxCount) || 'None';
}

$: {
  filterTrips();
}
</script>

<div class="min-h-screen bg-gray-50 py-8">
  <div class="max-w-6xl mx-auto px-4">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h1 class="text-3xl font-bold mb-2">Trip History</h1>
      <p class="text-gray-600">Explore your travel memories and statistics</p>
    </div>

    <!-- Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-2xl font-bold text-blue-600">{filteredTrips.length}</div>
        <div class="text-sm text-gray-600">Total Trips</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-2xl font-bold text-green-600">{getTotalDays()}</div>
        <div class="text-sm text-gray-600">Days Traveled</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-2xl font-bold text-purple-600">{getAverageTripLength()}</div>
        <div class="text-sm text-gray-600">Avg. Trip Length</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-2xl font-bold text-orange-600">{getMostVisitedDestination()}</div>
        <div class="text-sm text-gray-600">Most Visited</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Filters</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            type="text"
            bind:value={searchTerm}
            placeholder="Search destinations or notes..."
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Year</label>
          <select
            bind:value={selectedYear}
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Years</option>
            {#each getUniqueYears() as year}
              <option value={year}>{year}</option>
            {/each}
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Destination</label>
          <select
            bind:value={selectedDestination}
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Destinations</option>
            {#each getUniqueDestinations() as destination}
              <option value={destination}>{destination}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>

    <!-- Trip List -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b">
        <h2 class="text-lg font-semibold">Past Trips ({filteredTrips.length})</h2>
      </div>
      
      {#if filteredTrips.length === 0}
        <div class="p-8 text-center">
          <div class="text-gray-400 text-6xl mb-4">✈️</div>
          <h3 class="text-lg font-semibold text-gray-600 mb-2">No trips found</h3>
          <p class="text-gray-500">Try adjusting your filters or add some trips!</p>
        </div>
      {:else}
        <div class="divide-y">
          {#each filteredTrips as trip}
            <div class="p-6 hover:bg-gray-50 transition">
              <div class="flex items-center space-x-4">
                <img src={trip.imageUrl} alt={trip.destination} class="w-16 h-16 rounded-lg object-cover" />
                <div class="flex-1">
                  <h3 class="text-lg font-semibold">{trip.destination}</h3>
                  <p class="text-sm text-gray-600">
                    {format(new Date(trip.startDate), 'MMM dd, yyyy')} - {format(new Date(trip.endDate), 'MMM dd, yyyy')}
                    <span class="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {trip.totalDays} days
                    </span>
                  </p>
                  {#if trip.notes}
                    <p class="text-sm text-gray-500 mt-1">{trip.notes}</p>
                  {/if}
                </div>
                <div class="text-right">
                  <div class="text-sm text-gray-500">{trip.year}</div>
                  <button class="text-blue-600 hover:text-blue-800 text-sm">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Export Options -->
    <div class="bg-white rounded-lg shadow p-6 mt-6">
      <h2 class="text-lg font-semibold mb-4">Export Your History</h2>
      <div class="flex space-x-4">
        <button class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
          Export to PDF
        </button>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          Export to CSV
        </button>
        <button class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition">
          Share on Social
        </button>
      </div>
    </div>
  </div>
</div> 