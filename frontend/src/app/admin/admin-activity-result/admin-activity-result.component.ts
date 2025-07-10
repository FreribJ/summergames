import {Component, effect, signal} from '@angular/core';
import {ContentService} from "../../content.service";
import {Team} from "../../model/objects";
import {AdminActivity, AdminEasterEgg} from "../../model/adminObjects";

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

enum Evaluation {
  TEAM,
  CLIQUE,
  EASTEREGGS
}

@Component({
  selector: 'app-admin-activity-result',
  templateUrl: './admin-activity-result.component.html',
  styleUrls: ['./admin-activity-result.component.css']
})
export class AdminActivityResultComponent {

  auswertung?: Evaluation
  activities: AdminActivity[] = []
  foundEasterEggs: AdminEasterEgg[] = [];
  teamResults: TeamResult[] = []

  cliqueResults: CliqueResult[] = [
    {id: 'jannes', name: 'Jannes Clique', wins: 0},
    {id: 'mattes', name: 'Mattes Clique', wins: 0}
  ]

  easterEggResults: EasterEggsResult[] = [];

  acceptEntries: boolean = false

  loadingCount = signal(0)

  toggleCountdown = 5

  constructor(private service: ContentService) {
    this.loadingCount.update(count => count + 1)
    this.service.getAcceptEntries().subscribe(value => {
      this.acceptEntries = value.acceptEntries
      if (value.acceptEntries) {
        this.calculateResults()
      }
      this.loadingCount.update(count => count - 1)
    })

    this.loadingCount.update(count => count + 1)
    service.getAdminActivities().subscribe(value => {
      this.activities = value
      this.loadingCount.update(count => count - 1)
    })

    this.loadingCount.update(count => count + 1)
    service.getTeams().then(value => {
      value.forEach(team => {
        this.teamResults.push({...team, wins: 0, loses: 0, winRate: 0})
        this.easterEggResults.push({...team, found: 0})
      })
      this.loadingCount.update(count => count - 1)
    })

    this.loadingCount.update(count => count + 1)
    service.getAdminFoundEastereggs().subscribe(value => {
      this.foundEasterEggs = value;
      this.loadingCount.update(count => count - 1)
    })

    effect(() => {
      if (this.loadingCount() === 0) {
        this.calculateResults()
      }
    })
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

  protected readonly Evaluation = Evaluation;

  private calculateResults() {
    // Team
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

    // Clique
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

    // Eastereggs
    this.easterEggResults.forEach(team => {
      team.found = this.foundEasterEggs.filter(egg => egg.id_team === team.id).length
    })
  }
}
