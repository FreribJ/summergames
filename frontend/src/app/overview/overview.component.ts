import {Component, OnDestroy} from '@angular/core';
import {ContentService} from "../content.service";
import {Team} from "../model/objects";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnDestroy {

  team?: Team

  gamesWon: number = -1
  gamesLost: number = -1
  points: number = -1

  //TODO: check ob -1 angezeigt wird, wenn nichts da ist!
  constructor(private service: ContentService) {
    service.getTeam().then(team => this.team = team)
    this.service.getActivities().subscribe(activities => {
      this.gamesWon = activities.filter(activity => activity.state === "won").length
      this.gamesLost = activities.filter(activity => activity.state === "lost").length
      this.points = this.gamesWon * 2 - this.gamesLost
      })
  }

  ngOnDestroy() {
  }
}
