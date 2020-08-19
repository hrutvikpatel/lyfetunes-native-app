
import {
  SET_IS_NOT_NEW_TRACK,
  SET_SEED_ARTISTS,
  SET_TRACKS,
  SET_SAVED_TRACKS,
  SET_CURRENT_TRACK_INDEX,
  SET_AUDIO
} from '../actions/actions';
import { iTrack } from '../utility/MusicService';

export interface iReducerState {
  seedArtists: string[],
  isNotNewTrackSet: Set<string>,
  tracks: iTrack[],
  savedTracks: iTrack[],
  currentTrackIndex: number,
  audio: any,
};

export const initialState: iReducerState = {
  seedArtists: [],
  isNotNewTrackSet: new Set(),
  tracks: [],
  savedTracks: [],
  currentTrackIndex: 0,
  audio: undefined,
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
    default:
      return state;
  }
}

export default reducer;
