//TODO: Models in admin, ro und normal aufteilen
export interface Activity {
  id?: number
  game: Game
  opponent: Team
  state: 'won' | 'lost' | 'open'
  plan: boolean
}

export interface AdminActivity {
  id: number
  game: Game
  team1: Team
  team2: Team
  winner: Team | { id: -1 }
  plan: boolean
  ts: any
}

export interface ROActivity {
  id: number
  id_game: number
  id_team1: number
  id_team2: number
  id_winner?: number
  plan: boolean
  ts: any
}

export interface Team {
  id: number
  name: string
  partner1: string
  partner2: string
  clique: 'jannes' | 'mattes'
  password?: string
}

export interface Game {
  id: number
  name: string
}

export interface Guess {
  team: Team
  guess: number
}

export interface ROGuess {
  id_team: number
  guess: number
}

export interface Easteregg {
  id: number,
  srcImage: string,
  title: string
  text: string
}
