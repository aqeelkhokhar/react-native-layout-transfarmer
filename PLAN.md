# react-native-layout-transfarmer — Revival Plan

Status snapshot (2026-10-16): published `0.1.10` (2026-01-13), example built against RN 0.81.5 / Expo 54.
Latest ecosystem: React Native 0.87.1, Expo SDK 57.
Downloads: 52 last month, 1,586 last 12 months.
Neighbours (last month): `react-native-size-matters` 1.08M, `react-native-responsive-screen` 121k, `react-native-responsive-fontsize` 114k, `react-native-responsive-dimensions` 64k.

Legend: `[ ]` todo · `[x]` done · `[~]` in progress

Playbook: same three phases that took `react-native-highlight-text-view` from 0.1.33 to 1.1.0 (compatibility, developer experience, growth). Branch per phase, verify, release, then publish the story.

---

## What the audit found

- One file, `src/index.tsx`, 15 pure functions. No component, no hook, no config, no tests (`it.todo('write a test')`).
- Everything takes the source and destination size as arguments on every call. Nothing knows the current screen. Nobody wants to write `scaleHorizontal(20, 375, width)` 40 times, so this is why `size-matters` wins.
- Real gaps against the neighbours: no reaction to rotation, split screen, foldables or iPad window resize; no font scale (accessibility) control; no `moderate` scaling (the thing people actually use for fonts); no cap for tablets.
- Real strength nobody else has: canvas and editor transforms (`transformObject`, `batchTransformObjects`, zoom, aspect fit, `calculateDestinationDimensions`). Sticker, story and design editors need this and `size-matters` does not do it. This is the headline.
- Duplicates: `calculateHeightFromWidth` = `calculateProportionalHeight`, `calculateWidthFromHeight` = `calculateProportionalWidth`, `scaleValue` is `value * scale`, `calculateFontSize` is `scaleValue`. `transformRotation` returns its input. `batchTransformObjects` types leak `[key: string]: any`.
- Edge cases unguarded: zero or negative source size gives `Infinity` or `NaN` silently; `zoomScale` of 0 is treated as missing.
- Packaging: `peerDependencies` are `*`; no `engines`; keywords are only `react-native`, `ios`, `android`; `screenshots` ship inside the tarball; README images point at jsDelivr `@latest`; no CHANGELOG; no GitHub release notes; docs say "transfarmer" with no explanation of the name.
- Repo: no branch protection or topics known, CI exists (lint, typecheck, test, build), example is a single 417 line `App.tsx`.

## Positioning

> Responsive scaling for React Native that reacts to the screen, plus the transform math canvas apps need.

Two audiences, one package.

1. **App developers** who want `scale` / `verticalScale` / `moderateScale` that stay correct on rotation, tablets and foldables. Ship size-matters-style names as aliases so migration is a find and replace and search finds us.
2. **Editor and canvas developers** (stickers, stories, templates, design tools) who need to move objects between viewport sizes. Own this niche outright.

Do not try to beat size-matters on size. Beat it on live updates, canvas transforms and TypeScript quality.

---

## Phase 1 — Foundation and compatibility (target `0.2.0`)

Goal: trustworthy, tested, current. No behaviour change to existing exports.

### Metadata / docs quick wins

- [x] `peerDependencies`: `react-native >= 0.72`, `react >= 18`; add `engines`
- [x] Better `description` and `keywords` (responsive, scale, scaling, dimensions, tablet, foldable, font-scale, canvas, aspect-ratio, size-matters alternative)
- [x] Move README images from jsDelivr `@latest` to absolute raw GitHub URLs under `docs/assets/`; drop `screenshots` from `files` once moved (smaller tarball)
- [x] README compatibility table (RN versions, New Architecture, Expo Go works: pure JS, so Expo Go is a selling point), explain the package name once
- [x] Add `CHANGELOG.md` (hand-written, same release-it setup as highlight: `infile: false`, GitHub release body from the matching section)
- [ ] Confirm repo description, homepage, topics on GitHub

### Code hygiene (non-breaking)

- [x] Input guards: throw a clear error in dev for zero, negative or non-finite sizes (production returns the input unchanged rather than `NaN`)
- [x] Fix `zoomScale` handling (`0` and `undefined` distinct); document that zoom scales size, not position
- [x] Mark duplicates `@deprecated` (keep exports): point each at its canonical name
- [x] Tighten `batchTransformObjects` generics (`<T extends TransformableObject>`) so extra fields keep their type instead of `any`
- [x] Split `src/index.tsx` into `scaling.ts`, `aspect.ts`, `objects.ts`, re-exported from `index.ts`; JSDoc with `@example` on every export (shows in editors, helps adoption)
- [x] Mark package `"sideEffects": false` so unused helpers tree-shake

