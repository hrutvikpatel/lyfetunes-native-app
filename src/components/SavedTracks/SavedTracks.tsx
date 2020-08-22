import React, { useState, useEffect } from "react";
import { Alert } from 'react-native';
import {
  withTheme,
  Paragraph,
  List,
  Button,
  Portal,
  Dialog
} from 'react-native-paper';
import { Icon, Image } from 'react-native-elements';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { connect } from 'react-redux';
import { Picker } from '@react-native-community/picker';


import { withSlider } from "../ViewSlider/ViewSlider";
import { iTrack, iUserPlaylists } from "../../utility/MusicService";
import { setSavedTracks, setUserPlaylists, setSnackBar } from "../../actions";
import SpotifyService from "../../utility/SpotifyService";
import jsx from './SavedTracks.style';
import Wrapper from "../../hoc/Wrapper/Wrapper";
import { iSnackBar } from "../../reducers/reducer";

export interface iSavedTracks {
  theme: any,
  savedTracks: iTrack[],
  user: any,
  userPlaylists: iUserPlaylists[],
  onCloseSlider: () => void,
  setSavedTracks: (savedTracks: iTrack[]) => void,
  setUserPlaylists: (userPlaylists: iUserPlaylists[]) => void,
  setSnackBar: (snackBar: iSnackBar) => void,
};

export interface iRenderModal {
  visible: boolean,
  setVisible: any,
  modalStyle: any,
  userPlaylists: iUserPlaylists[],
};

const SavedTracks = (props: iSavedTracks) => {
  const insets = useSafeAreaInsets();
  const styles = jsx(props.theme, insets);
  const [select, toggleSelect] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [visible, setVisible] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('new_playlist');

  const fetchData = async () => {
    try {
      const instance = SpotifyService.getInstance();
      const userPlaylists = await instance.getUserPlaylists(props.user.id);
      props.setUserPlaylists(userPlaylists);
    }
    catch {

      Alert.alert('Something wrong. Please try restarting the app.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectRow = (uri: string) => {
    const newSelectedTracks = new Set(selectedTracks);

    if (selectedTracks.has(uri)) {
      newSelectedTracks.delete(uri);
    }
    else {
      newSelectedTracks.add(uri);
    }

    setSelectedTracks(newSelectedTracks);
  };

  const markAll = () => {
    if (selectedTracks.size === props.savedTracks.length) return;
    const newSelectedTracks = new Set(selectedTracks);
    props.savedTracks?.forEach(({ uri }: iTrack) => {
      newSelectedTracks.add(uri);
    });
    setSelectedTracks(newSelectedTracks);
  };

  const handleToggleSelection = () => {
    toggleSelect(!select);
    setSelectedTracks(new Set());
  };

  const handleRemove = () => {
    Alert.alert(
      '',
      'Are you sure you want to remove the selected tracks from your saved tracks list?',
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            const newSavedTracks: iTrack[] = [];
            props.savedTracks?.forEach((track) => {
              if (!selectedTracks.has(track.uri)) {
                newSavedTracks.push(track);
              }
            });
            props.setSavedTracks(newSavedTracks);
            setSelectedTracks(new Set());
            if (newSavedTracks.length === 0) toggleSelect(false);
          },
        },
      ],
    );
  };

  const handleAddToPlaylist = async() => {
    setVisible(false);
    try {
      const instance = SpotifyService.getInstance();
      if (selectedPlaylistId === 'new_playlist') {

      }
      else {
        const uris: string[] = [...selectedTracks];
        await instance.addTracksToPlaylist(selectedPlaylistId, uris);
        props.setSnackBar({ visible: true, description: 'Successfully added tracks to playlist' });
      }
      fetchData();
    }
    catch (error) {
      props.setSnackBar({ visible: true, description: 'Something went wrong while adding tracks to playlist' });
    }
  };

  const renderRow = ({ item, index }: { item: iTrack, index: number }) => (
    <RenderTrack
      title={item.name}
      description={item.artists?.map((artist) => artist.name).join(', ')}
      imageUrl={item.imageUrl}
      selected={selectedTracks.has(item.uri) && select}
      onPress={handleSelectRow}
      selectedRowStyle={styles.selectedRowStyle}
      uri={item.uri}
    />
  );

  return (
    <Wrapper>
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
          Saved Tracks
      </Paragraph>

        <Button
          uppercase={false}
          style={styles.headerRightComponent}
          onPress={handleToggleSelection}
          disabled={props.savedTracks.length === 0}
        >
          {select ? 'Cancel' : 'Select'}
        </Button>
      </List.Section>
      <List.Section>
        <FlatList
          style={styles.flatList}
          data={props.savedTracks}
          keyExtractor={(item: iTrack) => item.uri}
          renderItem={renderRow}
          extraData={{
            selectedTracks,
            select
          }}
        />
      </List.Section>
      {select &&
        <List.Section
          style={styles.headerContainerStyle}
        >
          <Button
            labelStyle={styles.selectionButton}
            uppercase={false}
            style={styles.headerLeftComponentMarkAll}
            onPress={() => markAll()}
          >
            Mark All
          </Button>
          <Button
            disabled={selectedTracks.size === 0}
            labelStyle={styles.selectionButton}
            uppercase={false}
            style={styles.headerCenterComponent}
            onPress={() => setVisible(true)}
          >
            Add To Playlist
          </Button>
          <Button
            disabled={selectedTracks.size === 0}
            labelStyle={[
              styles.selectionButton,
              selectedTracks.size !== 0 ? styles.removeButton : null
            ]}
            uppercase={false}
            style={styles.headerRightComponent}
            onPress={handleRemove}
          >
            Remove
          </Button>
        </List.Section>
      }

      <Portal>
        <Dialog
          visible={visible}
          onDismiss={() => setVisible(false)}
          style={styles.modalStyle}
        >
          <Dialog.Title>Select a playlist</Dialog.Title>
          <Dialog.Content>
            <Picker
              selectedValue={selectedPlaylistId}
              onValueChange={(value) => setSelectedPlaylistId(value.toString())}
            >
              <Picker.Item key={'new_playlist'} label={`<-- New Playlist -->`} value={'new_playlist'} />
              {
                props.userPlaylists?.map(({ id, name, totalTracks }: iUserPlaylists) => {
                  return <Picker.Item key={id} label={`${name}: ${totalTracks} tracks`} value={id} />
                })
              }
            </Picker>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Cancel</Button>
            <Button onPress={handleAddToPlaylist}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Wrapper>
  );
};

const RenderTrack = ({ title, description, imageUrl, selected, onPress, selectedRowStyle, uri }: any) => (
  <TouchableOpacity
    onPress={() => onPress(uri)}
  >
    <List.Item
      style={[
        { marginBottom: 5 },
        selected ? selectedRowStyle : null
      ]}
      title={title}
      description={description}
      left={(_props) =>
        <Image
          style={{ height: 64, width: 64 }}
          source={{
            uri: imageUrl,
          }}
        />
      }
    />
  </TouchableOpacity>
);

const mapStateToProps = (state: any) => ({
  savedTracks: state.reducer.savedTracks,
  user: state.reducer.user,
  userPlaylists: state.reducer.userPlaylists,
});

const mapDispatchToProps = (dispatch: Function) => ({
  setSavedTracks: (savedTracks: iTrack[]) => dispatch(setSavedTracks(savedTracks)),
  setUserPlaylists: (userPlaylists: iUserPlaylists[]) => dispatch(setUserPlaylists(userPlaylists)),
  setSnackBar: (snackBar: iSnackBar) => dispatch(setSnackBar(snackBar)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(withSlider(SavedTracks)));