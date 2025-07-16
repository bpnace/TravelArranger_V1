<script lang="ts">
import { goto } from '$app/navigation';

let email = '';
let password = '';
let isGuest = false;
let errorMsg = '';
let isLoading = false;

async function handleAuth(e: Event) {
  e.preventDefault();
  isLoading = true;
  errorMsg = '';
  try {
    const res = await fetch('/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, isGuest })
    });
    const data = await res.json();
    if (data.error) {
      errorMsg = data.error;
    } else {
      goto('/');
    }
  } catch (err) {
    errorMsg = 'Something went wrong.';
  } finally {
    isLoading = false;
  }
}
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
  <form class="bg-white p-8 rounded-xl shadow w-full max-w-md space-y-4" on:submit={handleAuth}>
    <h2 class="text-xl font-bold">Sign in or Register</h2>
    <input class="border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" type="email" placeholder="Email" bind:value={email} required />
    <input class="border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" type="password" placeholder="Password" bind:value={password} required />
    <label class="flex items-center space-x-2">
      <input type="checkbox" bind:checked={isGuest} />
      <span>Guest login (no email verification)</span>
    </label>
    {#if errorMsg}
      <div class="text-red-500 text-sm">{errorMsg}</div>
    {/if}
    <button class="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition w-full" type="submit" disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Continue'}
    </button>
  </form>
</div> 