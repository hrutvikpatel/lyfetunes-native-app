import React, { useEffect, useState } from "react";
import { View, Alert, Dimensions } from 'react-native';
import {
  withTheme,
  ProgressBar,
  Caption,
  Paragraph,
  List,
  Button,
  Title
} from 'react-native-paper';
import { Icon } from 'react-native-elements';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { connect } from 'react-redux';
import { Player } from '@react-native-community/audio-toolkit';

import { setIsNotNewTrack, setTracks } from '../../actions';
import jsx from './Home.style';
import SpotifyService from "../../utility/SpotifyService";
import { iTrack } from "../../utility/MusicService";
import Carousel from "react-native-snap-carousel";
import Track from "../../components/Track/Track";
import ViewSlider from "../../components/ViewSlider/ViewSlider";
import SavedTracks from "../../components/SavedTracks/SavedTracks";

export interface iHome {
  theme: any,
  navigation: any,
  seedArtists: string[],
  isNotNewTrackSet: Set<string>,
  tracks: iTrack[],
  setIsNotNewTrack: (isNotNewTrackSet: Set<string>) => void,
  setTracks: (tracks: iTrack[]) => void,
};

const Home = (props: iHome) => {
  const insets = useSafeAreaInsets();
  const barHeight = 49;
  const styles = jsx(props.theme, barHeight, insets);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [progressInterval, _setProgressInterval] = useState<any>(undefined);
  const [audio, setAudio] = useState<any>(undefined);
  const [duration, setDuration] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [open, setOpenPlaylistMenu] = useState(false);

  const fetchTracks = async (): Promise<void> => {
    try {
      const instance = SpotifyService.getInstance();
      const recommendedTrackIds = await instance.getRecommendations(props.seedArtists);
      const playableTracks = instance.getPlayableTracks(recommendedTrackIds, props.isNotNewTrackSet);
      const tracks = await instance.getServeralTracks(playableTracks);
      props.setTracks(tracks);
    }
    catch (error) {
      Alert.alert(error);
    }
  };

  useEffect(() => {
    fetchTracks();
    return clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    if (props.tracks[currentIndex]) {
      const nonPlayableTracks = new Set(props.isNotNewTrackSet);
      props.setIsNotNewTrack(nonPlayableTracks);

      if (audio) {
        audio.stop();
        audio.destroy(() => {
          setAudio(undefined);
          handleSetPlayer();
        });
      }
      else {
        handleSetPlayer();
      }
    }
  }, [props.tracks, currentIndex]);

  const handleSetPlayer = () => {
    const _audio = new Player(
      props.tracks[currentIndex].previewUrl,
      { autoDestroy: false }
    );
    setAudio(_audio);
  };

  useEffect(() => {
    if (audio) resetProgressBar();
  }, [audio]);

  const resetProgressBar = () => {
    clearInterval(progressInterval);
    setProgress(0);

    audio.looping = true;
    audio.play(() => {
      setDuration(getTime(audio.duration));
    });

    const newInterval = setInterval(() => {
      const _progress = Math.max(0, audio.currentTime) / audio.duration;
      setProgress(_progress);
      setCurrentTime(getTime(Math.max(0, audio.currentTime)));
    }, 100);
    _setProgressInterval(newInterval);
  };

  const getTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = ((time % 60000) / 1000).toFixed(0);
    return minutes + ":" + (Number(seconds) < 10 ? '0' : '') + seconds;
  }

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
        <Carousel
          data={props.tracks}
          renderItem={({ item, index }: { item: iTrack, index: number }) =>
            <Track
              track={item}
              trackIndex={index}
              currentIndex={currentIndex}
            />
          }
          vertical={true}
          itemHeight={Dimensions.get('window').height * 0.60}
          sliderHeight={Dimensions.get('window').height * 0.9}
          inactiveSlideOpacity={0.4}
          onSnapToItem={(index: number) => setCurrentIndex(index)}
          activeSlideAlignment='start'
        />
      </SafeAreaView>
      <ViewSlider
        open={open}
        onClose={() => setOpenPlaylistMenu(false)}
        side='bottom'
        hidden={false}
      >
        {open ?
          <SavedTracks /> :
          <RenderProgressSection
            styles={styles}
            progress={progress}
            currentTime={currentTime}
            duration={duration}
            refresh={() => fetchTracks()}
            viewPlaylist={setOpenPlaylistMenu}
          />
        }
      </ViewSlider>
    </>
  );
};

const RenderProgressSection = (props: any) => (
  <View style={props.styles.progressBar}>
    <ProgressBar progress={props.progress} />
    <View style={props.styles.duration}>
      <Caption>{props.currentTime}</Caption>
      <Caption>{props.duration}</Caption>
    </View>
    <List.Section style={props.styles.actions}>
      <Icon
        name="playlist-music"
        size={24}
        type='material-community'
        onPress={() => props.viewPlaylist(true)}
      />
      <Button
        uppercase={true}
        onPress={() => props.refresh()}
        mode='contained'
      >
        Refresh
      </Button>
      <Icon
        name="playlist-plus"
        size={24}
        type='material-community'
        onPress={() => console.log('Pressed')}
      />
    </List.Section>
  </View>
);

const mapStateToProps = (state: any) => ({
  seedArtists: state.reducer.seedArtists,
  isNotNewTrackSet: state.reducer.isNotNewTrackSet,
  tracks: state.reducer.tracks,
});

const mapDispatchToProps = (dispatch: Function) => ({
  setIsNotNewTrack: (isNotNewTrackSet: Set<string>) => dispatch(setIsNotNewTrack(isNotNewTrackSet)),
  setTracks: (tracks: iTrack[]) => dispatch(setTracks(tracks)),
});


export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Home));
