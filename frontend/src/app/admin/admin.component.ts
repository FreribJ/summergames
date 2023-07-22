import { Component } from '@angular/core';
import {RestService} from "../rest.service";
import {ContentService} from "../content.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  options: {name: string, link: string}[] = [
    {name: 'Alle Teams', link: './teams'},
    {name: 'Alle Aktivitäten', link: './activities'},
    {name: 'Alle Schätzungen', link: './guessing'},
    {name: 'Auswertung Spiele', link: './result'},
  ]

  constructor(private rest: RestService,
              private service: ContentService) {
    this.rest.getGames().subscribe({
      next(games) {
        console.log('test1:', games)
      }
    })

    this.service.getGames().then(value => {
      console.log('test5: ', value)
    })
  }

}
