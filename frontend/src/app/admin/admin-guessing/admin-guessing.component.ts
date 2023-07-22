import { Component } from '@angular/core';
import {ContentService} from "../../content.service";
import {AdminGuess} from "../../model/adminObjects";

@Component({
  selector: 'app-admin-guessing',
  templateUrl: './admin-guessing.component.html',
  styleUrls: ['./admin-guessing.component.css']
})
export class AdminGuessingComponent {

  guesses: AdminGuess[] = []
  actual?: number

  constructor(private service: ContentService) {
    this.service.getAdminGuesses().subscribe(result => {
      this.guesses = result
    })
  }

  onEnterPress(event: KeyboardEvent) {
    if (event.key == 'Enter' && this.actual && this.actual > 0) {
      this.guesses.sort((a, b) => {
        if (a.guess == b.guess)
          return 0
        if (a.guess <= 0)
          return 1
        if (Math.abs(a.guess-this.actual!) > Math.abs(b.guess-this.actual!))
          return 1
        return -1
      })
    }
  }

  protected readonly Math = Math;
}
