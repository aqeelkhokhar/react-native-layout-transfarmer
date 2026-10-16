import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScaledView,
  configureLayout,
  useLayout,
  useScaledStyles,
} from 'react-native-layout-transfarmer';
import { COLORS } from '../styles';

// Call once at app start. 375 x 812 is the default; shown here for clarity.
configureLayout({ designWidth: 375, designHeight: 812, maxScale: 1.6 });

// Written at design size. useScaledStyles scales them for the current screen
// and again whenever the window changes (rotate, resize, split screen).
const designStyles = {
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, gap: 12 },
  heading: { color: COLORS.white, fontSize: 24, fontWeight: '700' as const },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  buttonText: { color: COLORS.white, fontSize: 16, fontWeight: '600' as const },
  label: { color: COLORS.textMuted, fontSize: 14 },
  value: { color: COLORS.white, fontSize: 16, fontWeight: '600' as const },
  poster: {
    flex: 1,
    minHeight: 260,
    backgroundColor: COLORS.cardDark,
    borderRadius: 16,
  },
  posterTitle: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: '800' as const,
  },
};

const Row = ({ label, value }: { label: string; value: string }) => {
  const styles = useScaledStyles(designStyles);
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

export default function ResponsiveScreen() {
  const layout = useLayout();
  const styles = useScaledStyles(designStyles);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Responsive</Text>

        <View style={styles.card}>
          <Row
            label="Window"
            value={`${Math.round(layout.width)} x ${Math.round(layout.height)}`}
          />
          <Row label="Orientation" value={layout.orientation} />
          <Row label="Tablet" value={layout.isTablet ? 'yes' : 'no'} />
          <Row label="scale(100)" value={layout.scale(100).toFixed(1)} />
          <Row
            label="verticalScale(100)"
            value={layout.verticalScale(100).toFixed(1)}
          />
          <Row
            label="moderateScale(100)"
            value={layout.moderateScale(100).toFixed(1)}
          />
          <Row label="scaleFont(16)" value={layout.scaleFont(16).toFixed(1)} />
        </View>

        <View style={styles.button}>
          <Text style={styles.buttonText}>Same button on every device</Text>
        </View>

        <Text style={styles.label}>
          ScaledView lays a fixed 300 x 200 poster out once and scales the whole
          block to fit.
        </Text>
        <ScaledView designWidth={300} designHeight={200} style={styles.poster}>
          <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
            <Text
              style={{ color: COLORS.white, fontSize: 32, fontWeight: '800' }}
            >
              Design once
            </Text>
            <Text style={{ color: COLORS.textMuted, fontSize: 18 }}>
              scale everywhere
            </Text>
          </View>
        </ScaledView>
      </ScrollView>
    </SafeAreaView>
  );
}
