import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Easteregg} from "../../model/models";
import {allEastereggs, EastereggsComponent} from "../eastereggs.component";
import {ContentService} from "../../content.service";

@Component({
  selector: 'app-easteregg',
  templateUrl: './easteregg.component.html',
  styleUrls: ['./easteregg.component.css']
})
export class EastereggComponent implements OnInit{

  easteregg?: Easteregg

  constructor(private route: ActivatedRoute,
              private service: ContentService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      params.has('id')
        this.easteregg = allEastereggs.find(ee => ee.id == parseInt(<string>params.get('id')))
        if (this.easteregg) {
          this.service.postEasteregg(this.easteregg.id)
        }
    })
  }

}
