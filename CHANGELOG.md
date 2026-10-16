# Changelog

## 0.2.0 (unreleased)

### Fixed

- Invalid sizes (zero, negative, `NaN`, `Infinity`) no longer produce silent `NaN` or `Infinity` layouts. They throw a `RangeError` in development and fall back to identity scaling in production.
- `transformObject` treated `zoomScale: 0` as "no zoom". It now collapses the object, as documented. `undefined` and `1` still mean "no zoom".

### Changed

- `batchTransformObjects` is generic. Extra fields on your objects keep their type instead of `any`, `id` is no longer required, and the input is `readonly`.
- Source split into `aspect`, `scaling` and `objects` modules. Public exports are unchanged.
- `peerDependencies` are now `react >= 18` and `react-native >= 0.72`. `sideEffects: false` for better tree shaking.
- README images moved from the jsDelivr `@latest` URL into `docs/assets` and no longer ship in the npm tarball.
- Better `description` and `keywords` for npm search.

### Deprecated

Still exported, removed in 2.0.

- `calculateHeightFromWidth` → `calculateProportionalHeight`
- `calculateWidthFromHeight` → `calculateProportionalWidth`
- `calculateFontSize` → `scaleValue`

### Added

- Exported types `Size`, `Point`, `Rect` and `TransformableObject`.
- Jest test suite with a 95 percent coverage gate (replaces the placeholder test).
