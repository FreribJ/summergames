import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ContentService} from "../content.service";
import {Activity, Game, Team} from "../model/objects";
import {Location} from "@angular/common";

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
  allreadyFilledOut = false

  isLoading = false

  showDescription = false
  game?: Game

  constructor(private router: Router,
              private service: ContentService,
              private route: ActivatedRoute,
              private location: Location) {
    service.getTeam().then(team => {
      this.team = team
      service.getTeams().then(teams => {
        this.oponents = teams.filter(team => team.id !== this.team?.id)
      })
    })
    this.service.getGames().then(games => this.games = games)
  }

  showDescriptionClick() {
    const game = this.games.find(g => g.id == this.selectedGameId)
    if (game) {
      this.game = game
      this.showDescription = true
    }
  }

  onFinishClick() {
    if (this.allreadyFilledOut) {
      this.location.back()
      return
    }
    this.isLoading = true
    if (this.planId == -1) {
      if (!this.selectedGameId || !this.selectedOpponentId || !this.team) {
        throw new Error('Select all Fields')
      }
      this.service.newActivity(this.selectedGameId!, this.selectedOpponentId!, this.selectedState!).subscribe(value => {
        this.location.back()
        setTimeout(() => {
          if (this.location.path() == '/new')
            this.router.navigate(['activities'], {replaceUrl: true})
        }, 100)
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
        this.location.back()
        // this.router.navigate(['plans'], {replaceUrl: true})
      }, error => {
        if (error.status === 403) {
          alert('Das Eintragen von Aktivitäten wurde noch nicht freigegeben oder ist bereits abgeschlossen. ')
        } else if (error.status === 409) {
          alert('Jemand anderes hat bereits ein Ergebnis eingetragen.')
          this.location.back()
          // this.router.navigate(['plans'])
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
            this.planId = activity.id!
            this.selectedGameId = activity.game.id
            this.selectedOpponentId = activity.opponent.id
            if (activity.state !== "open") {
              this.selectedState = activity.state
              this.allreadyFilledOut = true
            }
          } else {
            this.router.navigate(['new'])
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
