<script lang="ts">
import { goto } from '$app/navigation';

export let data: { user?: { email?: string } };

interface PackingItem {
  id: string;
  name: string;
  category: string;
  isChecked: boolean;
}

interface PackingList {
  essentials: PackingItem[];
  clothing: PackingItem[];
  electronics: PackingItem[];
  toiletries: PackingItem[];
  documents: PackingItem[];
}

let packingList: PackingList = {
  essentials: [],
  clothing: [],
  electronics: [],
  toiletries: [],
  documents: []
};

let isLoading = false;
let newItemName = '';
let newItemCategory = 'essentials';
let showAddForm = false;

// Mock trip data
const trip = {
  id: '1',
  destination: 'Tokyo, Japan',
  startDate: '2024-08-01',
  endDate: '2024-08-10',
  tripType: 'general'
};

async function generateAIPackingList() {
  isLoading = true;
  
  try {
    const response = await fetch('/api/packing-list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        tripType: trip.tripType
      })
    });

    if (response.ok) {
      const data = await response.json();
      
      // Convert the AI response to our packing list format
      Object.keys(data.categories).forEach(category => {
        packingList[category as keyof PackingList] = data.categories[category].map((item: string, index: number) => ({
          id: `${category}-${index}`,
          name: item,
          category,
          isChecked: false
        }));
      });
    }
  } catch (err) {
    console.error('Failed to generate packing list:', err);
  } finally {
    isLoading = false;
  }
}

function addItem() {
  if (!newItemName.trim()) return;
  
  const newItem: PackingItem = {
    id: `${newItemCategory}-${Date.now()}`,
    name: newItemName.trim(),
    category: newItemCategory,
    isChecked: false
  };
  
  packingList[newItemCategory as keyof PackingList].push(newItem);
  newItemName = '';
  showAddForm = false;
}

function toggleItem(itemId: string, category: string) {
  const categoryList = packingList[category as keyof PackingList];
  const item = categoryList.find(item => item.id === itemId);
  if (item) {
    item.isChecked = !item.isChecked;
  }
}

function removeItem(itemId: string, category: string) {
  const categoryList = packingList[category as keyof PackingList];
  const index = categoryList.findIndex(item => item.id === itemId);
  if (index > -1) {
    categoryList.splice(index, 1);
  }
}

function getProgress(category: string) {
  const items = packingList[category as keyof PackingList];
  if (items.length === 0) return 0;
  const checked = items.filter(item => item.isChecked).length;
  return Math.round((checked / items.length) * 100);
}
</script>

<div class="min-h-screen bg-gray-50 py-8">
  <div class="max-w-4xl mx-auto px-4">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold">Packing List</h1>
        <div class="flex space-x-2">
          <button 
            on:click={generateAIPackingList}
            disabled={isLoading}
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {isLoading ? 'Generating...' : 'Generate AI List'}
          </button>
          <button 
            on:click={() => showAddForm = !showAddForm}
            class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            + Add Item
          </button>
        </div>
      </div>
      
      <div class="text-sm text-gray-600">
        Trip: {trip.destination} • {trip.startDate} - {trip.endDate}
      </div>
    </div>

    <!-- Add Item Form -->
    {#if showAddForm}
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4">Add New Item</h3>
        <div class="flex space-x-4">
          <input
            bind:value={newItemName}
            placeholder="Item name"
            class="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            bind:value={newItemCategory}
            class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="essentials">Essentials</option>
            <option value="clothing">Clothing</option>
            <option value="electronics">Electronics</option>
            <option value="toiletries">Toiletries</option>
            <option value="documents">Documents</option>
          </select>
          <button
            on:click={addItem}
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>
      </div>
    {/if}

    <!-- Packing List Categories -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each Object.entries(packingList) as [category, items]}
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold capitalize">{category}</h3>
            <div class="text-sm text-gray-500">
              {getProgress(category)}% complete
            </div>
          </div>
          
          <!-- Progress Bar -->
          <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style="width: {getProgress(category)}%"
            ></div>
          </div>

          {#if items.length === 0}
            <p class="text-gray-500 text-sm">No items yet. Add some or generate an AI list!</p>
          {:else}
            <div class="space-y-2">
              {#each items as item}
                <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div class="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={item.isChecked}
                      on:change={() => toggleItem(item.id, category)}
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="text-sm {item.isChecked ? 'line-through text-gray-500' : ''}">
                      {item.name}
                    </span>
                  </div>
                  <button
                    on:click={() => removeItem(item.id, category)}
                    class="text-red-500 hover:text-red-700 text-sm"
                  >
                    ×
                  </button>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>

    <!-- Summary -->
    <div class="bg-white rounded-lg shadow p-6 mt-6">
      <h3 class="text-lg font-semibold mb-4">Packing Summary</h3>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
        {#each Object.entries(packingList) as [category, items]}
          <div>
            <div class="text-2xl font-bold text-blue-600">
              {items.filter(item => item.isChecked).length}/{items.length}
            </div>
            <div class="text-sm text-gray-600 capitalize">{category}</div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div> 