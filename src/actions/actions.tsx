import { iTrack } from "../utility/MusicService";

// action types
export const SET_SEED_ARTISTS = 'SET_SEED_ARTISTS';
export const SET_IS_NOT_NEW_TRACK = 'SET_IS_NOT_NEW_TRACK';
export const SET_TRACKS = 'SET_TRACKS';

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
})

