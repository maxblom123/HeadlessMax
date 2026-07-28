<script setup lang="ts">
import { ref } from 'vue'
import Select from './Select.vue'

const basicValue = ref<string | null>(null)
const basicOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' }
]

const disabledValue = ref<string | null>(null)

const manyOptions = Array.from({ length: 30 }, (_, i) => ({
  label: `Option ${i + 1}`,
  value: `option-${i + 1}`
}))
const manyValue = ref<string | null>(null)
</script>

<template>
  <Story title="Select">
    <Variant title="Default">
      <Select v-model="basicValue" :options="basicOptions" placeholder="Choose a fruit" />
    </Variant>

    <Variant title="Disabled">
      <Select
        v-model="disabledValue"
        :options="basicOptions"
        placeholder="Choose a fruit"
        disabled
      />
    </Variant>

    <Variant title="Many options">
      <Select v-model="manyValue" :options="manyOptions" placeholder="Choose an option" />
    </Variant>
  </Story>
</template>
