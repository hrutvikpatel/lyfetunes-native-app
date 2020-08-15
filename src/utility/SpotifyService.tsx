import {
  auth as SpotifyAuth,
  remote as SpotifyRemote,
  ApiScope,
  ApiConfig,
  SpotifySession,
  RepeatMode,
  Artist
} from 'react-native-spotify-remote';

import {
  // @ts-ignore
  SPOTIFY_CLIENT_ID,
  // @ts-ignore
  SPOTIFY_REDIRECT_URL,
  // @ts-ignore
  tokenRefreshURL,
  // @ts-ignore
  tokenSwapURL
} from 'react-native-dotenv';

import axios from 'axios';

import {
  iSpotifyService, iTrack, iArtist,

} from './MusicService';

class SpotifyService implements iSpotifyService {

  private static instance: SpotifyService;
  private _session: SpotifySession;
  private _spotifyConfig: ApiConfig;

  constructor() {
    this._spotifyConfig = {
      clientID: SPOTIFY_CLIENT_ID,
      redirectURL: SPOTIFY_REDIRECT_URL,
      tokenRefreshURL: tokenRefreshURL,
      tokenSwapURL: tokenSwapURL,
      scopes: [
        ApiScope.AppRemoteControlScope, 
        ApiScope.PlaylistReadPrivateScope,
        ApiScope.UserLibraryReadScope,
        ApiScope.UserTopReadScope,
      ]
    };
    this._session = {
      accessToken: '',
      refreshToken: '',
      expirationDate: '',
      scope: ApiScope.AppRemoteControlScope,
      expired: false,
    };
  };

  static getInstance = () => {
    if (!SpotifyService.instance) {
      SpotifyService.instance = new SpotifyService();
    }
    return SpotifyService.instance;
  }

  authorize = async(): Promise<void> => {
    try {
      SpotifyRemote.disconnect();
      SpotifyAuth.endSession();

      this._session = await SpotifyAuth.authorize(this._spotifyConfig);
      // await SpotifyRemote.connect(this._session.accessToken);
    }
    catch(error) {
      console.warn(JSON.stringify(error));
      throw 'Please try again';
    }
  };

  getToken = () => this._session?.accessToken;

  setToken = (token: string) => {
    if (this._session) {
      this._session.accessToken = token;
    }
    else {
      this._session = {
        accessToken: token,
        refreshToken: '',
        expirationDate: '',
        scope: ApiScope.AppRemoteControlScope,
        expired: false,
      }
    }
  };

  getSeedArtists = async(): Promise<string[]> => {
    const seedArtists: string[] = [];
    const URL = 'https://api.spotify.com/v1/me/top/artists';
    const config = {
      params: {
        limit: 50,
        time_range: 'long_term',
      },
      headers: { Authorization: `Bearer ${this._session.accessToken}` }
    };
    const result = await axios.get(URL, config);

    result?.data?.items?.forEach(({ id }: any) => seedArtists.push(id) );

    return seedArtists;
  };

  getTopNonPlayableTracks = async(): Promise<Set<string>> => {
    const nonPlayableTracks: Set<string> = new Set<string>();
    const URL = 'https://api.spotify.com/v1/me/top/tracks';
    const config = {
      params: {
        limit: 50,
        time_range: 'short_term',
      },
      headers: { Authorization: `Bearer ${this._session.accessToken}` }
    };
    const result = await axios.get(URL, config);

    result?.data?.items?.forEach(({ id }: any) => nonPlayableTracks.add(id) );

    return nonPlayableTracks;
  };

  getPlayableTracks = (newTrackIds: string[], alreadyPlayedTrackIds: Set<string>): any => {
    const playableTracks: string[] = [];
    const nonPlayableTracks: Set<string> = new Set<string>(alreadyPlayedTrackIds);

    newTrackIds.forEach((trackId) => {
      if (!nonPlayableTracks.has(trackId)) {
        nonPlayableTracks.add(trackId);
        playableTracks.push(trackId);
      }
    });

    return { playableTracks, nonPlayableTracks }
  };

  getRandomSeedArtists = (seedArtists: string[]): string[] => {
    let randomAmount = 5;
    const result = new Array(randomAmount);
    let length = seedArtists.length;
    let taken = new Array(length);

    while (randomAmount--) {
        const x = Math.floor(Math.random() * length);
        result[randomAmount] = seedArtists[x in taken ? taken[x] : x];
        taken[x] = --length in taken ? taken[length] : length;
    }
    return result;
  };

  getServeralTracks = async(trackIds: string[]): Promise<iTrack[]> => {
    const _trackIds = [...trackIds];
    const tracks: iTrack[] = [];
    const URL = 'https://api.spotify.com/v1/tracks';
    let config = {
      params: {
        ids: '',
      },
      headers: { Authorization: `Bearer ${this._session.accessToken}` }
    };

    while (_trackIds.length > 0) {
      const batch = _trackIds.splice(0, 50);
      config.params.ids = batch.join(',');
      const result = await axios.get(URL, config);

      result?.data?.tracks.forEach(({ album, artists, duration_ms, name, preview_url, uri }: any) => {
        if (preview_url) {

          const imageUrl = album?.images[0] ? album?.images[0].url : '';

          const _artists: iArtist[] = [];
          artists.forEach((artist: any) => {
            _artists.push({
              id: artist.id,
              name: artist.name,
            });
          });

          tracks.push({
            artists: _artists,
            imageUrl,
            duractionMs: duration_ms,
            name,
            previewUrl: preview_url,
            uri,
          });
        }
      });
    }

    return tracks;
  };

  getRecommendations = async(seedArtists: string[]): Promise<string[]> => {
    const URL = 'https://api.spotify.com/v1/recommendations';
    
    const config = {
      params: {
        limit: 100,
        seed_artists: this.getRandomSeedArtists(seedArtists).join(','),
      },
      headers: { Authorization: `Bearer ${this._session.accessToken}` }
    };

    const result = await axios.get(URL, config);

    const trackIds: string[] = [];

    result?.data?.tracks.forEach(({ id }: any)=> {
        trackIds.push(id);
    });

    return trackIds;
  };

};

export default SpotifyService;
