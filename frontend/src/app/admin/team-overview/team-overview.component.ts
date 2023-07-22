import {Component} from '@angular/core';
import {ContentService} from "../../content.service";
import {AdminTeam} from "../../model/adminObjects";

@Component({
  selector: 'app-team-overview',
  templateUrl: './team-overview.component.html',
  styleUrls: ['./team-overview.component.css']
})
export class TeamOverviewComponent {

  allTeams: AdminTeam[] = []
  teams: AdminTeam[] = []
  search: string = ""

  constructor(private service: ContentService) {
    this.service.getAdminTeams().then(result => {
      this.teams = result
      this.allTeams = result
    })
  }

  onKeyPress() {
    const searchPrep = this.search.toLowerCase().trim()
    this.teams = this.allTeams.filter(team => {
      return !this.search || team.name.toLowerCase().includes(searchPrep) || team.partner1.toLowerCase().includes(searchPrep) || team.partner2.toLowerCase().includes(searchPrep);
    })
  }

}