### Tests

- [x] Jest for every export: golden values from the README examples, aspect branches (wider, taller, equal), zoom, batch immutability, guards. Coverage threshold 95 percent in CI

### Tooling / example / CI

- [ ] Upgrade example to RN 0.87.x / Expo SDK 57 (still Expo 54, RN 0.81.5; web export builds)
- [ ] Upgrade `react-native-builder-bob` to current, Node and `actions/*` versions in CI
- [ ] Release `0.2.0`

---

## Phase 2 — Developer experience (target `1.0.0`)

Goal: the API people actually want. Additive, tree-shakeable, zero dependencies.

### Live scaling (the main new feature)

- [x] `configureLayout({ designWidth, designHeight, maxScale?, fontScale? })` global default design size (default 375×812), so call sites stop passing source sizes
- [x] `scale(n)`, `verticalScale(n)`, `moderateScale(n, factor = 0.5)`, `moderateVerticalScale(n, factor)`: the size-matters-compatible set, computed from current window
- [x] `useLayout()` hook returning `{ width, height, scaleX, scaleY, scale, verticalScale, moderateScale, isTablet, isLandscape, orientation }`, subscribed to `Dimensions` change events (rotation, split screen, foldable, iPad window resize) via `useWindowDimensions`
- [x] Respect OS font scale option: `moderateScale(n, { fontScale: 'respect' | 'ignore' | 'capped' })`
- [x] Tablet cap: `maxScale` so a 12.9 inch iPad does not render 3x buttons
- [x] `createScaledStyles(designStyles)` / `useScaledStyles(fn)`: write styles at design size, get a memoized `StyleSheet` scaled to the screen (numbers for `fontSize`, `margin*`, `padding*`, `width`, `height`, `borderRadius` and friends; leaves `flex`, `opacity`, `zIndex`, percent strings alone). The demo-able feature
- [x] `<ScaledView designWidth designHeight>`: renders children at design size and scales as a block (aspect fit or fill), for fixed-ratio canvases
- [ ] Safe-area-aware sizes: documented pairing with `react-native-safe-area-context` in the README (no code needed)

### Canvas and editor (the niche)

- [x] `transformRect`, `fitRect`, `fillRect`, `centerRect` (contain, cover, center math) with `Rect` and `Size` types
- [x] `transformObject` with rotation pivot and anchor options (`topLeft` | `center`), `transformPoint`, `transformPoints`
- [x] `useCanvasTransform(source, destination)`: one hook returning a memoized `transform(obj)` and `inverse(obj)` for round trips (save at 1080×1920, render at any screen, save back)
- [x] `inverse` helpers so editors can persist in design units

### API discipline

- [x] Public API frozen and documented in README table; deprecated aliases kept until `2.0`
- [x] Type exports: `Size`, `Rect`, `Point`, `TransformableObject`, `LayoutConfig`
- [x] Bundle size budget and a size check in CI (target under 5 kB gzipped, comment stripped, for the whole package; measured 3.7 kB)

### Tests / example

- [x] Jest with mocked `Dimensions`: rotation event updates the hook, caps, font scale modes
- [x] `@testing-library/react-native` for hook and `ScaledView`
- [x] Example app rebuilt as a showcase (see Phase 3): Responsive screen, Canvas editor screen, Playground with live sliders for design and device size
- [x] Verified natively on 2026-10-16 in Expo Go (SDK 54): iPhone 17e and iPad Pro 13 simulators, Android API 37.1 emulator at 360x640 dp and resized live to 800x1280 and 1280x800 dp. See "Native parity verification" below. A Maestro flow is still optional
- [x] CHANGELOG `1.0.0` with migration notes
- [ ] Release `1.0.0`

---

## Phase 3 — Growth and discoverability (target `1.1.0` and beyond)

Mirror what worked for highlight-text-view.

