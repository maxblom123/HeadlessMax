<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <header>
    <slot name="logo">
      <strong>{{ title ?? 'HeadlessMax' }}</strong>
    </slot>
    <nav>
      <slot name="nav" />
    </nav>
  </header>
</template>
