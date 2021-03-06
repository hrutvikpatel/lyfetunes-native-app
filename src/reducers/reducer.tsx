
import {
  SET_IS_NOT_NEW_TRACK,
  SET_SEED_ARTISTS,
  SET_TRACKS,
  SET_SAVED_TRACKS,
  SET_CURRENT_TRACK_INDEX,
  SET_AUDIO,
  SET_USER,
  SET_USER_PLAYLISTS,
  SET_SNACK_BAR
} from '../actions/actions';
import { iTrack, iUserPlaylists } from '../utility/MusicService';

export interface iSnackBar {
  visible: boolean,
  description: string,
};

export interface iReducerState {
  seedArtists: string[],
  isNotNewTrackSet: Set<string>,
  tracks: iTrack[],
  savedTracks: iTrack[],
  currentTrackIndex: number,
  audio: any,
  user: any,
  userPlaylists: iUserPlaylists[],
  snackBar: iSnackBar,
};

export const initialState: iReducerState = {
  seedArtists: [],
  isNotNewTrackSet: new Set(),
  tracks: [],
  savedTracks: [],
  currentTrackIndex: 0,
  audio: undefined,
  user: undefined,
  userPlaylists: [],
  snackBar: {
    visible: false,
    description: '',
  }
};

const reducer = (state: iReducerState = initialState, action: any) => {
  switch (action.type) {
    case SET_SEED_ARTISTS:
      const { seedArtists } = action;
      return Object.assign({}, state, {
        seedArtists
      });
    case SET_IS_NOT_NEW_TRACK:
      const { isNotNewTrackSet } = action;
      return Object.assign({}, state, {
        isNotNewTrackSet
      });
    case SET_TRACKS:
      const { tracks } = action;
      return Object.assign({}, state, {
        tracks
      });
    case SET_SAVED_TRACKS:
      const { savedTracks } = action;
      return Object.assign({}, state, {
        savedTracks
      });
    case SET_CURRENT_TRACK_INDEX:
      const { currentTrackIndex } = action;
      return Object.assign({}, state, {
        currentTrackIndex
      });
    case SET_AUDIO:
      const { audio } = action;
      return Object.assign({}, state, {
        audio
      });
    case SET_USER:
      const { user } = action;
      return Object.assign({}, state, {
        user
      });
    case SET_USER_PLAYLISTS:
      const { userPlaylists } = action;
      return Object.assign({}, state, {
        userPlaylists
      });
    case SET_SNACK_BAR:
      const { snackBar } = action;
      return Object.assign({}, state, {
        snackBar
      });
    default:
      return state;
  }
}

export default reducer;
