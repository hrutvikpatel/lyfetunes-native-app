import React, { useEffect, useState } from "react";
import { View } from 'react-native';
import {
  withTheme,
  Surface,
  Title,
  Paragraph,
  List,
  Button,
} from 'react-native-paper';
import { Icon, Image } from 'react-native-elements';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import { connect } from 'react-redux';

import jsx from './SavedTracks.style';
import { withSlider } from "../ViewSlider/ViewSlider";
import { iTrack } from "../../utility/MusicService";

export interface iSavedTracks {
  theme: any,
  onCloseSlider: () => void,
  savedTracks: iTrack[],
};

const SavedTracks = (props: iSavedTracks) => {
  const insets = useSafeAreaInsets();
  const styles = jsx(props.theme, insets);
  const [select, toggleSelect] = useState(false);

  return (
    <>
      <List.Section
        style={styles.headerContainerStyle}
      >
        <Icon
          style={styles.headerLeftComponent}
          name="keyboard-arrow-down"
          size={32}
          type='material-icons'
          onPress={() => props.onCloseSlider()}
        />

        <Paragraph
          style={styles.headerCenterComponent}
        >
          SAVED TRACKS
      </Paragraph>

        <Button
          style={styles.headerRightComponent}
          onPress={() => toggleSelect(!select)}
          disabled={props.savedTracks.length === 0}
        >
          SELECT
      </Button>
      </List.Section>
      <List.Section>
        <FlatList
          style={styles.flatList}
          data={props.savedTracks}
          keyExtractor={(item: iTrack) => item.uri}
          renderItem={RenderTrack}
        />
      </List.Section>
      {select && 
      <List.Section>
      <Icon
          style={styles.headerLeftComponent}
          name="keyboard-arrow-down"
          size={32}
          type='material-icons'
          onPress={() => props.onCloseSlider()}
        />
    </List.Section>}
    </>
  );
};

const RenderTrack = ({ item, index }: { item: iTrack, index: number }) => (
  <List.Item
    title={item.name}
    description={item.artists?.map((artist) => artist.name).join(', ')}
    left={ (props) =>
      <Image
        style={{ height: 64, width: 64 }}
        source={{
          uri: item.imageUrl,
        }}
      />
    }
  />
);

const mapStateToProps = (state: any) => ({
  savedTracks: state.reducer.savedTracks,
});

export default connect(mapStateToProps, null)(withTheme(withSlider(SavedTracks)));