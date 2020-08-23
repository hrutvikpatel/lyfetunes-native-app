import React from 'react';
import { withTheme } from 'react-native-elements';
import { connect } from 'react-redux';
import { iSnackBar } from '../../reducers/reducer';
import { setSnackBar } from '../../actions';
import { Snackbar } from 'react-native-paper';
import { useSafeAreaInsets } from "react-native-safe-area-context";

import jsx from './Wrapper.style';

export interface iWrapper {
  theme: any,
  children: any,
  snackBar: iSnackBar,
  setSnackBar: (snackBar: iSnackBar) => void,
};

const Wrapper = (props: iWrapper) => {
  const insets = useSafeAreaInsets();
  const styles = jsx(props.theme, insets);

  return (
    <>
      <Snackbar
        wrapperStyle={styles.snackBar}
        visible={props.snackBar.visible}
        onDismiss={() => props.setSnackBar({ visible: false, description: '' })}
        duration={1500}
      >
        {props.snackBar.description}
      </Snackbar>
      {props.children}
    </>
  )
};

const mapStateToProps = (state: any) => ({
  snackBar: state.reducer.snackBar,
});

const mapDispatchToProps = (dispatch: Function) => ({
  setSnackBar: (snackBar: iSnackBar) => dispatch(setSnackBar(snackBar)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Wrapper));