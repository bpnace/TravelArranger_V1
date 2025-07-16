<script lang="ts">
import { goto } from '$app/navigation';

export let data: { user?: { email?: string } };

let friendEmail = '';
let message = '';
let isLoading = false;
let successMessage = '';
let errorMessage = '';

// Mock trip data
const trip = {
  id: '1',
  destination: 'Tokyo, Japan',
  startDate: '2024-08-01',
  endDate: '2024-08-10'
};

async function sendInvitation(e: Event) {
  e.preventDefault();
  
  if (!friendEmail.trim()) {
    errorMessage = 'Please enter a valid email address.';
    return;
  }

  isLoading = true;
  errorMessage = '';
  successMessage = '';

  try {
    const response = await fetch('/api/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tripId: trip.id,
        friendEmail: friendEmail.trim(),
        message: message.trim()
      })
    });

    const result = await response.json();

    if (response.ok) {
      successMessage = result.message;
      friendEmail = '';
      message = '';
    } else {
      errorMessage = result.error || 'Failed to send invitation.';
    }
  } catch (err) {
    errorMessage = 'Network error. Please try again.';
  } finally {
    isLoading = false;
  }
}

function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
</script>

<div class="min-h-screen bg-gray-50 py-8">
  <div class="max-w-2xl mx-auto px-4">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h1 class="text-2xl font-bold mb-2">Invite Friends</h1>
      <p class="text-gray-600">
        Share your trip to <strong>{trip.destination}</strong> with friends and family.
      </p>
    </div>

    <!-- Invitation Form -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Send Invitation</h2>
      
      <form on:submit={sendInvitation} class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Friend's Email *
          </label>
          <input
            id="email"
            type="email"
            bind:value={friendEmail}
            required
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="friend@example.com"
          />
        </div>

        <div>
          <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
            Personal Message (Optional)
          </label>
          <textarea
            id="message"
            bind:value={message}
            rows="4"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Hey! I'm planning a trip to Tokyo and would love for you to join me..."
          />
        </div>

        {#if errorMessage}
          <div class="text-red-500 text-sm bg-red-50 border border-red-200 rounded-md p-3">
            {errorMessage}
          </div>
        {/if}

        {#if successMessage}
          <div class="text-green-500 text-sm bg-green-50 border border-green-200 rounded-md p-3">
            {successMessage}
          </div>
        {/if}

        <div class="flex space-x-4">
          <button
            type="submit"
            disabled={isLoading || !validateEmail(friendEmail)}
            class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? 'Sending...' : 'Send Invitation'}
          </button>
          <button
            type="button"
            on:click={() => goto(`/trips/${trip.id}`)}
            class="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Invitation Preview -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Invitation Preview</h2>
      <div class="bg-gray-50 rounded-md p-4">
        <div class="text-sm text-gray-600 mb-2">
          <strong>To:</strong> {friendEmail || 'friend@example.com'}
        </div>
        <div class="text-sm text-gray-600 mb-2">
          <strong>Subject:</strong> Join my trip to {trip.destination}
        </div>
        <div class="text-sm text-gray-800">
          <p class="mb-2">
            Hi there!
          </p>
          <p class="mb-2">
            {message || "I'm planning a trip and would love for you to join me!"}
          </p>
          <p class="mb-2">
            <strong>Trip Details:</strong><br>
            Destination: {trip.destination}<br>
            Dates: {trip.startDate} - {trip.endDate}
          </p>
          <p>
            Click the link below to view the trip and join me!
          </p>
        </div>
      </div>
    </div>

    <!-- Tips -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-blue-900 mb-2">💡 Tips for Great Invitations</h3>
      <ul class="text-sm text-blue-800 space-y-1">
        <li>• Add a personal message to make it more inviting</li>
        <li>• Mention specific activities you'd like to do together</li>
        <li>• Include any special requirements or preferences</li>
        <li>• Suggest a time to discuss the trip details</li>
      </ul>
    </div>
  </div>
</div> 