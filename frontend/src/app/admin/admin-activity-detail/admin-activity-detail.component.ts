import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ContentService} from "../../content.service";
import {Game, Team} from "../../model/objects";
import {AdminActivity} from "../../model/adminObjects";

@Component({
  selector: 'app-admin-activity-detail',
  templateUrl: './admin-activity-detail.component.html',
  styleUrls: ['./admin-activity-detail.component.css']
})
export class AdminActivityDetailComponent implements OnInit {

  activity?: AdminActivity

  teams: Team[] = []
  games: Game[] = []

  selectedGameId?: number
  selectedTeam1Id?: number
  selectedTeam2Id?: number
  selectedWinner?: number

  deleteCountdown = 5

  constructor(private route: ActivatedRoute,
              private service: ContentService,
              private router: Router) {
    service.getTeams().then(teams => this.teams = teams)
    service.getGames().then(games => this.games = games)
  }

  formatTimeWithDate(date?: Date) {
    if (!date)
      return ""
    return date.toLocaleDateString([], {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'})
  }


  onFinishClick() {
    let winnerId: number | null
    if (this.selectedWinner == 0)
      winnerId = null
    else
      winnerId = this.selectedWinner == 1 ? this.selectedTeam1Id! : this.selectedTeam2Id!
    this.service.editAdminActivity(this.activity!.id, this.selectedGameId!, this.selectedTeam1Id!, this.selectedTeam2Id!, winnerId).subscribe(value => {
      this.router.navigate(['../../'], {relativeTo: this.route, replaceUrl: true})
      alert('Erfolgreich gespeichert')
    })
  }

  onDeleteClick() {
    if (this.deleteCountdown > 1) {
      this.deleteCountdown--
    } else {
      this.service.deleteAdminActivity(this.activity!.id).subscribe(value => {
        this.router.navigate(['../../'], {relativeTo: this.route, replaceUrl: true})
        alert('Erfolgreich gelöscht')
      })
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.has('id')) {
        //TODO: evtl. getOneActivity()
        let subscription = this.service.getAdminActivities().subscribe(activities => {
          const activity = activities.find(a => a.id === parseInt(<string>params.get('id')))
          if (!activity)
            throw new Error('No activity found')
          this.activity = activity
          this.selectedGameId = activity.game.id
          this.selectedTeam1Id = activity.team1.id
          this.selectedTeam2Id = activity.team2.id
          if (!activity.winner)
            this.selectedWinner = 0
          else
            this.selectedWinner = activity.winner.id == activity.team1.id ? 1 : 2
          subscription.unsubscribe()
        })
      }
    })
  }

}
