
export enum SearchType { 
    PLAYLIST = 'playlist', 
    TRACK = 'track' 
};

export interface iArtist {
    id: string,
    name: string,
};

export interface iRecommendations {
    tracks: string[],
    poolSize: number,
    totalFetched: number,
    href: string,
};

export interface iArtist {
    id: string,
    name: string,
};

export interface iUserPlaylists {
    id: string,
    name: string,
    totalTracks: number,
}

export interface iTrack {
    artists: iArtist[],
    imageUrl: string,
    duractionMs: number,
    name: string,
    previewUrl: string,
    uri: string,
};

export interface iSpotifyService {
    authorize: () => void,
    getToken: () => string | undefined,
    setToken: (token: string) => void,
    getSeedArtists: () => Promise<string[]>,
    getTopNonPlayableTracks: () => Promise<Set<string>>,
    getPlayableTracks: (newTrackIds: string[], alreadyPlayedTrackIds: Set<string>) => any,
    getRecommendations: (seedArtists: string[]) => Promise<string[]>,
    getRandomSeedArtists: (seedArtists: string[]) => string[],
    getServeralTracks: (trackIds: string[]) => Promise<iTrack[]>,
    getUser: () => Promise<any>,
    getUserPlaylists: (userId: string) => Promise<iUserPlaylists[]>,
    addTracksToPlaylist: (playlistId: string, uris: string[]) => Promise<void>,
};
