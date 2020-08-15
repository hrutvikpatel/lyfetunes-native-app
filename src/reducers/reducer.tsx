
import {
  SET_IS_NOT_NEW_TRACK,
  SET_SEED_ARTISTS,
  SET_TRACKS,
} from '../actions/actions';
import { iTrack } from '../utility/MusicService';

export interface iReducerState {
  seedArtists: string[],
  isNotNewTrackSet: Set<string>,
  tracks: iTrack[],
};

export const initialState: iReducerState = {
  seedArtists: [],
  isNotNewTrackSet: new Set(),
  tracks: [],
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
      default: 
          return state;
  }
}

export default reducer;
