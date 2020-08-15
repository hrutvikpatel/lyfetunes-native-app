import { StyleSheet, Dimensions } from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';

export default (theme: any, barHeight: number, insets: EdgeInsets) => StyleSheet.create({
  searchBar: {
    marginLeft: 10,
    marginRight: 10,
  },
  chipView: {
    flexWrap: "wrap",
    flexDirection: "row",
  },
  chip: {
    margin: 5,
  }
});
