import { Component } from '@angular/core';
import {ContentService} from "../content.service";

@Component({
  selector: 'app-guessing',
  templateUrl: './guessing.component.html',
  styleUrls: ['./guessing.component.css']
})
export class GuessingComponent {

  typedGuess?: number
  confirmedGuess?: number

  constructor(private service: ContentService) {
    this.service.getGuess().subscribe(guess => {
      if (guess !== -1) {
        this.typedGuess = guess
        this.confirmedGuess = guess
      }
    })
  }

  onEnterPress(event: KeyboardEvent) {
    if (event.key == 'Enter')
      this.onSendClick()
  }

  onSendClick() {
    this.typedGuess = Math.floor(this.typedGuess!)
    this.service.putGuess(this.typedGuess!).subscribe(guess => {
      this.confirmedGuess = guess
    })
  }

  protected readonly Math = Math;
}
