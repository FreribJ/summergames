import {Component, OnDestroy} from '@angular/core';
import {ContentService} from "../content.service";
import {Team} from "../model/objects";
import {Subscription} from "rxjs";

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

  subscribtion: Subscription;

  constructor(private service: ContentService) {
    service.getTeam().then(team => this.team = team)
    this.subscribtion = this.service.getActivities().subscribe(activities => {
      this.gamesWon = activities.filter(activity => activity.state === "won").length
      this.gamesLost = activities.filter(activity => activity.state === "lost").length
      this.points = this.gamesWon * 2 - this.gamesLost
      })
  }

  ngOnDestroy() {
    this.subscribtion.unsubscribe()
  }
}
