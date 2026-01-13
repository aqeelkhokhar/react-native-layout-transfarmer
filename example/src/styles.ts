import { StyleSheet } from 'react-native';

export const COLORS = {
  background: '#0F172A',
  card: '#1E293B',
  cardDark: '#111827',
  border: '#334155',
  primary: '#4F46E5',
  secondary: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#06B6D4',
  purple: '#8B5CF6',
  white: '#FFFFFF',
  textMuted: '#94A3B8',
  textDark: '#64748B',
  sourceBackground: '#1a2744',
  destBackground: '#2d1f3d',
  sourceBorder: '#3b82f6',
  destBorder: '#a855f7',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 16,
  },
  inputCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '100%',
  },
  inputTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  inputGroup: {
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 11,
    color: COLORS.textDark,
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
    width: 100,
    textAlign: 'center',
  },
  inputX: {
    fontSize: 20,
    color: COLORS.textDark,
    marginHorizontal: 12,
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetButton: {
    backgroundColor: COLORS.background,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  presetActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  presetText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  presetTextActive: {
    color: COLORS.white,
  },
  viewportsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  viewportWrapper: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  sourceWrapper: {
    backgroundColor: '#0a1628',
    borderWidth: 2,
    borderColor: '#2563eb',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  destWrapper: {
    backgroundColor: '#1e0a2e',
    borderWidth: 2,
    borderColor: '#9333ea',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  viewportTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sourceTitle: {
    color: '#60a5fa',
  },
  destTitle: {
    color: '#c084fc',
  },
  viewport: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
  },
  sourceViewport: {
    backgroundColor: '#0f2847',
    borderColor: '#3b82f6',
  },
  destViewport: {
    backgroundColor: '#2a1245',
    borderColor: '#a855f7',
  },
  viewportHeader: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sourceHeader: {
    backgroundColor: '#1d4ed8',
  },
  destHeader: {
    backgroundColor: '#7c3aed',
  },
  viewportLabel: {
    fontSize: 9,
    fontWeight: '700',
  },
  sourceLabel: {
    color: '#ffffff',
  },
  destLabel: {
    color: '#ffffff',
  },
  viewportSize: {
    fontSize: 9,
    color: COLORS.textDark,
  },
  viewportContent: {
    flex: 1,
    position: 'relative',
  },
  element: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  elementLabel: {
    color: COLORS.white,
    fontWeight: '600',
  },
  elementSize: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: 1,
  },
  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '100%',
  },
  sourceInfoCard: {
    backgroundColor: '#0c1929',
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  destInfoCard: {
    backgroundColor: '#1a0f29',
    borderWidth: 1,
    borderColor: '#3d2a5c',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 10,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  calcLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  calcValue: {
    fontSize: 13,
    color: COLORS.success,
    fontWeight: '500',
  },
  highlight: {
    color: COLORS.warning,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  elementTransform: {
    marginBottom: 10,
  },
  elementName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  transformDetails: {
    paddingLeft: 8,
  },
  transformText: {
    fontSize: 11,
    color: COLORS.textDark,
    marginBottom: 2,
  },
});
