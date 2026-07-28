# @maxblom/headlessmax-appshell

A shared header, footer, and feature flag composable for Vue/Nuxt apps. Published to npm and consumed by two separate demo apps in this repository, `apps/demo-listings` and `apps/demo-search`, each with different content but the same shared header and footer.

## Install

```bash
npm install @maxblom/headlessmax-appshell
```

Peer dependency: `vue ^3.5.40`.

## AppHeader and AppFooter

```vue
<script setup>
import { AppHeader, AppFooter } from '@maxblom/headlessmax-appshell'
</script>

<template>
  <div>
    <AppHeader title="My App" />
    <NuxtPage />
    <AppFooter />
  </div>
</template>
```

`AppHeader` accepts a `title` prop and exposes `logo` and `nav` slots. `AppFooter` exposes a default slot for custom content, falling back to a copyright line with the current year. Both are intentionally minimal: no design system, no opinionated styling. The point being demonstrated is the shared-package architecture, not visual design.

## useFeatureFlag

```ts
import { provideFeatureFlags, useFeatureFlag } from '@maxblom/headlessmax-appshell'

// called once, high in the app
provideFeatureFlags({ 'new-filter-ui': true })

// called anywhere below
const showNewFilterUi = useFeatureFlag('new-filter-ui')
```

Returns a fallback value of `false` if the key is missing, or a custom fallback if one is passed as a second argument.

### A design decision worth stating plainly

The original plan for this composable called for using Nuxt's `useState` directly, so a flag's value is resolved once server-side and never re-evaluated on the client. That approach does not survive being packaged: a pre-built npm package cannot reliably call Nuxt-specific composables like `useState`, since they depend on Nuxt's own build-time auto-import context, which a pre-compiled `dist/index.mjs` sitting in `node_modules` does not have.

Instead, `useFeatureFlag` is implemented as a plain `provide`/`inject` pair. The consuming app resolves flag values once, wherever that makes sense for its own setup, typically server-side in a real Nuxt app, then calls `provideFeatureFlags` once near the root. Every `useFeatureFlag` call below reads from that same resolved object. The result is the same guarantee the original design wanted, server and client see identical values, achieved without depending on APIs that do not survive packaging.

## Testing

5 tests covering flag resolution, missing-key fallback behavior, custom fallback values, and consistency of the resolved value across multiple calls. Run with:

```bash
npm run test
```

## Limitations

The feature flag backend in both demo apps is a flat, hardcoded object passed directly to `provideFeatureFlags`, not a real service. The composable's interface does not need to change to swap this for an edge config, a database read, or a real flag service like LaunchDarkly; only the code that calls `provideFeatureFlags` would change.

The same three dev dependency advisories documented in the `@maxblom/headlessmax` package's README apply here too, since both packages share the same workspace tooling. All three are build-time only and confirmed absent from a fresh install of the published package.

`AppHeader` and `AppFooter` are deliberately minimal, two components, not a design system. Extending this into a full component library was out of scope for what this package is meant to demonstrate.