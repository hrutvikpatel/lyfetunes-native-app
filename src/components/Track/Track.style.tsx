import { StyleSheet, Dimensions } from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';

export default (theme: any, insets: EdgeInsets) => StyleSheet.create({
  itemContainer: {
    flex: 1,
    padding: 30,
    flexDirection: 'column',
    top: insets.top,
  },
  image: {
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  elevation: {
    elevation: 6,
    padding: 10,
    width: Dimensions.get('window').width - 60,
    height: Dimensions.get('window').width * 0.75,
    alignSelf: 'center'
  },
});
