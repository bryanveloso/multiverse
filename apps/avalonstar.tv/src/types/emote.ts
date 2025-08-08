export interface Emote {
  name: string
  imageUrl: string
  estimatedDate?: Date
}

export interface Artist {
  artist: string
  artistUrl?: string
  emotes: Emote[]
}

export interface EmoteWithArtist extends Emote {
  artist: string
  artistUrl?: string
}