import { StyleSheet } from 'react-native';
import { useSafeAreaInsets, EdgeInsets } from "react-native-safe-area-context";


export default (theme: any, insets: EdgeInsets) => StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
});
