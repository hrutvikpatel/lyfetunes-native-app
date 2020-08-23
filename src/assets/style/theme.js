import { DefaultTheme, DarkTheme } from 'react-native-paper';

export const Light = {
  ...DefaultTheme,
  roundness: 15,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
  },
};