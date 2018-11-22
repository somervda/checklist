import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { SessionStore } from "../services/session.store.service";



@Component({
  selector: "navigationbar",
  templateUrl: "./navigationbar.component.html",
  styleUrls: ["./navigationbar.component.css"]
})
export class NavigationbarComponent implements OnInit {
  // see https://embed.plnkr.co/plunk/xH6VJo for example of a ngb menu
  isNavbarCollapsed = true;

  constructor(public auth: AuthService, public sessionStore: SessionStore) {}

  ngOnInit() {
  }



  
}
