import { Component } from '@angular/core';
import {Activity} from "../model/models";
import {ContentService} from "../content.service";

@Component({
  selector: 'app-admin-activity-overview',
  templateUrl: './activity-overview.component.html',
  styleUrls: ['./activity-overview.component.css']
})
export class ActivityOverviewComponent {

  activities: Activity[] = []

  constructor(private service: ContentService) {
    this.service.getActivities().subscribe(activities => this.activities = activities.filter(a => a.state !== "open"))
  }

}
