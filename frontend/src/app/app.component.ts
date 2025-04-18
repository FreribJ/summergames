import {Component} from '@angular/core';
import {ContentService} from "./content.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = `Frenker Sommerspiele 2025`;

  menuOpen = false;
  newOpen = false
  menuItems: { name: string, link: string, icon: string }[] = []
  loginSuccess: boolean = false
  returnAfterLogin?: string


  constructor(private service: ContentService,
              private router: Router,
              private route: ActivatedRoute) {
    this.checkLogin()
  }

  checkLogin() {
    this.service.checkLogin().subscribe(value => {
      this.loginSuccess = true
      if (value.admin) {
        this.menuItems = [
          {name: 'Übersicht', link: '', icon: 'fa-house'},
          {name: 'Spielplan', link: 'plans', icon: 'fa-table-list'},
          {name: 'Gespielte Spiele', link: 'activities', icon: 'fa-list-check'},
          {name: 'Ratespiel', link: 'guessing', icon: 'fa-question'},
          {name: 'Admin-Bereich', link: 'admin', icon: 'fa-triangle-exclamation'},
        ]
      } else {
        this.menuItems = [
          {name: 'Übersicht', link: '', icon: 'fa-house'},
          {name: 'Spielplan', link: 'plans', icon: 'fa-table-list'},
          {name: 'Gespielte Spiele', link: 'activities', icon: 'fa-list-check'},
          {name: 'Ratespiel', link: 'guessing', icon: 'fa-question'},
        ]
      }
      if (value.easterEggs > 0) {
        this.menuItems.push({name: 'Easter Eggs', link: 'eastereggs', icon: 'fa-egg'})
      }
      if (this.returnAfterLogin && this.returnAfterLogin != '/login') {
        this.router.navigate([this.returnAfterLogin])
        this.returnAfterLogin = undefined
      }
    }, error => {
      if (error.status == 401) {
        this.returnAfterLogin = location.pathname
        this.router.navigate(['login'])
        this.menuItems = [
          {name: 'Login', link: 'login', icon: ''}
        ]
      }
    })
  }
}
