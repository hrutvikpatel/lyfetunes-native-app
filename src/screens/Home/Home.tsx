import React, { useEffect, useState } from "react";
import { View, Alert, Dimensions } from 'react-native';
import {
  withTheme,
  Text,
} from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { connect } from 'react-redux';
import { setIsNotNewTrack, setTracks } from '../../actions';

import jsx from './Home.style';
import SpotifyService from "../../utility/SpotifyService";
import { iTrack } from "../../utility/MusicService";
import Carousel from "react-native-snap-carousel";

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

  const fetchTracks = async(): Promise<void> => {
    try {
      const instance = SpotifyService.getInstance();

      const recommendedTrackIds = await instance.getRecommendations(props.seedArtists);
      const { playableTracks, nonPlayableTracks } = instance.getPlayableTracks(recommendedTrackIds, props.isNotNewTrackSet);
      const tracks = await instance.getServeralTracks(playableTracks);
      props.setIsNotNewTrack(nonPlayableTracks);
      props.setTracks(tracks);
    }
    catch (error) {
      Alert.alert(error);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const renderItem = ({ item }: { item: iTrack}) => (
    <Text>{item.name}</Text>
  );

  return (
    <SafeAreaView>
      <Carousel
        data={props.tracks}
        renderItem={renderItem}
        vertical={true}
        itemHeight={Dimensions.get('window').height}
        sliderHeight={Dimensions.get('window').height}
      />
    </SafeAreaView>
  );
};

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