- [x] README rewrite: hero GIF (same layout on iPhone SE, iPhone Pro Max, iPad, rotated, foldable), above-the-fold install + 10 line usage, "Why this library" table versus size-matters / responsive-screen, migration snippet from size-matters (3 lines), recipes (responsive card, font scale, sticker editor, story template), typed props and functions table, FAQ
- [x] Social preview image built (`docs/assets/social-preview.png`), GitHub description and topics set. Still manual: upload the image in Settings > General > Social preview
- [x] Interactive demo: web build of the example deployed to GitHub Pages by `.github/workflows/pages.yml`
- [ ] Submit to reactnative.directory and awesome-react-native
- [ ] Blog post: "Stop scaling fonts by hand: responsive React Native that survives rotation" and "Sticker editor math in React Native" (dev.to + Medium, link back)
- [ ] LinkedIn post for each release (image post, per the LinkedIn posts folder workflow)
- [ ] Stack Overflow: answer evergreen questions (responsive font size, tablet scaling, orientation change, relative sizing) with a disclosed link
- [ ] Reddit r/reactnative launch post once Snack is live (check subreddit rules first)
- [x] Issue and discussion templates, "good first issue" labels, CONTRIBUTING refresh, GitHub Discussions on
- [x] README badges: npm version, downloads, bundle size, CI, license, types
- [ ] Pin the package on the GitHub profile; link from LinkedIn Featured and Projects (public naming, no NDA clients)

### User engagement loop

- [ ] Ask for feedback in the README ("what is missing" link to a pinned discussion)
- [ ] Respond to every issue within 48 hours, thank first-time contributors in release notes
- [ ] Monthly patch release cadence for the first three months (visible activity lifts npm ranking and trust)
- [ ] Track weekly downloads in the plan after each release (baseline 52 per month)

---

## Success targets

| Milestone             | Target                                                               |
| --------------------- | -------------------------------------------------------------------- |
| `0.2.0` shipped       | tests at 95 percent, example on RN 0.87 / Expo 57                    |
| `1.0.0` shipped       | hook + styles API live, canvas API live, under 3 kB                  |
| 60 days after `1.0.0` | 1,000 downloads per month, 100 GitHub stars, listed on the directory |
| 6 months              | 5,000 downloads per month, first external issue or PR merged         |

## Decisions needed from Aqeel

1. **Scope of the hook and `useScaledStyles`:** include in `1.0.0` (recommended, it is the hook that justifies the relaunch) or ship canvas only?
2. **size-matters aliases:** export `scale`, `verticalScale`, `moderateScale` with the same names (recommended for migration and search) or use unique names?
3. **Name:** keep "transfarmer" (recommended, published name, already on npm) and explain it once in the README.
4. **Repo layout:** the folder is nested twice locally (`react-native-layout-transfarmer/react-native-layout-transfarmer`); flatten it before work starts?

## Release checklist (each release)

1. `yarn lint && yarn typecheck && yarn test && yarn prepare`
2. Run the example on iOS + Android (CLI) and Expo Go
3. `yarn release` (release-it: version, tag, npm publish, GitHub release)
4. CHANGELOG.md is hand-written; GitHub release body is the matching `## <version>` section
5. npm publish needs the owner's OTP

---

## Native parity verification (2026-10-16)

Parity screen of the example app (`EXPO_PUBLIC_START_TAB=parity yarn example expo start`): a 375 x 600 board with 7 emoji at fixed design points, drawn with `useCanvasTransform` (`contain`, `anchor: 'center'`). Each device prints every emoji centre and size as a percentage of the board.

| Device                          | Window      | Result                                                       |
| ------------------------------- | ----------- | ------------------------------------------------------------ |
| iPhone 17e sim (iOS 26)         | 390 x 844   | all 7 emoji identical percentages                            |
| iPad Pro 13 sim                 | 1032 x 1376 | identical, and `maxScale` 1.6 caps the Responsive tab at 160 |
| Android emulator (API 37.1)     | 360 x 640   | identical                                                    |
| Same emulator, `wm size` tablet | 800 x 1280  | identical, updated live without reload                       |
| Same emulator, landscape tablet | 1280 x 800  | identical, board letterboxed                                 |

Responsive tab: Android phone `scale(100)` 96.0, `verticalScale(100)` 78.8, `scaleFont(16)` 15.7 (360/375 and 640/812); iPad `scale(100)` 160.0 (capped), `isTablet` yes.

Notes: a dedicated 2560 x 1600 tablet AVD (`lt_tablet`) was created but not booted; the tablet sizes came from resizing the running phone emulator, which also exercises live window changes. The iPhone UI agent timed out so the iPhone numbers were read from the on screen readout, not the accessibility tree.
