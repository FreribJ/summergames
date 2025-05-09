import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Activity, Game, Team} from "./model/objects";
import {AdminTeam} from "./model/adminObjects";
import {ROActivities, ROActivity, ROGuess} from "./model/restObject";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RestService {

  BACKEND_IP = `${environment.production ? window.location.origin : environment.api}${environment.apiPrefix}`;

  constructor(private http: HttpClient) { }

  getTeam(): Observable<Team> {
    return this.http.get<Team>(`${this.BACKEND_IP}/team`, {withCredentials:true})
  }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.BACKEND_IP}/teams`)
  }

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.BACKEND_IP}/games`, {withCredentials:true})
  }

  getAdminTeams(): Observable<AdminTeam[]> {
    return this.http.get<AdminTeam[]>(`${this.BACKEND_IP}/admin/teams`, {withCredentials:true})
  }

  postLogin(teamId: number, password: string): Observable<any> {
    return this.http.post<any>(`${this.BACKEND_IP}/login`, {id: teamId, password}, {withCredentials: true})
  }

  getLogin(): Observable<{admin: boolean, easterEggs: number}> {
    return this.http.get<{ admin: boolean, easterEggs: number }>(`${this.BACKEND_IP}/checkLogin`, {withCredentials:true})
  }
  getActivities(since: number): Observable<ROActivities> {
    if (since)
      return this.http.get<ROActivities>(`${this.BACKEND_IP}/activities?since=${since}`, {withCredentials:true})
    else
      return this.http.get<ROActivities>(`${this.BACKEND_IP}/activities`, {withCredentials:true})
  }

  getAdminActivities(): Observable<ROActivity[]> {
    return this.http.get<ROActivity[]>(`${this.BACKEND_IP}/admin/activities`, {withCredentials:true})
  }

  postActivity(gameId: number, opponentId: number, state: 'won'|'lost'): Observable<Activity> {
    return this.http.post<Activity>(`${this.BACKEND_IP}/activity`, {gameId, opponentId, state}, {withCredentials:true})
  }

  putActivity(activityId: number, winnerId: number): Observable<Activity> {
    return this.http.put<Activity>(`${this.BACKEND_IP}/activity/${activityId}`, {winnerId}, {withCredentials:true})
  }

  putAdminActivity(activityId: number, gameId: number, team1Id: number, team2Id: number, winnerId: number | null): Observable<Activity> {
    return this.http.put<Activity>(`${this.BACKEND_IP}/admin/activity/${activityId}`, {gameId, team1Id, team2Id, winnerId}, {withCredentials:true})
  }

  deleteAdminActivity(activityId: number) {
    return this.http.delete<any>(`${this.BACKEND_IP}/admin/activity/${activityId}`, {withCredentials:true})
  }

  getGuess(): Observable<number> {
    return this.http.get<number>(`${this.BACKEND_IP}/guess`, {withCredentials:true})
  }

  putGuess(guess: number): Observable<number> {
    return this.http.put<number>(`${this.BACKEND_IP}/guess`, {guess}, {withCredentials:true})
  }

  getAllGuess(): Observable<ROGuess[]> {
    return this.http.get<ROGuess[]>(`${this.BACKEND_IP}/admin/guess`, {withCredentials:true})
  }

  getFoundEasterEggs() {
    return this.http.get<{id: number}[]>(`${this.BACKEND_IP}/eastereggs`, {withCredentials:true})
  }
  postEasterEgg(id: number) {
    return this.http.post(`${this.BACKEND_IP}/easteregg`, {id}, {withCredentials:true})
  }

  getAcceptEntries(): Observable<{acceptEntries: boolean}> {
    return this.http.get<{acceptEntries: boolean}>(`${this.BACKEND_IP}/admin/acceptentries`, {withCredentials:true})
  }

  putAcceptEntries(acceptEntries: boolean)  {
    return this.http.put<{acceptEntries: boolean}>(`${this.BACKEND_IP}/admin/acceptentries`, {acceptEntries}, {withCredentials:true})
  }

  postTeamCreate(newTeamName: string , password: string): Observable<any> {
    return this.http.post<any>(`${this.BACKEND_IP}/team/create`, {newTeamName, password})
  }

  putTeamUpdate(updatedTeamName: string , updatedTeamMate1: string , updatedTeamMate2: string) {
    return this.http.put<any>(`${this.BACKEND_IP}/team/update`, {updatedTeamName, updatedTeamMate1, updatedTeamMate2}, {withCredentials:true})
  }
}

