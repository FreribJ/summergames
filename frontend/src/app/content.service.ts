import {Injectable} from '@angular/core';
import {Activity, Game, Team} from "./model/objects";
import {Observable, Subscription} from "rxjs";
import {RestService} from "./rest.service";
import {AdminActivity, AdminGuess, AdminTeam} from "./model/adminObjects";
import {ROActivity, ROGuess} from "./model/restObject";
import {Router} from "@angular/router";

let games: Game[] = []
let teams: Team[] = []
let myTeam: Team
let activities: Activity[]

//Adjust as needed
const REFRESH_INTERVAL = 1000 * 30
const MAX_FAILED_ATTEMPTS = 2 * 5

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  activeSubscription?: Subscription
  activeInterval?: number

  constructor(private rest: RestService, private router: Router) {
  }

  logout(): void {
    this.deleteAllCookies()
  }

  private deleteAllCookies() {
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;

      // Cookie für alle Pfade löschen
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
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

  failedAttempts = 0
  lastUpdate = 0

  getActivities(): Observable<Activity[]> {
    return new Observable<Activity[]>(subscriber => {
        //Wenn noch keine Daten geladen wurde, erstelle das Array
        if (activities)
          subscriber.next(activities)
        else
          activities = []

        this.failedAttempts = 0
        let service = this
        if (this.activeSubscription)
          this.activeSubscription.unsubscribe()


        this.activeSubscription = this.rest.getActivities(this.lastUpdate).subscribe({
          next(roactivities) {

            if (roactivities) {
              service.lastUpdate = roactivities.lastUpdate
              parseROActivities(roactivities.activities, service).then(result => {
                service.failedAttempts = 0
                activities = mergeArraysAndOverrideById(activities, result)
                subscriber.next(activities)
              })
            }
          },
          error(err) {
            service.failedAttempts++
            if (activities.length == 0) {
              alert('Es konnte keine Verbindung mit dem Server hergestellt werden. Bitte versuch die Seite neu zu laden.')

              if (service.activeSubscription)
                service.activeSubscription.unsubscribe()
              subscriber.complete()
            }
            if (service.failedAttempts == MAX_FAILED_ATTEMPTS)
              alert('Es konnten eine lange Zeit keine neuen Daten vom Server geladen werden. Bitte versuch die Seite neu zu laden.')
          }
        })

        clearInterval(this.activeInterval)
        //TODO: Check if window is focused --> Only update if focused
        // @ts-ignore
        this.activeInterval = setInterval(() => {
          if (!service.activeSubscription || service.activeSubscription.closed) {
            service.activeSubscription = service.rest.getActivities(this.lastUpdate).subscribe({
              next(roactivities) {
                if (roactivities) {
                  service.lastUpdate = roactivities.lastUpdate
                  parseROActivities(roactivities.activities, service).then(result => {
                    service.failedAttempts = 0
                    activities = mergeArraysAndOverrideById(activities, result)
                    subscriber.next(activities)

                  })
                }
              },
              error(err) {
                service.failedAttempts++
                if (service.failedAttempts == 6)
                  alert('Es konnten eine lange Zeit keine neuen Daten vom Server geladen werden. Bitte versuch die Seite neu zu laden.')
              }
            })
          }
        }, REFRESH_INTERVAL)

        return () => {
          if (this.activeSubscription)
            this.activeSubscription.unsubscribe()
          clearInterval(this.activeInterval)
        }
      }
    )
  }

  getAdminActivities(): Observable<AdminActivity[]> {
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

  updateTeam(updatedTeamName: string, updatedTeamMate1: string, updatedTeamMate2: string) {
    return new Observable<boolean>(subscriber => {
      this.rest.putTeamUpdate(updatedTeamName, updatedTeamMate1, updatedTeamMate2).subscribe(value => {
        myTeam.name = updatedTeamName;
        myTeam.partner1 = updatedTeamMate1;
        myTeam.partner2 = updatedTeamMate2;
        subscriber.next(true);
      }, error => subscriber.next(false));
    })
  }

  createTeam(newTeamName: string, password: string) {
    return this.rest.postTeamCreate(newTeamName, password);
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

  getAdminFoundEastereggs() {
    return this.rest.getAllFoundEasterEggs()
  }

  postEasteregg(id: number) {
    return this.rest.postEasterEgg(id)
  }

  getAcceptEntries() {
    return this.rest.getAcceptEntries()
  }

  setAcceptEntries(accept: boolean) {
    return this.rest.putAcceptEntries(accept)
  }
}

async function parseROAdminGuess(roguesses: ROGuess[], service: ContentService) {
  let teams: Team[] = []
  await service.getTeams().then(t => teams = t)

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

    const timestamp = a.timestamp ? new Date(a.timestamp) : undefined

    const activity: Activity = {
      id: a.id,
      game: game,
      opponent: opponent,
      state: state,
      plan: a.plan,
      timestamp: timestamp
    }
    result.push(activity)
  })
  return result
}

async function parseAdminROActivities(roactivites: ROActivity[], service: ContentService): Promise<AdminActivity[]> {

  let games: Game[] = []
  await service.getGames().then(g => games = g)
  let teams: Team[] = []
  await service.getTeams().then(t => teams = t)

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

    const timestamp = a.timestamp ? new Date(a.timestamp) : undefined

    const activity: AdminActivity = {
      id: a.id,
      game: game,
      team1: team1,
      team2: team2,
      winner: winner,
      plan: a.plan,
      timestamp: timestamp
    }
    result.push(activity)
  })
  return result
}

function mergeArraysAndOverrideById(array1: Activity[], array2: Activity[]) {
  const mergedArray = [...array1]; // Kopiere das erste Array, um es nicht zu verändern

  array2.forEach(obj2 => {
    const index = mergedArray.findIndex(obj1 => obj1.id === obj2.id);

    if (index !== -1) {
      // Objekt mit gleicher ID gefunden, überschreibe es
      mergedArray[index] = obj2;
    } else {
      // Objekt mit neuer ID, füge es hinzu
      mergedArray.push(obj2);
    }
  });

  return mergedArray;
}

