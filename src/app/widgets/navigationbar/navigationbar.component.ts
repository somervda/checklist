import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "navigationbar",
  templateUrl: "./navigationbar.component.html",
  styleUrls: ["./navigationbar.component.scss"]
})
export class NavigationbarComponent implements OnInit {
  // see https://embed.plnkr.co/plunk/xH6VJo for example of a ngb menu
  isNavbarCollapsed = true;

  constructor(public auth: AuthService) {}

  ngOnInit() {}

  collapse() {
    this.isNavbarCollapsed = true;
  }
}
