<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer>
    <slot>
      <p>&copy; {{ year }} HeadlessMax</p>
    </slot>
  </footer>
</template>
