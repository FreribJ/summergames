import {Component, OnDestroy} from '@angular/core';
import {Activity} from "../model/objects";
import {ContentService} from "../content.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-admin-activity-overview',
  templateUrl: './activity-overview.component.html',
  styleUrls: ['./activity-overview.component.css']
})
export class ActivityOverviewComponent implements OnDestroy {

  activities: Activity[] = []

  subscribtion: Subscription;

  constructor(private service: ContentService) {
    //TODO: evtl sortieren
    this.subscribtion = this.service.getActivities().subscribe(activities => this.activities = activities.filter(a => a.state !== "open"))
  }

  ngOnDestroy(): void {
    this.subscribtion.unsubscribe();
  }
}
