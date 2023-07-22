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
  selectedTeamId?: number
  password: string = ""
  passwordWrong = false

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
    if (this.selectedTeamId){
      this.service.login(this.selectedTeamId, this.password).subscribe(value => {
        this.router.navigate([''],  {replaceUrl: true})
        this.app.checkLogin()
        //TODO: evtl. ContentService zurücksetzen
      },
      error => {
        console.error(error)
        this.passwordWrong = true
        //TODO: show error
      })

    }
    //this.router.navigate([''])
  }

}
