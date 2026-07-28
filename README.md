# HeadlessMax

Headless, accessible Vue 3 components and a shared AppShell, built as two published npm packages and proven inside two real Nuxt apps in this same repository.

This project exists to answer a specific question: can I design and ship shared frontend infrastructure, not just build a page. Everything here is built to be checked, not taken on trust.

## What is actually in this repository

**`packages/components`**, published as `@maxblom/headlessmax`. Three headless components: Select, Dialog, Tabs. Each one covers a distinct, genuinely hard category of accessible component behavior: keyboard navigation and typeahead, focus trapping and restoration, roving tabindex. 24 tests. A Histoire story per component showing its default state, a disabled state, and one edge case. Full detail in [`packages/components/README.md`](packages/components/README.md).

**`packages/appshell`**, published as `@maxblom/headlessmax-appshell`. A shared header, footer, and a feature flag composable built on `provide`/`inject` rather than a Nuxt-specific API, since the original design did not survive being packaged. 5 tests. Full detail in [`packages/appshell/README.md`](packages/appshell/README.md).

**`apps/demo-listings`** and **`apps/demo-search`**. Two independent Nuxt apps with different content, both consuming both published packages through a real `npm install`, not a local file copy. This is the actual proof that the shared-package pattern works: two apps, same header and footer, same component behavior, verified by running both and inspecting what renders.

## Why this exists

A solo project cannot prove architectural thinking through a demo page alone. This repository is built around a different claim: that a component's behavior can be separated from its styling, that a package can be designed for a stranger to install rather than assumed to work, and that shared infrastructure used by more than one consumer is a different, harder problem than a single well-built page. Each of those claims is checkable in this repository, not just stated.

## Install and use a package

```bash
npm install @maxblom/headlessmax
npm install @maxblom/headlessmax-appshell
```

Both packages are public. A fresh `npm install` in an empty directory, outside this workspace, was used to verify each one before it was considered done, the same way the SSR project in this account verified that `NuxtImage` was actually resizing images rather than assuming a config had worked.

## Running this repository locally

```bash
npm install
```

Then, per package or app:

```bash
npm run test     # inside packages/components or packages/appshell
npm run story:dev  # inside packages/components, opens Histoire
npm run dev       # inside apps/demo-listings or apps/demo-search
```

Node version is pinned in `.nvmrc`. A pre-commit hook runs ESLint and Prettier on every commit, configured in the workspace root and enforced from the first commit in this repository's history, not added afterward.

## Code and writing standard

Every file in this workspace was held to the same bar: strict TypeScript, no filler comments, tests that assert behavior rather than implementation detail. Every README, including this one, avoids marketing language and states specific, checkable claims rather than general ones. Where a claim could not be checked, it is named as a limitation instead.

## Limitations, stated plainly

Three components exist by design. Select, Dialog, and Tabs were chosen to cover three distinct categories of accessible behavior. A fourth component was not added to increase the count.

Several dev dependency advisories exist in the build and test tooling for both packages, detailed individually in each package's own README rather than summarized here. None affect the published packages themselves, confirmed by a fresh install of each showing 0 vulnerabilities.

An external contribution to RekaUI, the library both packages build on, was attempted as part of this project. Several well-scoped, relevant issues were identified in RekaUI's own repository, including one directly related to Tabs hydration and another directly related to Select's ARIA wiring. Each candidate was checked against RekaUI's actual issue tracker before being ruled out, not assumed available. By the time each was reviewed, it was either already claimed by an active contributor or already resolved. This was not pursued further. The search process itself, checking real, current state rather than picking a target blind, is documented here because it is the honest account of what happened, not because it substitutes for the contribution itself.

The feature flag backend in both demo apps is a flat, hardcoded object, not a real service. The composable's interface was designed so that swapping in a real backend would not require changing any code that calls `useFeatureFlag`.