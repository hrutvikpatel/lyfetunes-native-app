import { StyleSheet, Dimensions } from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';

const headerComponentWidth = Dimensions.get('window').width * 0.3 - 20;

export default (theme: any, insets: EdgeInsets) => StyleSheet.create({
  headerContainerStyle: {
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeftComponent: {
    width: headerComponentWidth,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  headerLeftComponentMarkAll: {
    width: headerComponentWidth,
  },
  headerCenterComponent: {
    width: headerComponentWidth + 20,
    textAlign: 'center',
  },
  headerRightComponent: {
    width: headerComponentWidth,
  },
  flatList: {
    height: '85%',
  },
  selectionButton: {
    marginHorizontal: 0,
  },
  selectedRowStyle: {
    backgroundColor: '#aff3c7'
  },
  removeButton: {
    color: 'red'
  }
});
