export interface ROActivities {
  activities: ROActivity[]
  lastUpdate: number
}

export interface ROActivity {
  id: number
  id_game: number
  id_team1: number
  id_team2: number
  id_winner?: number
  plan: boolean
  timestamp?: string
}

export interface ROGuess {
  id_team: number
  guess: number
}
