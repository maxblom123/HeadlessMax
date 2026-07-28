<script setup lang="ts">
import { ref } from 'vue'
import Tabs from './Tabs.vue'

const basicActive = ref('account')
const basicTabs = [
  { id: 'account', label: 'Account' },
  { id: 'billing', label: 'Billing', disabled: true },
  { id: 'security', label: 'Security' }
]

const manyActive = ref('tab-1')
const manyTabs = Array.from({ length: 10 }, (_, i) => ({
  id: `tab-${i + 1}`,
  label: `Tab ${i + 1}`
}))
</script>

<template>
  <Story title="Tabs">
    <Variant title="Default with a disabled tab">
      <Tabs v-model="basicActive" :tabs="basicTabs">
        <template #account> Manage your account details here. </template>
        <template #billing> Billing settings are unavailable right now. </template>
        <template #security> Update your password and two factor settings. </template>
      </Tabs>
    </Variant>

    <Variant title="Many tabs">
      <Tabs v-model="manyActive" :tabs="manyTabs">
        <template v-for="tab in manyTabs" #[tab.id] :key="tab.id">
          Content for {{ tab.label }}
        </template>
      </Tabs>
    </Variant>
  </Story>
</template>
