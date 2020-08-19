import React, { useEffect, useState } from 'react';
import {
  withTheme,
  ProgressBar,
  Caption,
  List,
  Button
} from "react-native-paper";
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';

import jsx from './Controls.style';
import { setSavedTracks, setIsNotNewTrack } from '../../actions';
import { iTrack } from '../../utility/MusicService';
import usePrevious from '../../hooks/usePrevious';
import { MediaStates } from '@react-native-community/audio-toolkit';
import { getTime } from '../../utility/misc';

export interface iControls {
  theme: any,
  tracks: iTrack[],
  savedTracks: iTrack[],
  currentTrackIndex: number,
  audio: any,
  viewPlaylist: (open: boolean) => any,
  setSavedTracks: (savedTracks: iTrack[]) => void,
};

export interface iRenderProgressTimes {
  currentTime: number,
};

const Controls = (props: iControls) => {
  const styles = jsx(props.theme);
  const prevAudio = usePrevious(props.audio);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [progressInterval, setProgressInterval] = useState<any>(0);
  const [disable, setDisable] = useState(false);

  const startProgressBar = () => {
    clearInterval(progressInterval);

    const newInterval = setInterval(() => {
      setCurrentTime(props.audio.currentTime);
    }, 100);
    setProgressInterval(newInterval);
  };

  useEffect(() => {
    if (prevAudio !== undefined) {
      prevAudio.stop();
    }
    if (props.audio === undefined) return;

    if (props.audio.state !== MediaStates.PLAYING) {
      props.audio.play(() => {
        startProgressBar();
        setDisable(props.savedTracks?.find((e) => e.uri === props.tracks[props.currentTrackIndex].uri) !== undefined);
      });
    }

  }, [props.audio]);

  useEffect(() => {
    return () => {
      clearInterval(progressInterval);
    }
  }, []);

  const handleAddTrackToPlaylist = () => {
    if (!props.tracks[props.currentTrackIndex]) return;
    if (props.savedTracks?.find((e) => e.uri === props.tracks[props.currentTrackIndex].uri) !== undefined) return;
    setDisable(true);
    const _savedTracks = [...props.savedTracks];
    _savedTracks.push(props.tracks[props.currentTrackIndex]);
    props.setSavedTracks(_savedTracks);
  };

  return (
    <View style={styles.progressBar}>
      <RenderProgressTimes
        currentTime={currentTime}
      />
      <List.Section style={styles.actions}>
        <Icon
          name="playlist-music"
          size={24}
          type='material-community'
          onPress={() => props.viewPlaylist(true)}
          color={props.theme.colors.text}
        />
        <Button
          uppercase={true}
          // onPress={() => props.refresh()}
          mode='contained'
        >
          Refresh
      </Button>
        <Icon
          name="playlist-plus"
          size={24}
          type='material-community'
          onPress={handleAddTrackToPlaylist}
          color={disable ? props.theme.colors.disabled: props.theme.colors.text}
          disabledStyle={styles.disabledIconStyle}
          disabled={disable}
        />
      </List.Section>
    </View>
  )
};

const RenderProgressTimes = ({ currentTime }: iRenderProgressTimes) => (
  <>
    <ProgressBar progress={Math.max(0, currentTime) / 30000} />
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Caption>{getTime(currentTime)}</Caption>
      <Caption>0:30</Caption>
    </View>
  </>
);

const mapStateToProps = (state: any) => ({
  tracks: state.reducer.tracks,
  savedTracks: state.reducer.savedTracks,
  currentTrackIndex: state.reducer.currentTrackIndex,
  audio: state.reducer.audio,
});

const mapDispatchToProps = (dispatch: Function) => ({
  setSavedTracks: (savedTracks: iTrack[]) => dispatch(setSavedTracks(savedTracks)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Controls));
