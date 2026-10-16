# react-native-layout-transfarmer

<div align="center">
  <img src="https://raw.githubusercontent.com/aqeelkhokhar/react-native-layout-transfarmer/main/docs/assets/screenshot1.png" alt="Screenshot 1" width="250" />
  <img src="https://raw.githubusercontent.com/aqeelkhokhar/react-native-layout-transfarmer/main/docs/assets/screenshot2.png" alt="Screenshot 2" width="250" />
  <img src="https://raw.githubusercontent.com/aqeelkhokhar/react-native-layout-transfarmer/main/docs/assets/screenshot4.png" alt="Screenshot 3" width="250" />
  <img src="https://raw.githubusercontent.com/aqeelkhokhar/react-native-layout-transfarmer/main/docs/assets/screenshot3.png" alt="Screenshot 4" width="250" />
</div>

Cross-device layout scaling and transformation utilities for React Native. Design once, scale everywhere.

The name is on purpose: _transfarmer_ is the published package name (not a typo of "transformer").

## Problem It Solves

When building React Native apps, designers typically create mockups for a specific screen size (e.g., 375×667 for iPhone 8). However, your app runs on devices with vastly different screen dimensions - from small phones to large tablets. This creates several challenges:

- **Inconsistent layouts** across different screen sizes
- **Manual calculations** for scaling fonts, padding, margins, and element dimensions
- **Broken designs** when elements don't scale proportionally
- **Time-consuming adjustments** for each screen size

**react-native-layout-transfarmer** solves these problems by providing a comprehensive set of utilities to automatically scale your layouts from design dimensions to any target screen size.

## Use Cases

- **Responsive UI Components** - Scale cards, buttons, containers proportionally
- **Font Scaling** - Maintain readable text across all device sizes
- **Canvas/Editor Apps** - Transform objects (stickers, images, shapes) between different viewport sizes
- **Design-to-Code** - Convert Figma/Sketch designs to pixel-perfect React Native layouts
- **Multi-Device Support** - Single codebase that looks great on phones and tablets

## Benefits

- **Zero Dependencies** - Lightweight, pure JavaScript utilities
- **TypeScript Support** - Full type definitions included
- **Batch Operations** - Transform multiple objects in one call
- **Flexible Scaling** - Horizontal, vertical, or uniform scaling options
- **Aspect Ratio Preservation** - Maintain proportions automatically

## Installation

```sh
npm install react-native-layout-transfarmer
```

or

```sh
yarn add react-native-layout-transfarmer
```

## API Reference

### Scaling Factors

#### `calculateScalingFactors(sourceWidth, sourceHeight, destinationWidth, destinationHeight)`

Calculate scale factors for transforming from source to destination dimensions.

```js
import { calculateScalingFactors } from 'react-native-layout-transfarmer';

const { scaleX, scaleY } = calculateScalingFactors(375, 667, 414, 896);
// scaleX: 1.104, scaleY: 1.343
```

### Dimension Calculations

#### `calculateProportionalHeight(sourceWidth, sourceHeight, destinationWidth)`

Calculate height while maintaining aspect ratio.

```js
import { calculateProportionalHeight } from 'react-native-layout-transfarmer';

// Design: 300×200 card, screen width: 350
const cardHeight = calculateProportionalHeight(300, 200, 350);
// Result: 233.33
```

#### `calculateProportionalWidth(sourceWidth, sourceHeight, destinationHeight)`

Calculate width while maintaining aspect ratio.

```js
import { calculateProportionalWidth } from 'react-native-layout-transfarmer';

const cardWidth = calculateProportionalWidth(300, 200, 250);
// Result: 375
```

### Value Scaling

#### `scaleValue(value, scale)`

Scale any numeric value by a factor.

```js
import { scaleValue } from 'react-native-layout-transfarmer';

const scaledPadding = scaleValue(16, 1.5);
// Result: 24
```

#### `scaleHorizontal(value, sourceWidth, destinationWidth)`

Scale a value horizontally based on width ratio.

```js
import { scaleHorizontal } from 'react-native-layout-transfarmer';

const scaledMargin = scaleHorizontal(20, 375, 414);
// Result: 22.08
```

#### `scaleVertical(value, sourceHeight, destinationHeight)`

Scale a value vertically based on height ratio.

