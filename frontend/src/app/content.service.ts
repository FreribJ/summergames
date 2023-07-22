import {Injectable} from '@angular/core';
import {Activity, AdminActivity, Game, Guess, ROActivity, ROGuess, Team} from "./model/models";
import {Observable} from "rxjs";
import {RestService} from "./rest.service";

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  //TODO: make continuous Abfragen bei Observables mit möglichkeit von deabonnieren und evtl. nur neue laden

  teams: Team[] = []
  team: Team[] = []

  private games: Game[] = []

  private activities: Activity[] = []

  constructor(private rest: RestService) {
  }

  getTeam(): Promise<Team> {
    return new Promise<Team>((resolve, reject) => {
      if (this.team.length > 0) {
        return resolve(this.team[0])
      } else {
        let temp = this.team
        this.rest.getTeam().subscribe({
          next(team) {
            resolve(team)
            temp.push(team)
          },
          error(error) {
            reject(error)
          }
        })
      }
    })
  }

  getTeams(): Promise<Team[]> {
    return new Promise<Team[]>((resolve, reject) => {
      if (this.teams.length > 0) {
        resolve(this.teams)
      } else {
        let temp = this.teams
        this.rest.getTeams().subscribe({
          next(teams) {
            temp.push(...teams)
            resolve(teams)
          },
          error(error) {
            reject(error)
          }
        })
      }
    })
  }

  getAllTeams(): Promise<Team[]> {
    return new Promise<Team[]>((resolve, reject) => {
      let temp = this.teams
      this.rest.getAllTeams().subscribe({
        next(teams) {
          resolve(teams)
        },
        error(error) {
          reject(error)
        }
      })
    })
  }

  getActivities(): Observable<Activity[]> {
    //TODO: continuos refresh
    return new Observable<Activity[]>(subscriber => {
      if (this.activities.length > 0) {
        subscriber.next(this.activities)
      } else {
        let service = this
        this.rest.getActivities().subscribe({
          next(roactivities) {
            parseROActivities(roactivities, service).then(result => subscriber.next(result))
          }
        })
      }
      // })
      // }, 10000)
    })

    // return () => {
    //clearInterval(interval)

  }

  getAllActivities(): Observable<AdminActivity[]> {
    //TODO: continuos refresh
    return new Observable<AdminActivity[]>(subscriber => {
      let service = this
      this.rest.getAllActivities().subscribe({
        next(roactivities) {
          parseAdminROActivities(roactivities, service).then(result => subscriber.next(result))
        }
      })
    })
  }

  getGames(): Promise<Game[]> {
    return new Promise<Game[]>((resolve, reject) => {
      if (this.games.length > 0) {
        resolve(this.games)
      } else {
        // let temp: Game[] = this.games
        this.rest.getGames().subscribe({
          next(games) {
            // temp.push(...games)
            resolve(games)
          }, error(error) {
            reject(error)
          }
        })
      }
    })
  }

  checkLogin(): Observable<{ admin: boolean }> {
    return this.rest.getLogin()
  }

  login(idTeam: number, password: string) {
    return this.rest.postLogin(idTeam, password)
  }

  newActivity(gameId: number, opponentId: number, state: 'won' | 'lost') {
    return this.rest.postActivity(gameId, opponentId, state)
  }

  editActivity(activityId: number, winnerId: number) {
    return this.rest.putActivity(activityId, winnerId)
  }

  editAdminActivity(activityId: number, gameId: number, team1Id: number, team2Id: number, winnerId: number | null) {
    return this.rest.putAdminActivity(activityId, gameId, team1Id, team2Id, winnerId)
  }

  getGuess() {
    return this.rest.getGuess()
  }

  putGuess(guess: number) {
    return this.rest.putGuess(guess)
  }

  getAllGuess() {
    return new Observable<Guess[]>(subscriber => {
      let service = this
      this.rest.getAllGuess().subscribe({
        next(roguesses) {
          parseROGuess(roguesses, service).then(result => subscriber.next(result))
        }
      })
    })
  }
  getFoundEastereggs() {
    return this.rest.getFoundEastereggs()
  }
  postEasteregg(id: number) {
    return this.rest.postEasteregg(id)
  }
}

async function parseROGuess(roguesses: ROGuess[], service: ContentService) {
  let teams: Team[] = []
  await service.getTeams().then(t => teams = t)

  console.log(teams)
  const result: Guess[] = []
  roguesses.forEach(g => {
    const team = teams.find(t => t.id == g.id_team)
    if (!team)
      throw Error('No team found')

    const guess: Guess = {team: team, guess: g.guess}
    result.push(guess)
  })
  return result
}

async function parseROActivities(roactivites: ROActivity[], service: ContentService): Promise<Activity[]> {

  let games: Game[] = []
  await service.getGames().then(g => games = g)
  let teams: Team[] = []
  await service.getTeams().then(t => teams = t)
  let team: Team
  await service.getTeam().then(t => team = t)

  const result: Activity[] = []
  roactivites.forEach(a => {
    const game = games.find(g => g.id === a.id_game)
    if (!game)
      throw Error('No game found')

    const opponent = teams.find(t => t.id !== team.id && (t.id == a.id_team1 || t.id == a.id_team2))
    if (!opponent)
      throw Error('No opponent found')

    let state: 'open' | 'lost' | 'won'
    if (!a.id_winner)
      state = "open"
    else
      state = a.id_winner == team.id ? "won" : "lost"

    const activity: Activity = {id: a.id, game: game, opponent: opponent, state: state, plan: a.plan}
    result.push(activity)
  })
  return result
}

async function parseAdminROActivities(roactivites: ROActivity[], service: ContentService): Promise<AdminActivity[]> {

  let games: Game[] = []
  await service.getGames().then(g => games = g)
  let teams: Team[] = []
  await service.getTeams().then(t => teams = t)
  let team: Team
  await service.getTeam().then(t => team = t)

  const result: AdminActivity[] = []
  roactivites.forEach(a => {
    const game = games.find(g => g.id === a.id_game)
    if (!game)
      throw Error('No game found')

    const team1 = teams.find(t => t.id == a.id_team1)
    if (!team1)
      throw Error('No opponent found')

    const team2 = teams.find(t => t.id == a.id_team2)
    if (!team2)
      throw Error('No opponent found')

    const winner = teams.find(t => t.id == a.id_winner)

    const activity: AdminActivity = {id: a.id, game: game, team1: team1, team2: team2, winner: winner ? winner : {id: -1}, plan: a.plan, ts: a.ts}
    result.push(activity)
  })
  return result
}

