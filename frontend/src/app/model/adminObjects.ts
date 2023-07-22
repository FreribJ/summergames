import {Game, Team} from "./objects";

export interface AdminActivity {
  id: number
  game: Game
  team1: Team
  team2: Team
  winner: Team | { id: -1 }
  plan: boolean
  ts: any
}

export interface AdminTeam extends Team {
  password: string
}

export interface AdminGuess {
  team: Team
  guess: number
}
