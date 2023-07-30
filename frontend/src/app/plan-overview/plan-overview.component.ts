import { Component } from '@angular/core';
import {Activity} from "../model/objects";
import {Router} from "@angular/router";
import {ContentService} from "../content.service";

@Component({
  selector: 'app-plan-overview',
  templateUrl: './plan-overview.component.html',
  styleUrls: ['./plan-overview.component.css']
})
export class PlanOverviewComponent {

  progress = {value: 0, max: 0}
  activities: Activity[] = []

  constructor(private router: Router,
              private service: ContentService) {
    this.service.getActivities().subscribe(activities => {
      this.activities = activities.filter(activity => activity.plan)
      this.progress.max = this.activities.length
      this.progress.value = this.activities.filter(activity => activity.state != "open").length
      this.activities.sort((a, b) => {
        if (a.state == "open" && b.state != "open")
          return -1
        return 0
      })
    })
  }
}
