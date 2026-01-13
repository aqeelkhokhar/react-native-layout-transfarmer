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
    gap: 12,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  viewport: {
    backgroundColor: COLORS.cardDark,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  viewportHeader: {
    backgroundColor: COLORS.card,
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewportLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.primary,
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
