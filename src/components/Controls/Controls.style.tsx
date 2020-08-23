import { StyleSheet } from 'react-native';

export default (theme: any) => StyleSheet.create({
  progressBar: {
    paddingTop: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  disabledIconStyle: {
    backgroundColor: 'transparent',
  }
});
