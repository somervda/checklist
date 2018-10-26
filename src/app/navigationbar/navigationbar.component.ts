import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "navigationbar",
  templateUrl: "./navigationbar.component.html",
  styleUrls: ["./navigationbar.component.css"]
})
export class NavigationbarComponent implements OnInit {
  @Input()
  isPublisher: boolean;
  @Input()
  isSignedIn: boolean;
  isNavbarCollapsed = true;
  constructor(public auth: AuthService) { }

  ngOnInit() {

  }
}
