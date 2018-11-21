import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  constructor(public afAuth: AngularFireAuth) {}

  ngOnInit() {}

  signup() {}
}
