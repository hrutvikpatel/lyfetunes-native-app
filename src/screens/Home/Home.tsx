import React, { useEffect, useState, useRef } from "react";
import { View, Alert, Dimensions } from 'react-native';
import {
  withTheme,
  Paragraph,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { connect } from 'react-redux';
import { Player } from '@react-native-community/audio-toolkit';

import { setIsNotNewTrack, setTracks, setSavedTracks, setCurrentTrackIndex, setAudio } from '../../actions';
import jsx from './Home.style';
import SpotifyService from "../../utility/SpotifyService";
import { iTrack } from "../../utility/MusicService";
import Carousel from "react-native-snap-carousel";
import Track from "../../components/Track/Track";
import ViewSlider from "../../components/ViewSlider/ViewSlider";
import SavedTracks from "../../components/SavedTracks/SavedTracks";
import Controls from "../../components/Controls/Controls";

export interface iHome {
  theme: any,
  navigation: any,
  seedArtists: string[],
  isNotNewTrackSet: Set<string>,
  tracks: iTrack[],
  savedTracks: iTrack[],
  currentTrackIndex: number,
  setIsNotNewTrack: (isNotNewTrackSet: Set<string>) => void,
  setTracks: (tracks: iTrack[]) => void,
  setSavedTracks: (savedTracks: Map<string, iTrack>) => void,
  setCurrentTrackIndex: (currentTrackIndex: number) => void,
  setAudio: (audio: any) => void,
};

const Home = (props: iHome) => {
  const insets = useSafeAreaInsets();
  const barHeight = 49;
  const styles = jsx(props.theme, barHeight, insets);
  const [open, setOpenPlaylistMenu] = useState(false);
  const [previewAudio, setPreviewAudio] = useState<Map<number, any>>(new Map());

  const fetchTracks = async (): Promise<void> => {
    try {
      clearAudioFromMemory();
      props.setTracks([]);
      const instance = SpotifyService.getInstance();
      const recommendedTrackIds = await instance.getRecommendations(props.seedArtists);
      const { playableTracks, nonPlayableTracks } = instance.getPlayableTracks(recommendedTrackIds, props.isNotNewTrackSet);
      const tracks = await instance.getServeralTracks(playableTracks);

      props.setTracks(tracks);
      props.setIsNotNewTrack(nonPlayableTracks);
      updatePreviewAudio(0, tracks[0]?.previewUrl);
    }
    catch (error) {
      Alert.alert(error);
    }
  };

  const clearAudioFromMemory = () => {
    previewAudio?.forEach((audio) => {
      audio.destroy();
    });
    setPreviewAudio(new Map());
    props.setAudio(undefined);
  };

  useEffect(() => {
    fetchTracks();

    return () => {
      clearAudioFromMemory();
    };
  }, []);

  const updatePreviewAudio = (currentTrackIndex: number, previewUrl: string) => {
    try {
      if (previewAudio.has(currentTrackIndex)) {
        props.setAudio(previewAudio.get(currentTrackIndex));
      }
      else {
        const _audio = new Player(previewUrl, { autoDestroy: false })
          .prepare(() => {
            _audio.looping = true;
            setPreviewAudio(previewAudio.set(currentTrackIndex, _audio));
            props.setAudio(_audio);
          });
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  const onSnapToItem = (index: number) => {
    if (!props.tracks[index]) return;
    props.setCurrentTrackIndex(index);
    updatePreviewAudio(index, props.tracks[index]?.previewUrl);
  };

  return (
    <>
      <SafeAreaView>
        <ViewSlider
          open={false}
          onClose={() => setOpenPlaylistMenu(false)}
          side='top'
          hidden={open}
        >
          <View style={styles.header}>
            <Paragraph>Now Playing</Paragraph>
          </View>
        </ViewSlider>
        {
          props.tracks.length > 0 ?
            <Carousel
              data={props.tracks}
              renderItem={({ item, index }: { item: iTrack, index: number }) =>
                <Track
                  track={item}
                  trackIndex={index}
                  currentIndex={props.currentTrackIndex}
                />
              }
              vertical={true}
              itemHeight={Dimensions.get('window').height * 0.60}
              sliderHeight={Dimensions.get('window').height * 0.9}
              onBeforeSnapToItem={onSnapToItem}
              activeSlideAlignment='start'
              onScrollBeginDrag={() => props.setAudio(undefined)}
            /> :
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                flexDirection: 'column'
              }}
            >
              <ActivityIndicator animating={true} />
            </View>
        }
      </SafeAreaView>
      <ViewSlider
        open={false}
        onClose={() => { }}
        side='bottom'
        hidden={false}
      >
        <Controls
          viewPlaylist={() => setOpenPlaylistMenu(true)}
          refresh={fetchTracks}
        />
      </ViewSlider>
      <ViewSlider
        open={open}
        onClose={() => setOpenPlaylistMenu(false)}
        side='bottom'
        hidden={!open}
      >
        <SavedTracks />
      </ViewSlider>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  seedArtists: state.reducer.seedArtists,
  isNotNewTrackSet: state.reducer.isNotNewTrackSet,
  tracks: state.reducer.tracks,
  savedTracks: state.reducer.savedTracks,
  currentTrackIndex: state.reducer.currentTrackIndex,
});

const mapDispatchToProps = (dispatch: Function) => ({
  setIsNotNewTrack: (isNotNewTrackSet: Set<string>) => dispatch(setIsNotNewTrack(isNotNewTrackSet)),
  setTracks: (tracks: iTrack[]) => dispatch(setTracks(tracks)),
  setSavedTracks: (savedTracks: Map<string, iTrack>) => dispatch(setSavedTracks(savedTracks)),
  setCurrentTrackIndex: (currentTrackIndex: number) => dispatch(setCurrentTrackIndex(currentTrackIndex)),
  setAudio: (audio: any) => dispatch(setAudio(audio)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Home));
