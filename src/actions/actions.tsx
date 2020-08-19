import { iTrack } from "../utility/MusicService";

// action types
export const SET_SEED_ARTISTS = 'SET_SEED_ARTISTS';
export const SET_IS_NOT_NEW_TRACK = 'SET_IS_NOT_NEW_TRACK';
export const SET_TRACKS = 'SET_TRACKS';
export const SET_SAVED_TRACKS = 'SET_SAVED_TRACKS';
export const SET_CURRENT_TRACK_INDEX = 'SET_CURRENT_TRACK_INDEX';
export const SET_AUDIO = 'SET_AUDIO';

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
})
