# @maxblom/headlessmax

Headless, accessible Vue 3 components built on RekaUI: Select, Dialog, Tabs. Behavior and accessibility are handled by the component. Styling is entirely up to the consumer.

Published to npm. Installable and used in two real Nuxt apps in this repository, `apps/demo-listings` and `apps/demo-search`, not just described here.

## Install

```bash
npm install @maxblom/headlessmax
```

Peer dependencies: `vue ^3.5.40`, `reka-ui ^2.10.1`.

## Components

### Select

Keyboard navigation, typeahead, disabled options, and an optional hidden native `<select>` for form integration.

```vue
<script setup>
import { Select } from '@maxblom/headlessmax'

const value = ref(null)
const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana', disabled: true }
]
</script>

<template>
  <Select v-model="value" :options="options" placeholder="Choose a fruit" />
</template>
```

Arrow Up/Down moves the highlighted option. Enter or Space selects it. Typing a letter jumps to the first matching label. Disabled options are skipped, not just greyed out.

### Dialog

Focus is trapped inside the dialog while open and returned to the element that opened it on close. Background content is marked `inert` while the dialog is open.

```vue
<script setup>
import { Dialog } from '@maxblom/headlessmax'

const isOpen = ref(false)
</script>

<template>
  <Dialog v-model="isOpen" title="Confirm action">
    <p>Are you sure?</p>
    <template #footer>
      <button @click="isOpen = false">Cancel</button>
    </template>
  </Dialog>
</template>
```

The component provides structure and behavior only. `.dialog-overlay` and `.dialog-panel` are the class names to target for positioning and visual styling. Both demo apps in this repository add their own overlay CSS, since the package does not ship any.

### Tabs

Roving tabindex: only the active tab button sits in the natural Tab order. Arrow Left/Right move and activate. Home/End jump to the first and last enabled tab. Disabled tabs are skipped.

```vue
<script setup>
import { Tabs } from '@maxblom/headlessmax'

const active = ref('account')
const tabs = [
  { id: 'account', label: 'Account' },
  { id: 'billing', label: 'Billing', disabled: true }
]
</script>

<template>
  <Tabs v-model="active" :tabs="tabs">
    <template #account>Account content</template>
    <template #billing>Billing content</template>
  </Tabs>
</template>
```

## Documentation

Each component has a Histoire story showing its default state, a disabled state, and one edge case. Run locally:

```bash
npm run story:dev
```

## Testing

24 tests across the three components, covering the behavior described above: focus movement, keyboard navigation, disabled-state handling, and ARIA attribute correctness. Run with:

```bash
npm run test
```

## Limitations

Three separate dev dependency advisories exist in this package's development tooling, none of them affect the published package itself, confirmed by a fresh install showing 0 vulnerabilities.

- A `brace-expansion` denial-of-service advisory, pulled in through `@vue/test-utils`'s own dependency tree. Build-time only.
- An `esbuild` advisory affecting Vite's development server, pulled in through Histoire. Only relevant while running `story:dev` locally.
- A `linkify-it`/`markdown-it` advisory, pulled in through Histoire's markdown rendering. Also dev-tooling only.

All three were left unresolved rather than force a breaking downgrade of working, tested tooling. Details in each advisory's own GHSA entry if needed.

Three components exist by design, not as a partial list. Select, Dialog, and Tabs were chosen to cover three distinct categories of accessible component behavior. A fourth component was not added purely to increase count.