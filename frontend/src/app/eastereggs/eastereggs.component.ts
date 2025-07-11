import {Component} from '@angular/core';
import {Easteregg} from "../model/objects";
import {ContentService} from "../content.service";
import {Router} from "@angular/router";

export const allEastereggs: Easteregg[] = [
  {id: 19816, srcImage: './assets/19816.png', title: 'Das Geschäft muss sein'},
  {id: 14983, srcImage: './assets/14983.jpg', title: 'Prost!!!'},
  {id: 16588, srcImage: './assets/16588.jpg', title: 'Ab in den Urlaub!'},
  {id: 49685, srcImage: './assets/49685.png', title: 'Dads am Grillen'},
  {id: 31813, srcImage: './assets/31813.jpg', title: 'Betrunken du sein musst'},
  {id: 48165, srcImage: './assets/48165.jpg', title: 'Alleine Trinken tut man nicht!'},
  {id: 47916, srcImage: './assets/47916.png', title: 'When you´re Single'},
  {id: 48193, srcImage: './assets/48193.webp', title: 'Professional alcoholic'},
  {id: 19843, srcImage: './assets/19843.png', title: 'Ich als Kind'},
  {id: 25488, srcImage: './assets/25488.jpg', title: 'Jeder als Kind'},

  {id: 64818, srcImage: './assets/64818.jpg', title: 'Ich trinke heute nur eins'},
  {id: 18971, srcImage: './assets/18971.jpg', title: 'BIR'},
  {id: 81853, srcImage: './assets/81853.png', title: 'self confidence'},
  {id: 64182, srcImage: './assets/64182.jpg', title: 'Ahhhhhh'},
  {id: 18946, srcImage: './assets/18946.jpg', title: 'Spannend'},
  {id: 71865, srcImage: './assets/71865.webp', title: 'Wo TÜV?'},
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
        this.router.navigate([`eastereggs`, id],)
      else
        this.notFound = true
    }
  }

}
