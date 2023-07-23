import { Component } from '@angular/core';
import {Easteregg} from "../model/objects";
import {ContentService} from "../content.service";
import {Router} from "@angular/router";

export const allEastereggs: Easteregg[] = [
  {id: 14983, srcImage: './assets/14983.jpg', title: 'Titel 1', text: 'Dies ist Text 1'},
  {id: 16588, srcImage: './assets/16588.jpg', title: 'Titel 2', text: 'Dies ist Text 2'},
  {id: 18946, srcImage: './assets/18946.webp', title: 'Titel 3', text: 'Dies ist Text 3'},
  {id: 18971, srcImage: './assets/18971.jpg', title: 'Titel 4', text: 'Dies ist Text 4'},
  {id: 19816, srcImage: './assets/19816.jpg', title: 'Titel 5', text: 'Dies ist Text 5'},
  {id: 19843, srcImage: './assets/19843.jpg', title: 'Titel 6', text: 'Dies ist Text 6'},
  {id: 25488, srcImage: './assets/25488.jpg', title: 'Titel 7', text: 'Dies ist Text 7'},
  {id: 31813, srcImage: './assets/31813.jpg', title: 'Titel 8', text: 'Dies ist Text 8'},
  {id: 35815, srcImage: './assets/35815.webp', title: 'Titel 9', text: 'Dies ist Text 9'},
  {id: 47916, srcImage: './assets/47916.png', title: 'Titel 10', text: 'Dies ist Text 10'},
  {id: 48165, srcImage: './assets/48165.jpg', title: 'Titel 11', text: 'Dies ist Text 11'},
  {id: 48193, srcImage: './assets/48193.webp', title: 'Titel 12', text: 'Dies ist Text 12'},
  {id: 49685, srcImage: './assets/49685.jpg', title: 'Titel 13', text: 'Dies ist Text 13'},
  {id: 64182, srcImage: './assets/64182.webp', title: 'Titel 14', text: 'Dies ist Text 14'},
  {id: 64818, srcImage: './assets/64818.jpg', title: 'Titel 15', text: 'Dies ist Text 15'},
  {id: 68182, srcImage: './assets/68182.jpg', title: 'Titel 16', text: 'Dies ist Text 16'},
  {id: 71865, srcImage: './assets/71865.jpg', title: 'Titel 17', text: 'Dies ist Text 17'},
  {id: 81853, srcImage: './assets/81853.png', title: 'Titel 18', text: 'Dies ist Text 18'},
  {id: 99898, srcImage: './assets/99898.jpg', title: 'Titel 19', text: 'Dies ist Text 19'},
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
