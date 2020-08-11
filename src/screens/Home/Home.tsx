import React, { useEffect, useState } from "react";
import {
  FlatList,
} from "react-native";
import {
  withTheme,
  Text,
} from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import jsx from './Home.style';

export interface iHome {
  theme: any,
  navigation: any,
};

const Home = (props: iHome) => {
  const insets = useSafeAreaInsets();
  const barHeight = 49;
  const styles = jsx(props.theme, barHeight, insets);

  return (
    <SafeAreaView>
      <Text>Home</Text>
    </SafeAreaView>
  );
};

export default withTheme(Home);