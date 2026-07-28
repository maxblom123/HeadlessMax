<script setup lang="ts">
import { Select, Tabs } from '@maxblom/headlessmax'

const propertyType = ref<string | null>(null)
const propertyOptions = [
  { label: 'Apartment', value: 'apartment' },
  { label: 'House', value: 'house' },
  { label: 'Studio', value: 'studio', disabled: true }
]

const activeTab = ref('buy')
const tabs = [
  { id: 'buy', label: 'Buy' },
  { id: 'rent', label: 'Rent' }
]
</script>

<template>
  <div style="max-width: 700px; margin: 2rem auto; padding: 0 1rem">
    <h1>Search listings</h1>

    <Tabs v-model="activeTab" :tabs="tabs">
      <template #buy>
        <p>Showing results for properties available to buy.</p>
      </template>
      <template #rent>
        <p>Showing results for properties available to rent.</p>
      </template>
    </Tabs>

    <div style="margin-top: 1.5rem">
      <label>Property type</label>
      <Select v-model="propertyType" :options="propertyOptions" placeholder="Any type" />
    </div>

    <p v-if="propertyType" style="margin-top: 1rem">
      Filtering by: {{ propertyOptions.find((o) => o.value === propertyType)?.label }}
    </p>
  </div>
</template>
