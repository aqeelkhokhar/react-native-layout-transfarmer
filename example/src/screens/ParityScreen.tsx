import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCanvasTransform, useLayout } from 'react-native-layout-transfarmer';
import { COLORS } from '../styles';

// The same board and the same emoji positions are drawn on every device.
// If the library is right, each emoji sits at the same percentage of the board
// and has the same relative size on a small phone and on a large tablet.
const BOARD = { width: 375, height: 600 };

const EMOJI = [
  { id: 'target', glyph: '🎯', x: 155, y: 268, width: 64, height: 64 },
  { id: 'smile', glyph: '😀', x: 20, y: 20, width: 48, height: 48 },
  { id: 'rocket', glyph: '🚀', x: 307, y: 20, width: 48, height: 48 },
  { id: 'dog', glyph: '🐶', x: 20, y: 532, width: 48, height: 48 },
  { id: 'pizza', glyph: '🍕', x: 307, y: 532, width: 48, height: 48 },
  { id: 'star', glyph: '⭐', x: 100, y: 150, width: 40, height: 40 },
  {
    id: 'rainbow',
    glyph: '🌈',
    x: 240,
    y: 420,
    width: 80,
    height: 80,
    zoomScale: 1.25,
  },
];

const GRID = [0, 0.25, 0.5, 0.75, 1];

export default function ParityScreen() {
  const layout = useLayout();
  const [box, setBox] = useState({ width: 300, height: 400 });
  const t = useCanvasTransform(BOARD, box, {
    fit: 'contain',
    anchor: 'center',
  });
  const placed = t.objects(EMOJI);
  const boardW = BOARD.width * t.scaleX;
  const boardH = BOARD.height * t.scaleY;
  const target = placed[0]!;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      edges={['top']}
    >
      <Text
        testID="readout-window"
        style={{
          color: COLORS.white,
          fontSize: layout.scaleFont(14),
          padding: 8,
        }}
      >
        window {Math.round(layout.width)}x{Math.round(layout.height)} | board{' '}
        {Math.round(boardW)}x{Math.round(boardH)} | scale {t.scaleX.toFixed(3)}
      </Text>
      <Text
        testID="readout-target"
        style={{
          color: COLORS.textMuted,
          fontSize: layout.scaleFont(12),
          paddingHorizontal: 8,
        }}
      >
        target center x{' '}
        {(((target.x - t.offsetX + target.width / 2) / boardW) * 100).toFixed(
          1
        )}
        % y{' '}
        {(((target.y - t.offsetY + target.height / 2) / boardH) * 100).toFixed(
          1
        )}
        % size {((target.width / boardW) * 100).toFixed(1)}%
      </Text>
      <Text
        testID="readout-all"
        style={{
          color: COLORS.textDark,
          fontSize: layout.scaleFont(10),
          paddingHorizontal: 8,
        }}
      >
        {placed
          .map((e) => {
            const cx = ((e.x - t.offsetX + e.width / 2) / boardW) * 100;
            const cy = ((e.y - t.offsetY + e.height / 2) / boardH) * 100;
            return `${e.glyph} ${cx.toFixed(1)},${cy.toFixed(1)},${(
              (e.width / boardW) *
              100
            ).toFixed(1)}`;
          })
          .join('  ')}
      </Text>
      <View
        style={{ flex: 1, margin: 8 }}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setBox({ width, height });
        }}
      >
        <View
          testID="board"
          style={{
            position: 'absolute',
            left: t.offsetX,
            top: t.offsetY,
            width: boardW,
            height: boardH,
            backgroundColor: COLORS.card,
            borderWidth: 2,
            borderColor: COLORS.primary,
            overflow: 'hidden',
          }}
        >
          {GRID.map((p) => (
            <View
              key={`v${p}`}
              style={{
                position: 'absolute',
                left: p * boardW - 0.5,
                top: 0,
                width: 1,
                height: boardH,
                backgroundColor: '#475569',
              }}
            />
          ))}
          {GRID.map((p) => (
            <View
              key={`h${p}`}
              style={{
                position: 'absolute',
                top: p * boardH - 0.5,
                left: 0,
                height: 1,
                width: boardW,
                backgroundColor: '#475569',
              }}
            />
          ))}
          {placed.map((e) => (
            <Text
              key={e.id}
              testID={`emoji-${e.id}`}
              allowFontScaling={false}
              style={{
                position: 'absolute',
                left: e.x - t.offsetX,
                top: e.y - t.offsetY,
                width: e.width,
                height: e.height,
                fontSize: e.height * 0.72,
                lineHeight: e.height,
                textAlign: 'center',
              }}
            >
              {e.glyph}
            </Text>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
