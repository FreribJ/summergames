import {Injectable} from '@angular/core';
import {Activity, Game, Team} from "./model/objects";
import {Observable, Subscription} from "rxjs";
import {RestService} from "./rest.service";
import {AdminActivity, AdminGuess, AdminTeam} from "./model/adminObjects";
import {ROActivity, ROGuess} from "./model/restObject";

let games: Game[] = []
let teams: Team[] = []
let myTeam: Team
let activities: Activity[] = []

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  activeSubscription?: Subscription

  constructor(private rest: RestService) {
  }

  getGames(): Promise<Game[]> {
    return new Promise<Game[]>((resolve, reject) => {
      if (games.length > 0) {
        resolve(games)
      } else {
        // const temp: Game[] = this.games
        this.rest.getGames().subscribe({
          next(g) {
            games = g
            resolve(g)
          }, error(error) {
            reject(error)
          }
        })
      }
    })
  }

  getTeam(): Promise<Team> {
    return new Promise<Team>((resolve, reject) => {
      if (myTeam) {
        resolve(myTeam)
      } else {
        this.rest.getTeam().subscribe({
          next(t) {
            myTeam = t
            resolve(t)
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
      if (teams.length > 0) {
        resolve(teams)
      } else {
        this.rest.getTeams().subscribe({
          next(t) {
            teams = t
            resolve(t)
          },
          error(error) {
            reject(error)
          }
        })
      }
    })
  }

  getAdminTeams(): Promise<AdminTeam[]> {
    return new Promise<AdminTeam[]>((resolve, reject) => {
      this.rest.getAdminTeams().subscribe({
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
        if (activities.length > 0)
          subscriber.next(activities)

        let service = this
        if (this.activeSubscription)
          this.activeSubscription.unsubscribe()

        this.activeSubscription = this.rest.getActivities().subscribe({
          next(roactivities) {
            parseROActivities(roactivities, service).then(result => {
              activities = result
              subscriber.next(result)
              subscriber.complete()
            })
          },
          error(err) {
            if (activities.length > 0)
              alert('Die Verbindung zum Server wurde unterbrochen. Es gibt eventuell neue Aktivitäten. Bitte laden die Seite neu.')
            console.error(err)
          }
        })
      }
    )
  }

  getAdminActivities()
    :
    Observable<AdminActivity[]> {
    //TODO: continuos refresh
    return new Observable<AdminActivity[]>(subscriber => {
      let service = this
      this.rest.getAdminActivities().subscribe({
        next(roactivities) {
          parseAdminROActivities(roactivities, service).then(result => subscriber.next(result))
        }
      })
    })
  }

  checkLogin():
    Observable<{ admin: boolean, easterEggs: number }> {
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

  deleteAdminActivity(activityId: number) {
    return this.rest.deleteAdminActivity(activityId)
  }

  getGuess() {
    return this.rest.getGuess()
  }

  putGuess(guess: number
  ) {
    return this.rest.putGuess(guess)
  }

  getAdminGuesses() {
    return new Observable<AdminGuess[]>(subscriber => {
      let service = this
      this.rest.getAllGuess().subscribe({
        next(roguesses) {
          parseROAdminGuess(roguesses, service).then(result => subscriber.next(result))
        }
      })
    })
  }

  getFoundEastereggs() {
    return this.rest.getFoundEasterEggs()
  }

  postEasteregg(id: number
  ) {
    return this.rest.postEasterEgg(id)
  }
}

async function parseROAdminGuess(roguesses: ROGuess[], service: ContentService) {
  let teams: Team[] = []
  await service.getTeams().then(t => teams = t)

  console.log(teams)
  const result: AdminGuess[] = []
  roguesses.forEach(g => {
    const team = teams.find(t => t.id == g.id_team)
    if (!team)
      throw Error('No team found')

    const guess: AdminGuess = {team: team, guess: g.guess}
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

    const activity: AdminActivity = {
      id: a.id,
      game: game,
      team1: team1,
      team2: team2,
      winner: winner ? winner : {id: -1},
      plan: a.plan,
      ts: a.ts
    }
    result.push(activity)
  })
  return result
}