```js
import { scaleVertical } from 'react-native-layout-transfarmer';

const scaledHeight = scaleVertical(100, 667, 896);
// Result: 134.33
```

#### `scaleUniform(value, sourceWidth, sourceHeight, destinationWidth, destinationHeight)`

Scale uniformly using the smaller scale factor (prevents overflow).

```js
import { scaleUniform } from 'react-native-layout-transfarmer';

const scaledSize = scaleUniform(50, 375, 667, 414, 896);
// Result: 55.2 (uses smaller scale factor)
```

### Font Scaling

#### `calculateFontSize(sourceFontSize, scaleX)` (deprecated)

Scale font sizes proportionally. Deprecated alias of `scaleValue`, removed in 2.0.

```js
import {
  calculateFontSize,
  calculateScalingFactors,
} from 'react-native-layout-transfarmer';

const { scaleX } = calculateScalingFactors(375, 667, 414, 896);
const scaledFont = calculateFontSize(16, scaleX);
// Result: 17.66
```

### Object Transformation

#### `transformObject(sourceObject, scaleX, scaleY)`

Transform a single object's position and dimensions.

```js
import {
  transformObject,
  calculateScalingFactors,
} from 'react-native-layout-transfarmer';

const { scaleX, scaleY } = calculateScalingFactors(375, 667, 414, 896);

const button = { x: 20, y: 100, width: 335, height: 50 };
const scaled = transformObject(button, scaleX, scaleY);
// Result: { x: 22.08, y: 134.33, width: 369.84, height: 67.16 }
```

#### `batchTransformObjects(sourceObjects, scaleX, scaleY)`

Transform multiple objects at once.

```js
import {
  batchTransformObjects,
  calculateScalingFactors,
} from 'react-native-layout-transfarmer';

const { scaleX, scaleY } = calculateScalingFactors(375, 667, 414, 896);

const elements = [
  { id: 'header', x: 0, y: 0, width: 375, height: 60 },
  { id: 'card', x: 20, y: 80, width: 335, height: 200 },
  { id: 'button', x: 20, y: 300, width: 335, height: 50 },
];

const scaledElements = batchTransformObjects(elements, scaleX, scaleY);
```

### Aspect Ratio

#### `calculateAspectRatio(width, height)`

Get the aspect ratio of dimensions.

```js
import { calculateAspectRatio } from 'react-native-layout-transfarmer';

const ratio = calculateAspectRatio(1920, 1080);
// Result: 1.778 (16:9)
```

#### `calculateDestinationDimensions(sourceWidth, sourceHeight, destinationWidth, destinationHeight)`

Calculate dimensions that fit within destination while preserving aspect ratio.

```js
import { calculateDestinationDimensions } from 'react-native-layout-transfarmer';

const result = calculateDestinationDimensions(1920, 1080, 400, 300);
// Result: { width: 400, height: 225, isFullWidth: true }
```

## Complete Example

```jsx
import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import {
  calculateScalingFactors,
  calculateFontSize,
  scaleValue,
  batchTransformObjects,
} from 'react-native-layout-transfarmer';

const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 667;

export default function ResponsiveScreen() {
  const { width, height } = useWindowDimensions();

  const { scaleX, scaleY } = calculateScalingFactors(
    DESIGN_WIDTH,
    DESIGN_HEIGHT,
    width,
    height
  );

  const elements = [{ id: 'card', x: 20, y: 100, width: 335, height: 200 }];

  const scaledElements = batchTransformObjects(elements, scaleX, scaleY);
  const card = scaledElements[0];

  return (
    <View style={{ flex: 1, backgroundColor: '#0F172A' }}>
      <Text
        style={{
          fontSize: calculateFontSize(24, scaleX),
          padding: scaleValue(20, scaleX),
          color: '#fff',
        }}
      >
        Responsive Title
      </Text>

      <View
        style={{
          position: 'absolute',
          left: card.x,
          top: card.y,
          width: card.width,
          height: card.height,
          backgroundColor: '#4F46E5',
          borderRadius: scaleValue(12, scaleX),
        }}
      />
    </View>
  );
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository.

## Special Thanks

Special thanks to **Sohail Muhabbat Ali** ([GitHub](https://github.com/sohail-mohabbatali)) for his invaluable contributions as an Engineering Manager in developing this package. His guidance and expertise were instrumental in bringing this project to fruition.

## License

MIT
