import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ContentService} from "../content.service";
import {Activity, Game, Team} from "../model/objects";

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

  isLoading = false

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
    this.isLoading = true
    if (this.planId == -1) {
      if (!this.selectedGameId || !this.selectedOpponentId || !this.team) {
        throw new Error('Select all Fields')
      }
      this.service.newActivity(this.selectedGameId!, this.selectedOpponentId!, this.selectedState!).subscribe(value => {
        this.router.navigate(['../'], {relativeTo: this.route})
      }, error => {
        if (error.status === 403) {
          alert('Das Eintragen von Aktivitäten wurde noch nicht freigegeben oder ist bereits abgeschlossen. ')
        } else
          alert('Ein Fehler ist aufgetreten. Versuche es erneut.')
        this.isLoading = false
      })
    } else {
      const winnerId = this.selectedState === 'won' ? this.team!.id : this.selectedOpponentId!
      this.service.editActivity(this.planId, winnerId).subscribe(value => {
        this.router.navigate(['../'], {relativeTo: this.route})
      }, error => {
        if (error.status === 403) {
          alert('Das Eintragen von Aktivitäten wurde noch nicht freigegeben oder ist bereits abgeschlossen. ')
        } else
          alert('Ein Fehler ist aufgetreten. Versuche es erneut.')
        this.isLoading = false
      })
    }
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.isLoading = true
      if (params.has('id')) {
        this.service.getActivities().subscribe(activities => {
          this.isLoading = false
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
        this.isLoading = false
        this.planId = -1
        this.selectedGameId = undefined
        this.selectedOpponentId = undefined
      }
    })
  }

}
