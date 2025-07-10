import {Game, Team} from "./objects";

export interface AdminActivity {
  id: number
  game: Game
  team1: Team
  team2: Team
  winner?: Team
  plan: boolean
  timestamp?: Date
}

export interface AdminTeam extends Team {
  password: string
}

export interface AdminGuess {
  team: Team
  guess: number
}

export interface AdminGuess {
  team: Team
  guess: number
}

export interface AdminEasterEgg {
  id: number
  id_team: number
}
