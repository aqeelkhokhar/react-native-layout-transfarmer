# react-native-layout-transfarmer

[![npm version](https://img.shields.io/npm/v/react-native-layout-transfarmer.svg)](https://www.npmjs.com/package/react-native-layout-transfarmer)
[![npm downloads](https://img.shields.io/npm/dm/react-native-layout-transfarmer.svg)](https://www.npmjs.com/package/react-native-layout-transfarmer)
[![CI](https://github.com/aqeelkhokhar/react-native-layout-transfarmer/actions/workflows/ci.yml/badge.svg)](https://github.com/aqeelkhokhar/react-native-layout-transfarmer/actions/workflows/ci.yml)
[![types](https://img.shields.io/npm/types/react-native-layout-transfarmer.svg)](https://www.npmjs.com/package/react-native-layout-transfarmer)
[![license](https://img.shields.io/npm/l/react-native-layout-transfarmer.svg)](LICENSE)

**Design once, scale everywhere.** Responsive scaling for React Native that keeps up with rotation, tablets, split screen and foldables, plus the transform math that canvas and editor apps need.

<p align="center">
  <img src="https://raw.githubusercontent.com/aqeelkhokhar/react-native-layout-transfarmer/main/docs/assets/hero.gif" alt="One screen scaling smoothly while the window width changes from 320 to 760 pixels" width="420" />
</p>

- Pure JavaScript, **zero dependencies**, under 4 kB gzipped. Works in **Expo Go**, on web, iOS and Android.
- Same names as `react-native-size-matters` (`scale`, `verticalScale`, `moderateScale`), so migrating is a find and replace.
- Updates live. `useLayout()` re-renders on rotation, split screen, foldables and iPad window resize.
- Cap tablets, control the OS font size, write styles at design size.
- Canvas math nobody else ships: viewport transforms with `contain` and `cover`, and a full inverse for saving in design units.
- Full TypeScript types. Tested with a 95 percent coverage gate.

> The name is on purpose: _transfarmer_ is the published package name, not a typo of "transformer".

## The problem

<p align="center">
  <img src="https://raw.githubusercontent.com/aqeelkhokhar/react-native-layout-transfarmer/main/docs/assets/problem.png" alt="A fixed 335 point card overflows a small phone and floats on a tablet, while layout-transfarmer scales it to every screen" width="760" />
</p>

Design tools give you one frame, devices give you hundreds of sizes. Hard coded numbers look right on one of them. This library scales your design values to the real screen, keeps doing it when the window changes, and gives editor apps the math to move objects between sizes.

**Jump to** [Install](#install) · [Quick start](#quick-start) · [Why this library](#why-this-library) · [Verified on real screens](#verified-on-real-screens) · [Live scaling](#live-scaling) · [Canvas tools](#canvas-and-editor-tools) · [Math helpers](#pure-math-helpers) · [Recipes](#recipes) · [FAQ](#faq)

## Try it

- **In the browser.** [Live demo](https://aqeelkhokhar.github.io/react-native-layout-transfarmer/) with Responsive, Canvas, Parity and Converter screens. Resize the window and watch the numbers.
- **On a device.** Clone the repo, run `yarn` and `yarn example start`, then scan the QR code with Expo Go.

## Install

```sh
npm install react-native-layout-transfarmer
# or
yarn add react-native-layout-transfarmer
```

| React Native | Expo                   | New Architecture | Web |
| ------------ | ---------------------- | ---------------- | --- |
| 0.72 and up  | Expo Go and dev builds | yes (pure JS)    | yes |

## Quick start

```tsx
import { Text, View } from 'react-native';
import {
  configureLayout,
  moderateScale,
  scaleFont,
  useScaledStyles,
} from 'react-native-layout-transfarmer';

// Once, at app start. Use the size of your Figma frame.
configureLayout({ designWidth: 375, designHeight: 812, maxScale: 1.5 });

// Write styles at design size. They scale for the screen and re-scale on rotation.
const designStyles = {
  card: {
    width: 335,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
  },
  title: { fontSize: 24, color: '#fff' },
};

export function Card() {
  const styles = useScaledStyles(designStyles);
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Looks right on every device</Text>
    </View>
  );
}

// Or scale single values.
const gap = moderateScale(16);
const font = scaleFont(18);
```

## Why this library

|                                                   | react-native-size-matters | **layout-transfarmer**              |
| ------------------------------------------------- | ------------------------- | ----------------------------------- |
| `scale`, `verticalScale`, `moderateScale`         | yes                       | **yes, same names**                 |
| Values follow rotation and window resize          | computed once at import   | **read on every call, plus a hook** |
| Tablet cap (`maxScale`)                           | no                        | **yes**                             |
| OS font size control (respect, ignore, cap)       | no                        | **yes**                             |
| Write a whole style sheet at design size          | no                        | **yes**                             |
| Scale a fixed design block (`ScaledView`)         | no                        | **yes**                             |
| Move objects between viewports (canvas, stickers) | no                        | **yes, with inverse**               |
| Zero dependencies                                 | yes                       | **yes**                             |

### Migrating from react-native-size-matters

```diff
-import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
+import { scale, verticalScale, moderateScale } from 'react-native-layout-transfarmer';
```

The defaults match (design size 375 by 812, scaled by the shorter and longer screen side, `moderateScale` factor 0.5). The difference is that the values are read when you call them, so a component that renders again after a rotation gets fresh numbers.

## Verified on real screens

The example app has a Parity screen. The same 375 by 600 board, with emoji at fixed design points, is drawn with `useCanvasTransform` on a small phone, a large tablet and everything between. Each emoji lands at the same percentage of the board and keeps the same relative size. Measured in the running apps (Expo Go, SDK 54):

![Same board on iPhone, iPad, Android phone and Android tablet](https://raw.githubusercontent.com/aqeelkhokhar/react-native-layout-transfarmer/main/docs/assets/parity.png)

| Device                                           | Window      | Board      | 🎯 centre and size  |
| ------------------------------------------------ | ----------- | ---------- | ------------------- |
| iPhone 17e simulator                             | 390 x 844   | 374 x 598  | 49.9%, 50.0%, 17.1% |
| iPad Pro 13 simulator                            | 1032 x 1376 | 749 x 1198 | 49.9%, 50.0%, 17.1% |
| Android phone emulator                           | 360 x 640   | 290 x 464  | 49.9%, 50.0%, 17.1% |
| Android tablet size (same emulator resized live) | 800 x 1280  | 688 x 1100 | 49.9%, 50.0%, 17.1% |
| Android landscape tablet size                    | 1280 x 800  | 388 x 620  | 49.9%, 50.0%, 17.1% |

The other six emoji match to the same digit on every device. The Android window was resized while the app was running, and it re-laid itself out with no reload.

## Live scaling

### `configureLayout(options)`

Call once at app start. Only the keys you pass change.

| Option             | Default       | What it does                                                                                                                                                               |
| ------------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `designWidth`      | `375`         | Width of your design frame.                                                                                                                                                |
| `designHeight`     | `812`         | Height of your design frame.                                                                                                                                               |
| `scaleBy`          | `'shortSide'` | `'shortSide'` scales by the shorter side for widths and the longer side for heights, so portrait and landscape agree. `'window'` uses the current window width and height. |
| `maxScale`         | none          | Upper limit for any scale factor. `1.5` keeps tablets calm.                                                                                                                |
| `minScale`         | none          | Lower limit for any scale factor.                                                                                                                                          |
| `fontScale`        | `'respect'`   | How `scaleFont` treats the OS font size. `'respect'` leaves it to `Text`, `'ignore'` cancels it, `'capped'` allows it up to `maxFontScale`.                                |
| `maxFontScale`     | `1.3`         | Largest OS font scale that `'capped'` allows.                                                                                                                              |
| `tabletBreakpoint` | `600`         | Shorter side in points from which `isTablet` is true.                                                                                                                      |

`getLayoutConfig()` returns the active options and `resetLayoutConfig()` restores the defaults.

### Functions

These read the window when called. Call them while rendering.

| Function                                    | Use for                                        |
| ------------------------------------------- | ---------------------------------------------- |
| `scale(size)`                               | widths, horizontal margins and padding, radius |
| `verticalScale(size)`                       | heights, vertical margins and padding          |
| `moderateScale(size, factor = 0.5)`         | most sizes, grows slower than `scale`          |
| `moderateVerticalScale(size, factor = 0.5)` | the vertical version                           |
| `scaleFont(size, factor = 0.5)`             | font sizes, honours the `fontScale` option     |

`factor` `0` keeps the size, `1` is the same as `scale`.

### `useLayout()`

Returns the scaling functions for the current window and re-renders the component when the window changes.

```tsx
const { width, height, orientation, isLandscape, isTablet, scale, scaleFont } =
  useLayout();
```

### Scaled styles

`useScaledStyles(designStyles)` returns a memoized style sheet. Sizes that follow the width use `scale`, heights use `verticalScale`, text uses `scaleFont`. `flex`, `opacity`, `zIndex`, `borderWidth`, percent strings and colors are left alone. Shadow offsets and `translateX` and `translateY` are scaled too.

```tsx
const styles = useScaledStyles((layout) => ({
  card: { width: layout.isTablet ? 480 : 335, padding: 16 },
}));
```

Declare the factory outside the component, or wrap it in `useCallback`, to keep the memoization. Also available without a hook: `createScaledStyles(styles)` (scales once) and `scaleStyle(style)` (one style object).

### `ScaledView`

Lays its children out at a fixed design size, then scales the whole block to fit the space it gets. Good for posters, templates and anything with a fixed aspect ratio.

```tsx
<ScaledView
  designWidth={300}
  designHeight={200}
  fit="contain"
  style={{ flex: 1 }}
>
  <Poster />
</ScaledView>
```

`fit` is `contain` (default), `cover`, `width` or `height`.

### Safe area

Scaling does not know about notches. Use `react-native-safe-area-context` for insets and keep them as they are, because insets are already real device points. Scale only your design values.

## Canvas and editor tools

Save your objects at one size (for example a 1080 by 1920 story) and draw them at any size. The GIF below is the example app resizing its window with each `fit` mode. Rotation and zoom survive, and nothing is re-authored.

<p align="center">
  <img src="https://raw.githubusercontent.com/aqeelkhokhar/react-native-layout-transfarmer/main/docs/assets/canvas.gif" alt="Stickers on a 1080 by 1920 canvas drawn with contain, cover and stretch while the window width changes" width="420" />
</p>

```tsx
import { useCanvasTransform } from 'react-native-layout-transfarmer';

const CANVAS = { width: 1080, height: 1920 };

function Editor({ stickers, box }) {
  // destination defaults to the window; here we pass the measured box
  const t = useCanvasTransform(CANVAS, box, {
    fit: 'contain',
    anchor: 'center',
  });
  const placed = t.objects(stickers); // keeps id, rotation and your own fields

  // A drag ends at screen coordinates, save it back in design units:
  const saved = t.inverse.object(draggedSticker);
}
```

`createViewportTransform(source, destination, { fit, anchor })` is the same without React. The result has `scaleX`, `scaleY`, `offsetX`, `offsetY`, `point`, `size`, `rect`, `object`, `objects` and `inverse.{point,size,rect,object}`.

| `fit`               | Result                                        |
| ------------------- | --------------------------------------------- |
| `stretch` (default) | each axis scales on its own                   |
| `contain`           | keeps the aspect ratio, centered, letterboxed |
| `cover`             | keeps the aspect ratio, fills, crops          |

`zoomScale` on an object multiplies its size only. `anchor: 'center'` zooms around the middle, the default keeps the top left corner.

Rectangle helpers: `fitRect(source, container)`, `fillRect(source, container)` and `centerRect(size, container)`.

## Pure math helpers

Everything works with explicit sizes too, no screen needed.

```ts
import {
  calculateScalingFactors,
  calculateProportionalHeight,
  calculateProportionalWidth,
  calculateDestinationDimensions,
  calculateAspectRatio,
  scaleHorizontal,
  scaleVertical,
  scaleUniform,
  scaleValue,
  transformObject,
  batchTransformObjects,
} from 'react-native-layout-transfarmer';

calculateScalingFactors(375, 667, 414, 896); // { scaleX: 1.104, scaleY: 1.343 }
calculateProportionalHeight(300, 200, 350); // 233.33
calculateDestinationDimensions(1920, 1080, 400, 300); // { width: 400, height: 225, isFullWidth: true }
scaleUniform(50, 375, 667, 414, 896); // 55.2, the smaller factor, never overflows

const { scaleX, scaleY } = calculateScalingFactors(375, 667, 414, 896);
transformObject({ x: 20, y: 100, width: 335, height: 50 }, scaleX, scaleY);
// { x: 22.08, y: 134.33, width: 369.84, height: 67.16 }
batchTransformObjects(elements, scaleX, scaleY); // generic, keeps your fields and types
```

Invalid sizes (zero, negative, `NaN`) throw a `RangeError` in development and fall back to identity scaling in production, so a bad value never reaches a layout as `NaN`.

Deprecated, removed in 2.0: `calculateHeightFromWidth`, `calculateWidthFromHeight` and `calculateFontSize`. See the [changelog](CHANGELOG.md) for the replacements.

## Recipes

**Responsive font that respects accessibility, up to a point**

```ts
configureLayout({ fontScale: 'capped', maxFontScale: 1.3 });
const fontSize = scaleFont(16);
```

**Calm tablets**

```ts
configureLayout({ maxScale: 1.4 });
```

**Different layout on tablets**

```tsx
const { isTablet } = useLayout();
return isTablet ? <TwoColumns /> : <OneColumn />;
```

**Sticker editor that survives rotation**

Save in design units, render with `useCanvasTransform`, convert pointer positions back with `t.inverse.point`.

## FAQ

**Does it need native code?** No. Pure JavaScript on top of `Dimensions` and `PixelRatio`. It runs in Expo Go.

**Does it work with the New Architecture?** Yes, nothing native is involved.

**Why is `scale` the same in portrait and landscape?** By default the shorter side drives widths, like `react-native-size-matters`. Use `scaleBy: 'window'` if you want the real window width.

**Do I have to re-render after a rotation?** Components that call `useLayout()` or `useScaledStyles()` re-render on their own. The plain functions read the window when called, so they are right whenever the component renders.

**Is there a demo?** Run the `example` app. It has Responsive, Canvas and Converter screens. A web version is published at the repository's GitHub Pages site.

## Feedback

Missing something? Open a [discussion](https://github.com/aqeelkhokhar/react-native-layout-transfarmer/discussions) or an [issue](https://github.com/aqeelkhokhar/react-native-layout-transfarmer/issues). Every one gets a reply.

## Contributing

See the [contributing guide](CONTRIBUTING.md).

## Special Thanks

Special thanks to **Sohail Muhabbat Ali** ([GitHub](https://github.com/sohail-mohabbatali)) for his invaluable contributions as an Engineering Manager in developing this package. His guidance and expertise were instrumental in bringing this project to fruition.

## License

MIT
