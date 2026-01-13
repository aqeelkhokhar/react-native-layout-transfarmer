import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import {
  calculateAspectRatio,
  calculateScalingFactors,
  calculateFontSize,
  batchTransformObjects,
  scaleValue,
  scaleUniform,
} from 'react-native-layout-transfarmer';

import { styles, COLORS } from './styles';
import {
  SOURCE_WIDTH,
  SOURCE_HEIGHT,
  SOURCE_ELEMENTS,
  SOURCE_FONTS,
  PRESET_SIZES,
} from './constants';

export default function App() {
  const [destWidth, setDestWidth] = useState(SOURCE_WIDTH.toString());
  const [destHeight, setDestHeight] = useState(SOURCE_HEIGHT.toString());

  const destinationWidth = Math.max(50, parseInt(destWidth) || SOURCE_WIDTH);
  const destinationHeight = Math.max(50, parseInt(destHeight) || SOURCE_HEIGHT);

  const { scaleX, scaleY } = calculateScalingFactors(
    SOURCE_WIDTH,
    SOURCE_HEIGHT,
    destinationWidth,
    destinationHeight
  );

  const transformedElements = batchTransformObjects(
    SOURCE_ELEMENTS.map((el) => ({ ...el })),
    scaleX,
    scaleY
  );

  const scaledFonts = {
    title: calculateFontSize(SOURCE_FONTS.title, scaleX),
    body: calculateFontSize(SOURCE_FONTS.body, scaleX),
    caption: calculateFontSize(SOURCE_FONTS.caption, scaleX),
  };

  const scaledPadding = scaleValue(10, scaleX);
  const scaledBorderRadius = scaleValue(8, scaleX);
  const sourceAspectRatio = calculateAspectRatio(SOURCE_WIDTH, SOURCE_HEIGHT);
  const destAspectRatio = calculateAspectRatio(
    destinationWidth,
    destinationHeight
  );

  const renderViewport = (
    elements: Array<{
      id: string;
      x: number;
      y: number;
      width: number;
      height: number;
      [key: string]: any;
    }>,
    fonts: { title: number; body: number; caption: number },
    width: number,
    height: number,
    label: string,
    borderRadius: number,
    isSource: boolean
  ) => (
    <View
      style={[
        styles.viewportWrapper,
        isSource ? styles.sourceWrapper : styles.destWrapper,
      ]}
    >
      <Text
        style={[
          styles.viewportTitle,
          isSource ? styles.sourceTitle : styles.destTitle,
        ]}
      >
        {isSource ? 'Source' : 'Destination'}
      </Text>
      <View
        style={[
          styles.viewport,
          { width, height },
          isSource ? styles.sourceViewport : styles.destViewport,
        ]}
      >
        <View
          style={[
            styles.viewportHeader,
            isSource ? styles.sourceHeader : styles.destHeader,
          ]}
        >
          <Text
            style={[
              styles.viewportLabel,
              isSource ? styles.sourceLabel : styles.destLabel,
            ]}
          >
            {label}
          </Text>
          <Text style={styles.viewportSize}>
            {Math.round(width)}×{Math.round(height)}
          </Text>
        </View>
        <View style={styles.viewportContent}>
          {elements.map((el, index) => {
            const sourceEl = SOURCE_ELEMENTS[index]!;
            return (
              <View
                key={el.id}
                style={[
                  styles.element,
                  {
                    left: el.x,
                    top: el.y,
                    width: el.width,
                    height: el.height,
                    backgroundColor: sourceEl.color,
                    borderRadius: borderRadius,
                  },
                ]}
              >
                <Text
                  style={[styles.elementLabel, { fontSize: fonts.caption }]}
                >
                  {sourceEl.label}
                </Text>
                <Text
                  style={[
                    styles.elementSize,
                    { fontSize: Math.max(fonts.caption - 2, 6) },
                  ]}
                >
                  {Math.round(el.width)}×{Math.round(el.height)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={[
          COLORS.mainGradientStart,
          COLORS.mainGradientMiddle,
          COLORS.mainGradientEnd,
        ]}
        style={styles.container}
      >
        <SafeAreaView style={styles.flex}>
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.title}>Layout Transfarmer</Text>
              <Text style={styles.subtitle}>Interactive Scaling Demo</Text>

              <LinearGradient
                colors={[COLORS.cardGradientStart, COLORS.cardGradientEnd]}
                style={styles.inputCard}
              >
                <Text style={styles.inputTitle}>Destination Size</Text>
                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Width</Text>
                    <TextInput
                      style={styles.input}
                      value={destWidth}
                      onChangeText={setDestWidth}
                      keyboardType="numeric"
                      selectTextOnFocus
                    />
                  </View>
                  <Text style={styles.inputX}>×</Text>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Height</Text>
                    <TextInput
                      style={styles.input}
                      value={destHeight}
                      onChangeText={setDestHeight}
                      keyboardType="numeric"
                      selectTextOnFocus
                    />
                  </View>
                </View>

                <View style={styles.presetRow}>
                  {PRESET_SIZES.map((preset) => {
                    const isActive =
                      destinationWidth === preset.w &&
                      destinationHeight === preset.h;
                    const buttonScale = new Animated.Value(1);

                    const animateButton = () => {
                      Animated.sequence([
                        Animated.timing(buttonScale, {
                          toValue: 0.9,
                          duration: 100,
                          useNativeDriver: true,
                        }),
                        Animated.timing(buttonScale, {
                          toValue: 1,
                          duration: 100,
                          useNativeDriver: true,
                        }),
                      ]).start();
                    };

                    return (
                      <Animated.View
                        key={preset.label}
                        style={{
                          transform: [{ scale: buttonScale }],
                        }}
                      >
                        <TouchableOpacity
                          style={[
                            styles.presetButton,
                            isActive && styles.presetActive,
                          ]}
                          onPress={() => {
                            animateButton();
                            setDestWidth(Math.round(preset.w).toString());
                            setDestHeight(Math.round(preset.h).toString());
                          }}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.presetText,
                              isActive && styles.presetTextActive,
                            ]}
                          >
                            {preset.label}
                          </Text>
                        </TouchableOpacity>
                      </Animated.View>
                    );
                  })}
                </View>
              </LinearGradient>

              <View style={styles.viewportsContainer}>
                {renderViewport(
                  SOURCE_ELEMENTS,
                  SOURCE_FONTS,
                  SOURCE_WIDTH,
                  SOURCE_HEIGHT,
                  'Original',
                  8,
                  true
                )}
                {renderViewport(
                  transformedElements,
                  scaledFonts,
                  destinationWidth,
                  destinationHeight,
                  'Scaled',
                  scaledBorderRadius,
                  false
                )}
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Calculated Values</Text>
                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>Source:</Text>
                  <Text style={styles.calcValue}>
                    {SOURCE_WIDTH}×{SOURCE_HEIGHT}
                  </Text>
                </View>
                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>Destination:</Text>
                  <Text style={styles.calcValue}>
                    {destinationWidth}×{destinationHeight}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>Scale X:</Text>
                  <Text style={[styles.calcValue, styles.highlight]}>
                    {scaleX.toFixed(4)}
                  </Text>
                </View>
                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>Scale Y:</Text>
                  <Text style={[styles.calcValue, styles.highlight]}>
                    {scaleY.toFixed(4)}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>Source Aspect:</Text>
                  <Text style={styles.calcValue}>
                    {sourceAspectRatio.toFixed(3)}
                  </Text>
                </View>
                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>Dest Aspect:</Text>
                  <Text style={styles.calcValue}>
                    {destAspectRatio.toFixed(3)}
                  </Text>
                </View>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Font Scaling</Text>
                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>
                    Title ({SOURCE_FONTS.title}px):
                  </Text>
                  <Text style={styles.calcValue}>
                    {scaledFonts.title.toFixed(1)}px
                  </Text>
                </View>
                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>
                    Body ({SOURCE_FONTS.body}px):
                  </Text>
                  <Text style={styles.calcValue}>
                    {scaledFonts.body.toFixed(1)}px
                  </Text>
                </View>
                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>
                    Caption ({SOURCE_FONTS.caption}px):
                  </Text>
                  <Text style={styles.calcValue}>
                    {scaledFonts.caption.toFixed(1)}px
                  </Text>
                </View>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Dimension Scaling</Text>
                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>Padding (10px):</Text>
                  <Text style={styles.calcValue}>
                    {scaledPadding.toFixed(1)}px
                  </Text>
                </View>
                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>Border Radius (8px):</Text>
                  <Text style={styles.calcValue}>
                    {scaledBorderRadius.toFixed(1)}px
                  </Text>
                </View>
                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>Uniform (100px):</Text>
                  <Text style={styles.calcValue}>
                    {scaleUniform(
                      100,
                      SOURCE_WIDTH,
                      SOURCE_HEIGHT,
                      destinationWidth,
                      destinationHeight
                    ).toFixed(1)}
                    px
                  </Text>
                </View>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Element Transformations</Text>
                {SOURCE_ELEMENTS.slice(0, 3).map((src, i) => {
                  const dest = transformedElements[i]!;
                  return (
                    <View key={src.id} style={styles.elementTransform}>
                      <Text style={[styles.elementName, { color: src.color }]}>
                        {src.label}
                      </Text>
                      <View style={styles.transformDetails}>
                        <Text style={styles.transformText}>
                          Pos: ({src.x}, {src.y}) → ({Math.round(dest.x)},{' '}
                          {Math.round(dest.y)})
                        </Text>
                        <Text style={styles.transformText}>
                          Size: {src.width}×{src.height} →{' '}
                          {Math.round(dest.width)}×{Math.round(dest.height)}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}
