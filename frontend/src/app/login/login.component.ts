import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {ContentService} from "../content.service";
import {Team} from "../model/objects";
import {AppComponent} from "../app.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  teams: Team[] = []
  selectedTeamId?: number
  selectedTeam?: Team;
  password: string = ""
  passwordWrong = false

  isLoading = false

  constructor(private router: Router,
              private service: ContentService,
              private app: AppComponent) {
    this.service.getTeams().then(teams => {
      this.teams = teams
    })

  }

  onEnterClick(evt: KeyboardEvent) {
    this.passwordWrong = false
    if (evt.key == "Enter") {
      this.onLoginClick()
    }
  }

  onLoginClick() {
    this.isLoading = true
    if (this.selectedTeamId && this.password.trim().length){
      this.service.login(this.selectedTeamId, this.password).subscribe(value => {
        this.router.navigate([''],  {replaceUrl: true})
        this.app.checkLogin()
        //TODO: evtl. ContentService zurücksetzen
      },
      error => {
        if (error.status == 401) {
          this.passwordWrong = true
        } else {
          this.passwordWrong = false
          alert("Fehler beim Login. Bitte versuchen Sie es später erneut.")
        }
          this.isLoading = false
      })
    }
  }

  teamSelected() {
    this.selectedTeam = this.teams.find(t => t.id == this.selectedTeamId)
  }
}
