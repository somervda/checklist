import { AuthService } from "./services/auth.service";
import { OnInit } from "@angular/core";
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "checkList";

  constructor(private auth: AuthService) {}

  ngOnInit() {
    // console.log("App OnInit logout");
    // if (this.auth.isAuthenticated())
    //   this.auth.logout();
  }
}
