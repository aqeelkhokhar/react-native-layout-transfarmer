# Changelog

## 1.0.0 (unreleased)

Includes everything planned for 0.2.0, which was never published.

### Added

- **Live scaling.** `configureLayout`, `scale`, `verticalScale`, `moderateScale`, `moderateVerticalScale`, `scaleFont` and the `useLayout()` hook. The names match `react-native-size-matters`, so migrating is a find and replace. `useLayout()` re-renders on rotation, split screen, foldables and iPad window resize.
- Options for the design size, `scaleBy` (`shortSide` or `window`), `maxScale` and `minScale` for tablets, and `fontScale` (`respect`, `ignore` or `capped`) for the OS font size.
- **Scaled styles.** `scaleStyle`, `createScaledStyles` and `useScaledStyles`. Write styles at design size, get a memoized, scaled `StyleSheet`.
- `ScaledView`, which lays children out at a fixed design size and scales the whole block to fit.
- **Canvas helpers.** `createViewportTransform` and `useCanvasTransform` with `stretch`, `contain` and `cover` fits and a full `inverse` for round trips, plus `fitRect`, `fillRect`, `centerRect`, `transformPoint` and `transformPoints`.
- `transformObject` and `batchTransformObjects` accept `{ anchor: 'center' }` to zoom around the middle.
- Exported types `Size`, `Point`, `Rect`, `TransformableObject`, `Scaler`, `LayoutConfig` and more.
- Bundle size check in CI (`yarn size`).
- Example app rebuilt as a showcase with Responsive, Canvas and Converter screens.

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

### Tests

- Jest suite with a 95 percent coverage gate (replaces the placeholder test).
