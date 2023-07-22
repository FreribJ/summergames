import {Component} from '@angular/core';
import {Team} from "../../model/objects";
import {ContentService} from "../../content.service";
import {AdminActivity} from "../../model/adminObjects";

@Component({
  selector: 'app-admin-activity-overview',
  templateUrl: './admin-activity-overview.component.html',
  styleUrls: ['./admin-activity-overview.component.css']
})
export class AdminActivityOverviewComponent {

  allActivites: AdminActivity[] = []
  activites: AdminActivity[] = []
  search: string = ""

  constructor(private service: ContentService) {
    this.service.getAdminActivities().subscribe(result => {
      this.allActivites = result
      this.activites = result
      this.onKeyPress()
    })
  }

  onKeyPress() {
    //TODO: evtl. mit Timeout
    const searchPrepArray: string[] = this.search.toLowerCase().trim().split(',')
    this.activites = this.allActivites.filter(activity => {
      if (!this.search)
        return true
      for (let searchPrep of searchPrepArray) {
        searchPrep = searchPrep.trim()
        if (!(('Freies Spiel'.toLowerCase().includes(searchPrep) && !activity.plan) ||
          ('Planspiel'.toLowerCase().includes(searchPrep) && activity.plan) ||
          activity.game.name.toLowerCase().includes(searchPrep) ||
          activity.team1.name.toLowerCase().includes(searchPrep) ||
          activity.team2.name.toLowerCase().includes(searchPrep) ||
          activity.team1.partner1.toLowerCase().includes(searchPrep) ||
          activity.team1.partner2.toLowerCase().includes(searchPrep) ||
          activity.team2.partner1.toLowerCase().includes(searchPrep) ||
          activity.team2.partner2.toLowerCase().includes(searchPrep))) {
          return false
        }
      }
      return true
    })
  }

}
