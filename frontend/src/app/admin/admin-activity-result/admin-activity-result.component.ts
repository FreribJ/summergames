import {Component} from '@angular/core';
import {ContentService} from "../../content.service";
import {Activity, Team} from "../../model/objects";
import {AdminActivity} from "../../model/adminObjects";

interface TeamResult extends Team {
  wins: number
  loses: number
  winRate: number
}

interface EasterEggsResult extends Team {
  found: number
}

interface CliqueResult {
  id: string
  name: string
  wins: number
}

@Component({
  selector: 'app-admin-activity-result',
  templateUrl: './admin-activity-result.component.html',
  styleUrls: ['./admin-activity-result.component.css']
})
export class AdminActivityResultComponent {

  //TODO: evtl. zum Schluss für alle öffentlich machen

  auswertung?: string
  activities: AdminActivity[] = []

  teamResults: TeamResult[] = []

  cliqueResults: CliqueResult[] = [
    {id: 'jannes', name: 'Jannes Clique', wins: 0},
    {id: 'mattes', name: 'Mattes Clique', wins: 0}
  ]

  easterEggResults: EasterEggsResult[] = [];

  acceptEntries?: boolean

  toggleCountdown = 5

  constructor(private service: ContentService) {
    this.service.getAcceptEntries().subscribe(value => {
      this.acceptEntries = value.acceptEntries
    })
    service.getAdminActivities().subscribe(value => {
      this.activities = value
    })
    service.getTeams().then(value => {
      value.forEach(team => {
        this.teamResults.push({...team, wins: 0, loses: 0, winRate: 0})
      })
    })
    service.getFoundEastereggs()
  }

  onToggleEntriesClick() {
    if (this.toggleCountdown > 1) {
      this.toggleCountdown--
    } else {
      if (this.acceptEntries !== undefined)
        this.service.setAcceptEntries(!this.acceptEntries).subscribe(value => {
          this.toggleCountdown = 5
          this.acceptEntries = value.acceptEntries
        })
    }
  }

  startEvaluation(evt: 'clique' | 'team' | 'eastereggs') {
    switch (evt) {
      case "team":
        this.teamResults.forEach(team => {
          team.wins = this.activities.filter(a => a.winner && a.winner.id == team.id).length
          team.loses = this.activities.filter(a => a.winner && a.winner.id != team.id && (a.team1.id == team.id || a.team2.id == team.id)).length
          team.winRate = !team.wins ? 0 : !team.loses ? 1 : team.wins / (team.wins + team.loses)
        })
        this.teamResults.sort((a, b) => {
          if (a.winRate == b.winRate)
            return 0
          if (a.winRate < b.winRate)
            return 1
          return -1
        })
        break;
      case "clique":
        this.cliqueResults.forEach(clique => {
          // @ts-ignore
          clique.wins = this.activities.filter(a => a.plan && a.winner && a.winner.clique == clique.id).length
        })
        this.cliqueResults.sort((a, b) => {
          if (a.wins == b.wins)
            return 0
          if (a.wins < b.wins)
            return 1
          return -1
        })
        break;
      case "eastereggs":
        this.auswertung = "Die Auswertung der Eastereggs ist noch nicht implementiert."
        break;
    }
  }
}
