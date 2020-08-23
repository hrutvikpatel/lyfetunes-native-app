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
  iSpotifyService, iTrack, iArtist, iUserPlaylists,

} from './MusicService';

class SpotifyService implements iSpotifyService {

  private static instance: SpotifyService;
  private _session: SpotifySession;
  private _spotifyConfig: ApiConfig;

  constructor() {
    this._spotifyConfig = {
      clientID: SPOTIFY_CLIENT_ID,
      redirectURL: SPOTIFY_REDIRECT_URL,
      tokenRefreshURL: 'http://64.227.109.86:3000/refresh',
      tokenSwapURL: 'http://64.227.109.86:3000/swap',
      scopes: [
        ApiScope.AppRemoteControlScope,
        ApiScope.PlaylistReadPrivateScope,
        ApiScope.UserLibraryReadScope,
        ApiScope.UserTopReadScope,
        ApiScope.UserReadPrivateScope,
        ApiScope.PlaylistModifyPrivateScope,
        ApiScope.PlaylistModifyPublicScope,
      ],
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

  authorize = async (): Promise<void> => {
    try {
      SpotifyRemote.disconnect();
      SpotifyAuth.endSession();

      this._session = await SpotifyAuth.authorize(this._spotifyConfig);
      // await SpotifyRemote.connect(this._session.accessToken);
    }
    catch (error) {
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

  getSeedArtists = async (): Promise<string[]> => {
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

    result?.data?.items?.forEach(({ id }: any) => seedArtists.push(id));

    return seedArtists;
  };

  getTopNonPlayableTracks = async (): Promise<Set<string>> => {
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

    result?.data?.items?.forEach(({ id }: any) => nonPlayableTracks.add(id));

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

    return { playableTracks, nonPlayableTracks };
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

  getServeralTracks = async (trackIds: string[]): Promise<iTrack[]> => {
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

  getRecommendations = async (seedArtists: string[]): Promise<string[]> => {
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

    result?.data?.tracks.forEach(({ id }: any) => {
      trackIds.push(id);
    });

    return trackIds;
  };

  getUser = async (): Promise<any> => {
    const URL = 'https://api.spotify.com/v1/me';
    const config = { headers: { Authorization: `Bearer ${this._session.accessToken}` } };
    const { data } = await axios.get(URL, config);
    return data;
  };

  getUserPlaylists = async (userId: string): Promise<iUserPlaylists[]> => {

    let result = undefined;
    const userPlaylists: iUserPlaylists[] = [];
    let URL = 'https://api.spotify.com/v1/me/playlists';
    let config = {
      params: {
        limit: 50,
      },
      headers: { Authorization: `Bearer ${this._session.accessToken}` }
    };

    const extractPlaylists = (data?: any) => {
      data?.items?.forEach(({ id, name, tracks, owner }: any) => {
        if (owner?.id === userId && tracks) {
          userPlaylists.push({
            id,
            name,
            totalTracks: tracks?.total,
          });
        }
      })
    };

    do {
      if (result !== undefined) URL = result?.data?.next;

      result = await axios.get(URL, config);
      extractPlaylists(result?.data);
    }
    while (result?.data?.next !== null);

    userPlaylists.sort((a: iUserPlaylists, b: iUserPlaylists) => a.name.localeCompare(b.name));

    return userPlaylists;
  };

  addTracksToPlaylist = async (playlistId: string, uris: string[]): Promise<void> => {
    const URL = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    const config = { headers: { Authorization: `Bearer ${this._session.accessToken}` } };

    while (uris.length > 0) {
      const batch = uris.splice(0, 100);
      await axios.post(
        URL,
        {
          uris: batch
        },
        config
      );
    }
  };

  createPlaylist = async (playlistName: string, userId: string): Promise<string> => {
    const URL = `https://api.spotify.com/v1/users/${userId}/playlists`;
    const config = { headers: { Authorization: `Bearer ${this._session.accessToken}` } };

    const result = await axios.post(
      URL,
      {
        name: playlistName,
        public: false,
      },
      config,
    );

    return result.data.id;
  }

};

export default SpotifyService;
