import { StyleSheet, Dimensions } from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';

export default (theme: any, barHeight: number, insets: EdgeInsets) => StyleSheet.create({
  progressBar: {
    paddingTop: 10,
  },
  duration: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  disabledIconStyle: {
    backgroundColor: theme.colors.disabled
  }
});
