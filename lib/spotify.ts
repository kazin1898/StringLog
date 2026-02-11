

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
const SPOTIFY_SEARCH_URL = 'https://api.spotify.com/v1/search'

let cachedToken: { token: string; expires: number } | null = null

interface SpotifyAPIResponse {
  tracks: {
    items: Array<{
      id: string
      name: string
      artists: Array<{ name: string }>
      album: {
        name: string
        images: Array<{ url: string }>
      }
      preview_url: string | null
      external_urls: {
        spotify: string
      }
    }>
  }
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expires > Date.now()) {
    return cachedToken.token
  }

  const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  const client_secret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET

  if (!client_id || !client_secret) {
    throw new Error('Spotify credentials not found. Please set NEXT_PUBLIC_SPOTIFY_CLIENT_ID and NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET in .env.local')
  }

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
    },
    body: 'grant_type=client_credentials'
  })

  if (!response.ok) {
    throw new Error('Failed to get Spotify access token')
  }

  const data = await response.json()
  

  cachedToken = {
    token: data.access_token,
    expires: Date.now() + (data.expires_in * 1000)
  }
  

  return data.access_token
}



export interface SpotifyTrack {
  id: string
  name: string
  artist: string
  album: string
  albumArt: string
  albumArtSmall: string
  previewUrl?: string
  spotifyUrl: string
}

export async function searchTracks(query: string): Promise<SpotifyTrack[]> {
  const token = await getAccessToken()
  

  const response = await fetch(
    `${SPOTIFY_SEARCH_URL}?q=${encodeURIComponent(query)}&type=track&limit=20`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to search Spotify tracks')
  }

  const data: SpotifyAPIResponse = await response.json()
  

  return data.tracks.items.map((track) => ({
    id: track.id,
    name: track.name,
    artist: track.artists[0].name,
    album: track.album.name,
    albumArt: track.album.images[0]?.url || '',
    albumArtSmall: track.album.images[2]?.url || track.album.images[0]?.url || '',
    previewUrl: track.preview_url || undefined,
    spotifyUrl: track.external_urls.spotify
  }))
}
