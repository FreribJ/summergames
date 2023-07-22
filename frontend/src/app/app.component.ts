import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ContentService} from "./content.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Frenker Sommerspiele 2023';

  menuOpen = false;
  newOpen = false
  menuItems: { name: string, link: string }[] = []
  loginSuccess: boolean = false


  constructor(private service: ContentService,
              private router: Router) {
    this.checkLogin()
  }

  //TODO: Eigentlich bei jeden Call wieder auf Login leiten, wenn nicht autorisiert...
  checkLogin() {
    this.service.checkLogin().subscribe(value => {
      this.loginSuccess = true
      if (value.admin) {
        this.menuItems = [
          {name: 'Übersicht', link: ''},
          {name: 'Spielplan', link: 'plans'},
          {name: 'Gespielte Spiele', link: 'activities'},
          {name: 'Ratespiel', link: 'guessing'},
          {name: 'Admin-Bereich', link: 'admin'},
        ]
      } else {
        this.menuItems = [
          {name: 'Übersicht', link: ''},
          {name: 'Spielplan', link: 'plans'},
          {name: 'Gespielte Spiele', link: 'activities'},
          {name: 'Ratespiel', link: 'guessing'},
        ]
      }
    }, error => {
      if (error.status == 401) {
        this.router.navigate(['login'])
        this.menuItems = [
          {name: 'Login', link: 'login'}
        ]
      }
    })
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
  }

  onOpenMenuClick() {
    //open Modal
  }

}
