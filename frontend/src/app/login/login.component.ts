import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {ContentService} from "../content.service";
import {Observable, Subscriber} from "rxjs";
import {Team} from "../model/objects";
import {AppComponent} from "../app.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  teams: Team[] = []
  selectedTeam?: Team
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
    if (this.selectedTeam && this.password.trim().length){
      this.service.login(this.selectedTeam.id, this.password).subscribe(value => {
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
}
