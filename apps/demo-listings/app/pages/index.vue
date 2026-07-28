<script setup lang="ts">
import { Dialog } from '@maxblom/headlessmax'

const { data: listings } = await useAsyncData('listings', () => $fetch('/api/listings'))
const activeId = ref<string | null>(null)
</script>

<template>
  <div style="max-width: 700px; margin: 2rem auto; padding: 0 1rem">
    <h1>Available listings</h1>

    <div v-for="listing in listings" :key="listing.id" style="margin-bottom: 1rem">
      <button type="button" @click="activeId = listing.id">
        {{ listing.address }} &middot; &euro;{{ listing.price.toLocaleString('en-US') }}
      </button>

      <Dialog
        :model-value="activeId === listing.id"
        :title="listing.address"
        @update:model-value="(open) => (activeId = open ? listing.id : null)"
      >
        <p>{{ listing.description }}</p>
      </Dialog>
    </div>
  </div>
</template>

<style>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.dialog-panel {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  max-width: 480px;
  width: 90%;
}
</style>
