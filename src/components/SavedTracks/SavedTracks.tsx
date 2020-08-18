import React, { useEffect, useState } from "react";
import { View } from 'react-native';
import {
  withTheme,
  Paragraph,
  List,
  Button,
} from 'react-native-paper';
import { Icon, Header } from 'react-native-elements';
import { useSafeAreaInsets } from "react-native-safe-area-context";

import jsx from './SavedTracks.style';
import { withSlider } from "../ViewSlider/ViewSlider";

export interface iSavedTracks {
  theme: any,
  onCloseSlider: () => void,
};

const SavedTracks = (props: iSavedTracks) => {
  const insets = useSafeAreaInsets();
  const styles = jsx(props.theme, insets);

  return (
    <List.Section
      style={styles.headerContainerStyle}
    >
      <Icon
        name="keyboard-arrow-down"
        size={32}
        type='material-icons'
        onPress={() => props.onCloseSlider()}
      />
      <Paragraph>Saved Tracks</Paragraph>
      <Button
      >
        Select
      </Button>
    </List.Section>
  );
};

export default withTheme(withSlider(SavedTracks));
