import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Activity} from "../../model/objects";

@Component({
  selector: 'activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  @Input()
  activity!: Activity

  color: string = "white"
  icon: string = "fas fa-question"

  constructor() {

  }

  formatTime(date?: Date) {
    if (!date)
      return ""
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
  }


  ngOnInit(): void {
    if (this.activity.state == "won") {
      this.color = "lightgreen"
      this.icon = "fa-trophy"
    } else if (this.activity.state == "lost") {
      this.color = "lightpink"
      this.icon = "fa-face-frown"
    }
  }

}
