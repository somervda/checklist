import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit {
  email;
  password;
  displayname;
  disabledSignup: boolean = true;
  constructor(public auth: AuthService) {}

  ngOnInit() {}

  resolved(captchaResponse: string) {
    this.disabledSignup = false;
    console.log(`Resolved captcha with response ${captchaResponse}:`);
  }
}
