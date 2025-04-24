import { Component } from '@angular/core';
import {Team} from "../model/objects";
import {Router} from "@angular/router";
import {ContentService} from "../content.service";
import {AppComponent} from "../app.component";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  team?: Team;

  teamname: string = ""
  teamnameInvalid: boolean = false
  teammate1: string = ""
  teammate1Invalid: boolean = false
  teammate2: string = ""
  teammate2Invalid: boolean = false

  isLoading = true;


  constructor(private router: Router,
              private service: ContentService,
              private app: AppComponent) {

    this.service.getTeam().then(team => {
      this.isLoading = false;
      this.team = team;
      this.teamname = team.name
      this.teammate1 = team.partner1
      this.teammate2 = team.partner2
    })
  }

  saveTeam() {
    if (this.teamname.trim().length < 3) {
      this.teamnameInvalid = true
      return
    }
    if (this.teammate1.trim().length < 4) {
      this.teammate1Invalid = true
      return
    }
    if (this.teammate2.trim().length < 4) {
      this.teammate2Invalid = true
      return
    }

  }

  onLogoutClick() {
    this.app.logout();
  }
}
