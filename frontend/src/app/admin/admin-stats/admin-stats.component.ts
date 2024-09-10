import {Component, OnDestroy} from '@angular/core';
import {ContentService} from "../../content.service";

@Component({
  selector: 'app-admin-stats',
  templateUrl: './admin-stats.component.html',
  styleUrls: ['./admin-stats.component.css']
})
export class AdminStatsComponent implements OnDestroy {

  openGames = 0;
  gamesPlayed = 0;

  interval: any;

  constructor(private service: ContentService) {

    setInterval(() => {
      this.service.getAdminActivities().subscribe(activities => {
        this.openGames = activities.filter(activity => activity.winner == undefined).length;
        this.gamesPlayed = activities.filter(activity => activity.winner != undefined).length;
      })
    }, 60000)

  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

}
