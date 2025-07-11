export interface Activity {
  id: number
  game: Game
  opponent: Team
  state: 'won' | 'lost' | 'open'
  plan: boolean
  timestamp?: Date
}

export interface Team {
  id: number
  name: string
  partner1: string
  partner2: string
  clique: 'jannes' | 'mattes'
  passwordSet: boolean
}

export interface Game {
  id: number
  name: string
  description: string
}

export interface Easteregg {
  id: number,
  srcImage: string,
  title: string
  text?: string
}
