import React from "react";
import {
  Image, ImageBackground, Alert,
} from "react-native";
import {
  withTheme,
  List,
  Title,
  Caption,
  Button,
} from 'react-native-paper';
import { connect } from 'react-redux';
import { setIsNotNewTrack, setSeedArtists } from '../../actions';

import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

import SpotifyService from '../../utility/SpotifyService';
import jsx from './Signup.style';

export interface iSignup {
  theme: any,
  navigation: any,
  setSeedArtists: (seedArtists: string[]) => void,
  setIsNotNewTrack: (isNotNewTrackSet: Set<string>) => void,
};

const Signup = (props: iSignup) => {
  const styles = jsx(props.theme);

  const handleAuth = async() => {
    try {
      const instance = SpotifyService.getInstance();
      await instance.authorize();
      const seedArtists = await instance.getSeedArtists();
      const _nonPlayableTracks = await instance.getTopNonPlayableTracks();
      props.setSeedArtists(seedArtists);
      props.setIsNotNewTrack(_nonPlayableTracks);

      props.navigation.navigate("Home");
    }
    catch (error) {
      Alert.alert(error);
    }
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: props.theme.colors.surface }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <List.Section style={styles.header}>
          <Title>LyfeTunes</Title>
          <Caption>Discover new tracks by listening to the best parts first.</Caption>
        </List.Section>

        <List.Section>
          <Button
            mode="contained"
            onPress={() => handleAuth()}
            uppercase={false}
            style={styles.button}
            labelStyle={styles.labelStyle}
            icon={({ size }): any => (
              <Image
                source={require('../../assets/images/Spotify_Icon_RGB_White.png')}
                style={{ width: 32, height: 32, justifyContent: "flex-start" }}
              />
            )}
          >
            Continue with Spotify
          </Button>
        </List.Section>    
      </ScrollView>
      <ImageBackground
        source={require('../../assets/images/undraw_happy_music_g6wc.png')}
        style={styles.image}
      />
    </SafeAreaView>
  );
};

const mapDispatchToProps = (dispatch: Function) => ({
  setSeedArtists: (seedArtists: string[]) => dispatch(setSeedArtists(seedArtists)),
  setIsNotNewTrack: (isNotNewTrackSet: Set<string>) => dispatch(setIsNotNewTrack(isNotNewTrackSet)),
});

export default connect(null, mapDispatchToProps)(withTheme(Signup));
