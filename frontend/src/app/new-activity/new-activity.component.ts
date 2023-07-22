import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ContentService} from "../content.service";
import {Activity, Game, Team} from "../model/models";

@Component({
  selector: 'app-new-activity',
  templateUrl: './new-activity.component.html',
  styleUrls: ['./new-activity.component.css']
})
export class NewActivityComponent implements OnInit {

  team?: Team

  oponents: Team[] = []
  selectedOpponentId?: number

  games: Game[] = []
  selectedGameId?: number

  selectedState?: 'won' | 'lost'

  planId: number = -1

  constructor(private router: Router,
              private service: ContentService,
              private route: ActivatedRoute) {
    service.getTeam().then(team => {
      this.team = team
      service.getTeams().then(teams => {
        this.oponents = teams.filter(team => team.id !== this.team?.id)
      })
    })
    this.service.getGames().then(games => this.games = games)
  }

  onFinishClick() {
    if (this.planId == -1) {
      if (!this.selectedGameId || !this.selectedOpponentId || !this.team) {
        throw new Error('Select all Fields')
      }
      this.service.newActivity(this.selectedGameId!, this.selectedOpponentId!, this.selectedState!).subscribe(value => {
        this.router.navigate(['activities'])
      })
    } else {
      const winnerId = this.selectedState === 'won' ? this.team!.id : this.selectedOpponentId!
      this.service.editActivity(this.planId, winnerId).subscribe(value => {
        this.router.navigate(['plans'])
      })
    }
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      if (params.has('id')) {
        this.service.getActivities().subscribe(activities => {
          const activity = activities.find(a => a.id === parseInt(<string>params.get('id')))
          if (activity) {
            if (!activity.plan)
              this.router.navigate(['new'])
            this.planId = activity.id!
            this.selectedGameId = activity.game.id
            this.selectedOpponentId = activity.opponent.id
          }
        })
      } else {
        this.planId = -1
        this.selectedGameId = undefined
        this.selectedOpponentId = undefined
      }
    })
  }

}
