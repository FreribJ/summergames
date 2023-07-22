import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ContentService} from "../../content.service";
import {AdminActivity, Game, Team} from "../../model/models";

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

  constructor(private route: ActivatedRoute,
              private service: ContentService) {
    service.getTeams().then(teams => this.teams = teams)
    service.getGames().then(games => this.games = games)
  }

  onFinishClick() {
    let winnerId: number | null
    if (this.selectedWinner == 0)
      winnerId = null //TODO: evtl. null statt undefinded
    else
      winnerId = this.selectedWinner == 1 ? this.selectedTeam1Id! : this.selectedTeam2Id!
    this.service.editAdminActivity(this.activity!.id, this.selectedGameId!, this.selectedTeam1Id!, this.selectedTeam2Id!, winnerId).subscribe(value => {
      //TODO: show success message
    })
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.has('id')) {
        //TODO: evtl. getOneActivity()
        let subscription = this.service.getAllActivities().subscribe(activities => {
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
