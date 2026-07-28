<script setup lang="ts">
import { ref } from 'vue'
import Dialog from './Dialog.vue'

const isDefaultOpen = ref(false)
const isFooterOpen = ref(false)
const isEmptyOpen = ref(false)
</script>

<template>
  <Story title="Dialog">
    <Variant title="Default">
      <button type="button" @click="isDefaultOpen = true">Open dialog</button>
      <Dialog v-model="isDefaultOpen" title="Confirm action">
        <p>Are you sure you want to continue?</p>
        <button type="button" @click="isDefaultOpen = false">Close</button>
      </Dialog>
    </Variant>

    <Variant title="With footer slot">
      <button type="button" @click="isFooterOpen = true">Open dialog</button>
      <Dialog v-model="isFooterOpen" title="Delete item">
        <p>This action cannot be undone.</p>
        <template #footer>
          <button type="button" @click="isFooterOpen = false">Cancel</button>
          <button type="button" @click="isFooterOpen = false">Delete</button>
        </template>
      </Dialog>
    </Variant>

    <Variant title="No focusable content">
      <button type="button" @click="isEmptyOpen = true">Open dialog</button>
      <Dialog v-model="isEmptyOpen" title="Loading">
        <p>Please wait, this will close automatically.</p>
      </Dialog>
    </Variant>
  </Story>
</template>
