import React, { useEffect, useState } from "react";
import { View } from 'react-native';
import {
  withTheme,
  Surface,
  Title,
  Paragraph,
  List,
} from 'react-native-paper';
import { Image } from 'react-native-elements';
import { useSafeAreaInsets } from "react-native-safe-area-context";

import jsx from './Track.style';
import { iTrack } from "../../utility/MusicService";

export interface iTrackView {
  theme: any,
  track: iTrack,
  trackIndex: number,
  currentIndex: number,
};

const Track = (props: iTrackView) => {
  const insets = useSafeAreaInsets();
  const styles = jsx(props.theme, insets);

  return (
    <View
      style={styles.itemContainer}
    >
      <List.Section>
        <Surface
          style={styles.elevation}
        >
          <Image
            style={styles.image}
            source={{
              uri: props.track.imageUrl,
            }}
          />
        </Surface>
      </List.Section>
      <List.Section>
        <Title>{props.track.name}</Title>
      </List.Section>
      <List.Section>
        <Paragraph>{props.track.artists.map((artist) => artist.name).join(', ')}</Paragraph>
      </List.Section>
    </View>
  );
};

export default withTheme(Track);
