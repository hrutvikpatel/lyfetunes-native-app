import { StyleSheet, Dimensions } from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';

export default (theme: any, insets: EdgeInsets) => StyleSheet.create({
  itemContainer: {
    flex: 1,
    padding: 20,
    flexDirection: 'column',
    top: insets.top,
  },
  image: {
    alignItems: 'center',
    width: Dimensions.get('window').width - 60,
    height: Dimensions.get('window').width - 60
  },
  elevation: {
    elevation: 6,
    padding: 10,
  },
});
