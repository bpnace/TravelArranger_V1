<script lang="ts">
import { supabase } from '$lib/supabaseClient';
import { goto } from '$app/navigation';

export let data: { user?: { email?: string } };

async function handleLogout() {
  await supabase.auth.signOut();
  goto('/auth');
}
</script>

<style global src="../lib/tailwind.css"></style>

{#if data.user}
  <nav class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <h1 class="text-xl font-semibold text-gray-900">Travel Planner</h1>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-700">{data.user?.email}</span>
          <a href="/history" class="text-blue-600 hover:text-blue-800 text-sm">History</a>
          <button 
            on:click={handleLogout}
            class="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
{/if}

<main>
  <slot />
</main> 