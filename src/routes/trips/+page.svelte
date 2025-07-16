<script lang="ts">
import { goto } from '$app/navigation';
import { supabase } from '$lib/supabaseClient';

export let data: { user?: { email?: string } };

let destination = '';
let startDate = '';
let endDate = '';
let notes = '';
let useAI = false;
let isLoading = false;
let errorMsg = '';

async function handleSubmit(e: Event) {
  e.preventDefault();
  if (!data.user) {
    goto('/auth');
    return;
  }

  isLoading = true;
  errorMsg = '';

  try {
    // Save trip to Supabase
    const { data: trip, error } = await supabase
      .from('trips')
      .insert({
        user_id: data.user.email,
        destination,
        start_date: startDate,
        end_date: endDate,
        notes,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      errorMsg = error.message;
    } else {
      goto('/');
    }
  } catch (err) {
    errorMsg = 'Failed to create trip. Please try again.';
  } finally {
    isLoading = false;
  }
}

async function generateAISuggestion() {
  if (!destination.trim()) {
    errorMsg = 'Please enter a destination first.';
    return;
  }

  isLoading = true;
  errorMsg = '';

  try {
    // TODO: Replace with actual AI integration (Ollama/Qwen3)
    const response = await fetch('/api/ai-suggestion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination })
    });

    if (response.ok) {
      const suggestion = await response.json();
      notes = suggestion.notes || '';
      startDate = suggestion.startDate || '';
      endDate = suggestion.endDate || '';
    } else {
      errorMsg = 'AI suggestion failed. Please fill in manually.';
    }
  } catch (err) {
    errorMsg = 'AI service unavailable. Please fill in manually.';
  } finally {
    isLoading = false;
  }
}
</script>

<div class="min-h-screen bg-gray-50 py-8">
  <div class="max-w-2xl mx-auto px-4">
    <div class="bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold mb-6">Create New Trip</h1>
      
      <form on:submit={handleSubmit} class="space-y-6">
        <div>
          <label for="destination" class="block text-sm font-medium text-gray-700 mb-2">
            Destination *
          </label>
          <input
            id="destination"
            type="text"
            bind:value={destination}
            required
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Tokyo, Japan"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="startDate" class="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              id="startDate"
              type="date"
              bind:value={startDate}
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label for="endDate" class="block text-sm font-medium text-gray-700 mb-2">
              End Date *
            </label>
            <input
              id="endDate"
              type="date"
              bind:value={endDate}
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            bind:value={notes}
            rows="4"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add notes about your trip..."
          />
        </div>

        <div class="flex items-center space-x-4">
          <label class="flex items-center">
            <input
              type="checkbox"
              bind:checked={useAI}
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">Use AI suggestions</span>
          </label>
          {#if useAI && destination}
            <button
              type="button"
              on:click={generateAISuggestion}
              disabled={isLoading}
              class="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              Generate AI Suggestion
            </button>
          {/if}
        </div>

        {#if errorMsg}
          <div class="text-red-500 text-sm">{errorMsg}</div>
        {/if}

        <div class="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {isLoading ? 'Creating...' : 'Create Trip'}
          </button>
          <button
            type="button"
            on:click={() => goto('/')}
            class="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</div> 