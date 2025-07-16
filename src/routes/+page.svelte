<script lang="ts">
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get } from 'svelte/store';

// Mock trip data for demonstration
interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  notes?: string;
  imageUrl?: string;
  isPast: boolean;
}

export let data: { user?: { email?: string } };

let upcomingTrips: Trip[] = [];
let pastTrips: Trip[] = [];

onMount(() => {
  if (!data.user) {
    goto('/auth');
    return;
  }
  // Replace with Supabase fetch later
  const now = new Date();
  const trips: Trip[] = [
    {
      id: '1',
      destination: 'Tokyo',
      startDate: '2024-08-01',
      endDate: '2024-08-10',
      notes: 'See cherry blossoms',
      imageUrl: 'https://flagcdn.com/w320/jp.png',
      isPast: false
    },
    {
      id: '2',
      destination: 'Paris',
      startDate: '2023-05-10',
      endDate: '2023-05-20',
      notes: 'Eiffel Tower visit',
      imageUrl: 'https://flagcdn.com/w320/fr.png',
      isPast: true
    }
  ];
  upcomingTrips = trips.filter(t => !t.isPast);
  pastTrips = trips.filter(t => t.isPast);
});
</script>

<div class="min-h-screen bg-gray-50 flex flex-col items-center p-4">
  <div class="w-full max-w-2xl">
    <h1 class="text-2xl font-bold mb-6">Your Trips</h1>
    <div class="mb-8">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-lg font-semibold">Upcoming Trips</h2>
        <a href="#" class="text-blue-600 hover:underline text-sm">+ New Trip</a>
      </div>
      {#if upcomingTrips.length === 0}
        <div class="text-gray-500">No upcoming trips.</div>
      {:else}
        <ul class="space-y-4">
          {#each upcomingTrips as trip}
            <li class="flex items-center bg-white rounded-lg shadow p-4">
              <img src={trip.imageUrl} alt={trip.destination} class="w-12 h-12 rounded mr-4 object-cover" />
              <div class="flex-1">
                <div class="font-semibold">{trip.destination}</div>
                <div class="text-sm text-gray-500">{trip.startDate} - {trip.endDate}</div>
                <div class="text-xs text-gray-400">{trip.notes}</div>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
    <div>
      <h2 class="text-lg font-semibold mb-2">Past Trips</h2>
      {#if pastTrips.length === 0}
        <div class="text-gray-500">No past trips.</div>
      {:else}
        <ul class="space-y-4">
          {#each pastTrips as trip}
            <li class="flex items-center bg-white rounded-lg shadow p-4 opacity-70">
              <img src={trip.imageUrl} alt={trip.destination} class="w-12 h-12 rounded mr-4 object-cover" />
              <div class="flex-1">
                <div class="font-semibold">{trip.destination}</div>
                <div class="text-sm text-gray-500">{trip.startDate} - {trip.endDate}</div>
                <div class="text-xs text-gray-400">{trip.notes}</div>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</div>
