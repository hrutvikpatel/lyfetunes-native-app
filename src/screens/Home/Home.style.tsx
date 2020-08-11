import { StyleSheet, Dimensions } from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';

export default (theme: any, barHeight: number, insets: EdgeInsets) => StyleSheet.create({
  flatListContainer: {
    width: "100%",
    height: Dimensions.get("window").height,
    backgroundColor: "yellow"
  },
  contentContainerStyle: {
    paddingTop: insets.top + 10,
    paddingBottom: barHeight + insets.bottom + 10,
  }
});
