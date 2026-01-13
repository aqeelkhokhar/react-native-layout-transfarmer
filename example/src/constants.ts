import { COLORS } from './styles';

export const SOURCE_WIDTH = 320;
export const SOURCE_HEIGHT = 400;

export const SOURCE_ELEMENTS = [
  {
    id: 'header',
    x: 10,
    y: 10,
    width: 300,
    height: 40,
    color: COLORS.primary,
    label: 'Header',
  },
  {
    id: 'card1',
    x: 10,
    y: 60,
    width: 145,
    height: 80,
    color: COLORS.secondary,
    label: 'Card 1',
  },
  {
    id: 'card2',
    x: 165,
    y: 60,
    width: 145,
    height: 80,
    color: COLORS.success,
    label: 'Card 2',
  },
  {
    id: 'content',
    x: 10,
    y: 150,
    width: 300,
    height: 100,
    color: COLORS.warning,
    label: 'Content',
  },
  {
    id: 'button',
    x: 10,
    y: 260,
    width: 300,
    height: 40,
    color: COLORS.info,
    label: 'Button',
  },
  {
    id: 'footer',
    x: 10,
    y: 310,
    width: 300,
    height: 30,
    color: COLORS.purple,
    label: 'Footer',
  },
];

export const SOURCE_FONTS = {
  title: 16,
  body: 12,
  caption: 10,
};

export const PRESET_SIZES = [
  { label: 'Same', w: SOURCE_WIDTH, h: SOURCE_HEIGHT },
  { label: '50%', w: SOURCE_WIDTH * 0.5, h: SOURCE_HEIGHT * 0.5 },
  { label: '75%', w: SOURCE_WIDTH * 0.75, h: SOURCE_HEIGHT * 0.75 },
];
