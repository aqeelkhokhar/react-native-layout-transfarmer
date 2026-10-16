import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import CanvasScreen from './screens/CanvasScreen';
import ConverterScreen from './screens/ConverterScreen';
import ParityScreen from './screens/ParityScreen';
import ResponsiveScreen from './screens/ResponsiveScreen';
import { COLORS } from './styles';

const TABS = [
  { key: 'responsive', title: 'Responsive', Screen: ResponsiveScreen },
  { key: 'canvas', title: 'Canvas', Screen: CanvasScreen },
  { key: 'parity', title: 'Parity', Screen: ParityScreen },
  { key: 'converter', title: 'Converter', Screen: ConverterScreen },
] as const;

export default function App() {
  const [active, setActive] = useState<(typeof TABS)[number]['key']>(
    (process.env.EXPO_PUBLIC_START_TAB as (typeof TABS)[number]['key']) ||
      'responsive'
  );
  const { Screen } = TABS.find((t) => t.key === active)!;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={{ flex: 1 }}>
          <Screen />
        </View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: COLORS.cardDark,
            paddingBottom: 12,
          }}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              testID={`tab-${tab.key}`}
              onPress={() => setActive(tab.key)}
              style={{ flex: 1, alignItems: 'center', paddingVertical: 14 }}
            >
              <Text
                style={{
                  color: tab.key === active ? COLORS.white : COLORS.textDark,
                  fontWeight: tab.key === active ? '700' : '400',
                }}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaProvider>
  );
}
