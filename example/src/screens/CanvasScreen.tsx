import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useCanvasTransform,
  type ViewportFit,
} from 'react-native-layout-transfarmer';
import { COLORS } from '../styles';

// Stickers are saved in design units on a 1080 x 1920 story canvas.
const CANVAS = { width: 1080, height: 1920 };

const STICKERS = [
  {
    id: 'sun',
    x: 120,
    y: 160,
    width: 320,
    height: 320,
    color: COLORS.warning,
    rotation: 0,
    label: 'SUN',
  },
  {
    id: 'title',
    x: 140,
    y: 820,
    width: 800,
    height: 240,
    color: COLORS.primary,
    rotation: -6,
    label: 'Design once',
  },
  {
    id: 'tag',
    x: 600,
    y: 1500,
    width: 360,
    height: 160,
    color: COLORS.secondary,
    rotation: 8,
    label: 'scale',
  },
  {
    id: 'zoom',
    x: 160,
    y: 1300,
    width: 200,
    height: 200,
    zoomScale: 1.5,
    color: COLORS.success,
    rotation: 0,
    label: 'zoom',
  },
];

const FITS: ViewportFit[] = ['stretch', 'contain', 'cover'];

export default function CanvasScreen() {
  const [fit, setFit] = useState<ViewportFit>('contain');
  const [box, setBox] = useState({ width: 300, height: 400 });

  // Render the saved canvas into whatever box the screen gives us.
  const transform = useCanvasTransform(CANVAS, box, { fit, anchor: 'center' });
  const placed = transform.objects(STICKERS);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      edges={['top']}
    >
      <Text
        style={{
          color: COLORS.white,
          fontSize: 24,
          fontWeight: '700',
          padding: 16,
        }}
      >
        Canvas
      </Text>
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16 }}>
        {FITS.map((f) => (
          <TouchableOpacity
            key={f}
            testID={`fit-${f}`}
            onPress={() => setFit(f)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 999,
              backgroundColor: f === fit ? COLORS.primary : COLORS.card,
            }}
          >
            <Text style={{ color: COLORS.white }}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View
        style={{
          flex: 1,
          margin: 16,
          backgroundColor: COLORS.cardDark,
          borderRadius: 16,
          overflow: 'hidden',
        }}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setBox({ width, height });
        }}
      >
        <View
          testID="canvas"
          style={{
            position: 'absolute',
            left: transform.offsetX,
            top: transform.offsetY,
            width: CANVAS.width * transform.scaleX,
            height: CANVAS.height * transform.scaleY,
            backgroundColor: COLORS.card,
            overflow: 'hidden',
          }}
        >
          {placed.map((s) => {
            // The canvas view already carries the offset, so subtract it.
            const src = STICKERS.find((x) => x.id === s.id)!;
            return (
              <View
                key={s.id}
                style={{
                  position: 'absolute',
                  left: s.x - transform.offsetX,
                  top: s.y - transform.offsetY,
                  width: s.width,
                  height: s.height,
                  backgroundColor: src.color,
                  transform: [{ rotate: `${s.rotation}deg` }],
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: COLORS.white, fontWeight: '700' }}>
                  {src.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
