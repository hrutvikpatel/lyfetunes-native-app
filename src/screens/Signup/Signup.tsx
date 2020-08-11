import React, { useState, useEffect } from "react";
import {
  Image, ImageBackground,
} from "react-native";
import {
  withTheme,
  List,
  Title,
  Caption,
  Button,
} from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

import jsx from './Signup.style';

export interface iSignup {
  theme: any,
  navigation: any,
};

const Signup = (props : iSignup) => {
  const styles = jsx(props.theme);

  const handleAuth = async() => {

  };

  return (
    <SafeAreaView>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainerStyle}
      >
        <List.Section style={styles.header}>
          <Title>{"LyfeTunes"}</Title>
          <Caption>Discovering music made easier.</Caption>
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

export default withTheme(Signup);
