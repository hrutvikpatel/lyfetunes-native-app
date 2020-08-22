import { iTrack, iUserPlaylists } from "../utility/MusicService";
import { iSnackBar } from "../reducers/reducer";

// action types
export const SET_SEED_ARTISTS = 'SET_SEED_ARTISTS';
export const SET_IS_NOT_NEW_TRACK = 'SET_IS_NOT_NEW_TRACK';
export const SET_TRACKS = 'SET_TRACKS';
export const SET_SAVED_TRACKS = 'SET_SAVED_TRACKS';
export const SET_CURRENT_TRACK_INDEX = 'SET_CURRENT_TRACK_INDEX';
export const SET_AUDIO = 'SET_AUDIO';
export const SET_USER = 'SET_USER';
export const SET_USER_PLAYLISTS = 'SET_USER_PLAYLISTS';
export const SET_SNACK_BAR = 'SET_SNACK_BAR';

// actions
export const setSeedArtists = (seedArtists: string[]) => ({
  type: SET_SEED_ARTISTS,
  seedArtists,
});

export const setIsNotNewTrack = (isNotNewTrackSet: Set<string>) => ({
  type: SET_IS_NOT_NEW_TRACK,
  isNotNewTrackSet,
});

export const setTracks = (tracks: iTrack[]) => ({
  type: SET_TRACKS,
  tracks,
});

export const setSavedTracks = (savedTracks: iTrack[]) => ({
  type: SET_SAVED_TRACKS,
  savedTracks,
});

export const setCurrentTrackIndex = (currentTrackIndex: number) => ({
  type: SET_CURRENT_TRACK_INDEX,
  currentTrackIndex,
});

export const setAudio = (audio: any) => ({
  type: SET_AUDIO,
  audio,
});

export const setUser = (user: any) => ({
  type: SET_USER,
  user
});

export const setUserPlaylists = (userPlaylists: iUserPlaylists[]) => ({
  type: SET_USER_PLAYLISTS,
  userPlaylists,
});

export const setSnackBar = (snackBar: iSnackBar) => ({
  type: SET_SNACK_BAR,
  snackBar,
});
