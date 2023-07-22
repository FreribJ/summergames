import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Activity} from "../../model/models";

@Component({
  selector: 'activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  @Input()
  activity!: Activity

  color: string = "white"

  constructor() {

  }

  ngOnInit(): void {
    if (this.activity.state == "won")
      this.color = "lightgreen"
    else if (this.activity.state == "lost")
      this.color = "lightpink"
  }

}
