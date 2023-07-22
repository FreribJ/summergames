import { Component } from '@angular/core';
import {Easteregg} from "../model/objects";
import {ContentService} from "../content.service";
import {Router} from "@angular/router";

export const allEastereggs: Easteregg[] = [
  {id: 1, srcImage: './assets/test1.JPG', title: 'Titel 1', text: 'Dies ist Text 1'},
  {id: 2, srcImage: './assets/test2.JPG', title: 'Titel 2', text: 'dies ist Text 2'}
]

@Component({
  selector: 'app-eastereggs',
  templateUrl: './eastereggs.component.html',
  styleUrls: ['./eastereggs.component.css']
})
export class EastereggsComponent {

  foundEastereggs: Easteregg[] = []
  typedNumber?: number
  notFound = false

  constructor(private service: ContentService,
              private router: Router) {
    this.service.getFoundEastereggs().subscribe(result => {
      result.forEach(ee => {
        let temp = allEastereggs.find(eee => eee.id == ee.id)
        if (temp)
          this.foundEastereggs.push(temp)
      })
    })
  }

  onEnterPress(evt: KeyboardEvent) {
    if (evt.key == "Enter")
      this.onGoClick()
    else
      this.notFound = false
  }

  onGoClick() {
    if (this.typedNumber) {
    const id = Math.floor(this.typedNumber)
      if (allEastereggs.find(ee => ee.id == id))
        this.router.navigate([`eastereggs`, id], )
      else
        this.notFound = true
    }
  }

}
