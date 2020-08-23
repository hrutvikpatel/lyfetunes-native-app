import React, { useState, useEffect } from "react";
import {
  withTheme,
  Button,
  Portal,
  Dialog,
  TextInput
} from 'react-native-paper';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { connect } from 'react-redux';
import { Picker } from '@react-native-community/picker';

import { iUserPlaylists } from "../../utility/MusicService";
import { setSnackBar } from "../../actions";
import { iSnackBar } from "../../reducers/reducer";
import SpotifyService from "../../utility/SpotifyService";

import jsx from './AddToPlaylistModal.style';


export interface iAddToPlaylistModal {
  theme: any,
  user: any,
  userPlaylists: iUserPlaylists[],
  visible: boolean,
  selectedTracks: Set<string>,
  setSnackBar: (snackBar: iSnackBar) => void,
  setVisible: (visible: boolean) => void,
  fetchUserPlaylists: () => Promise<void>
};

const AddToPlaylistModal = (props: iAddToPlaylistModal) => {
  const insets = useSafeAreaInsets();
  const styles = jsx(props.theme, insets);
  const [isCreate, setIsCreate] = useState(false);

  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('new_playlist');
  const [newPlaylistName, setNewPlaylistName] = useState('LyfeTunes');

  useEffect(() => {
    setSelectedPlaylistId('new_playlist');
    setNewPlaylistName('LyfeTunes');
    setIsCreate(false);
  }, [props.visible]);

  const handleAddToPlaylist = async () => {
    try {
      const instance = SpotifyService.getInstance();
      if (selectedPlaylistId === 'new_playlist') {
        setIsCreate(true);
      }
      else {
        const uris: string[] = [...props.selectedTracks];
        await instance.addTracksToPlaylist(selectedPlaylistId, uris);
        await props.fetchUserPlaylists();

        props.setVisible(false);
        props.setSnackBar({ visible: true, description: `${props.selectedTracks.size} track(s) added!` });
      }
    }
    catch (error) {
      props.setSnackBar({ visible: true, description: 'Something went wrong while adding tracks to playlist' });
    }
  };

  const handleCreatePlaylist = async () => {
    try {
      const instance = SpotifyService.getInstance();
      const uris: string[] = [...props.selectedTracks];

      const playlistId = await instance.createPlaylist(newPlaylistName, props.user?.id);
      await instance.addTracksToPlaylist(playlistId, uris);
      await props.fetchUserPlaylists();

      props.setVisible(false);
      props.setSnackBar({ visible: true, description: `${props.selectedTracks.size} track(s) added!` });
    }
    catch (error) {
      props.setSnackBar({ visible: true, description: 'Something went wrong while creating a new playlist' });
    }
  };

  return (
    <Portal>
      <Dialog
        visible={props.visible}
        onDismiss={() => props.setVisible(false)}
        style={styles.modalStyle}
      >
        <Dialog.Title>{isCreate ? 'Create a New Playlist ' : 'Select a playlist'}</Dialog.Title>
        <Dialog.Content>
          {
            isCreate ?
              <TextInput
                label='Name'
                value={newPlaylistName}
                onChangeText={(text) => setNewPlaylistName(text)}
                autoFocus={true}
              />
              :
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
          }
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => props.setVisible(false)}>Cancel</Button>
          {
            isCreate ?
              <Button disabled={newPlaylistName === ''} onPress={handleCreatePlaylist}>Create</Button> :
              <Button onPress={handleAddToPlaylist}>Select</Button>
          }
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.reducer.user,
  userPlaylists: state.reducer.userPlaylists,
});

const mapDispatchToProps = (dispatch: Function) => ({
  setSnackBar: (snackBar: iSnackBar) => dispatch(setSnackBar(snackBar)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(AddToPlaylistModal));