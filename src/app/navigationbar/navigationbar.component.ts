import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "navigationbar",
  templateUrl: "./navigationbar.component.html",
  styleUrls: ["./navigationbar.component.css"]
})
export class NavigationbarComponent implements OnInit {
  state: number;
  @Input()
  isPublisher: boolean;
  @Input()
  isSignedIn: boolean;
  isNavbarCollapsed = true;
  constructor() {
    console.log("Navigator constuctor");
  }

  ngOnInit() {
    console.log("Navigator OnInit: " + this.state);
    this.state += 1;
  }
}
