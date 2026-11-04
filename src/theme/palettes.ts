export type ColorScheme = 'light' | 'dark';

export interface Palette {
  scheme: ColorScheme;
  background: string;
  surface: string;
  border: string;
  text: string;
  textMuted: string;
  green: string;
  greenDark: string;
  selectedBg: string;
  onPrimary: string;
  onColor: string;
  purple: string;
  purpleDark: string;
  teal: string;
  tealSurface: string;
  tealText: string;
  red: string;
  redSurface: string;
  rose: string;
  overdueText: string;
  overlay: string;
}

export const lightPalette: Palette = {
  scheme: 'light',
  background: '#F3F3E8',
  surface: '#FFFFFF',
  border: '#E4E4D8',
  text: '#1A1A1A',
  textMuted: '#6B6B6B',
  green: '#A3DE83',
  greenDark: '#6FA855',
  selectedBg: '#E3F5DA',
  onPrimary: '#1A1A1A',
  onColor: '#FFFFFF',
  purple: '#3B0E34',
  purpleDark: '#2A0924',
  teal: '#7FCFCB',
  tealSurface: '#EAF6F5',
  tealText: '#3B7D79',
  red: '#C0392B',
  redSurface: '#FBE6E3',
  rose: '#A17373',
  overdueText: '#F5A28C',
  overlay: 'rgba(26, 26, 26, 0.5)',
};

export const darkPalette: Palette = {
  scheme: 'dark',
  background: '#14130F',
  surface: '#1F1E19',
  border: '#37352C',
  text: '#F2F0E6',
  textMuted: '#A8A699',
  green: '#A3DE83',
  greenDark: '#8CC96B',
  selectedBg: '#253520',
  onPrimary: '#1A1A1A',
  onColor: '#FFFFFF',
  purple: '#4A1A42',
  purpleDark: '#2F0C29',
  teal: '#7FCFCB',
  tealSurface: '#17302E',
  tealText: '#7FCFCB',
  red: '#E0614F',
  redSurface: '#3A1F1B',
  rose: '#C99A9A',
  overdueText: '#F5A28C',
  overlay: 'rgba(0, 0, 0, 0.65)',
};
