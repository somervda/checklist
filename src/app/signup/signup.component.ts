import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit, OnDestroy {
  email;
  password;
  confirmPassword;
  displayName;
  disabledSignup: boolean = true;
  formSubscription;
  isValidForm: boolean;

  @ViewChild(NgForm) frmMain: NgForm;
  constructor(public auth: AuthService) {}

  ngOnInit() {
    // Subscribe to form to get the validation state
    this.formSubscription = this.frmMain.statusChanges.subscribe(result => {
      this.isValidForm = result == "VALID";
    });
  }

  resolved(captchaResponse: string) {
    this.disabledSignup = false;
    console.log(`Resolved captcha with response ${captchaResponse}:`);
  }

  getCharsBefore(str, chr) {
    var index = str.indexOf(chr);
    if (index != -1) {
      return str.substring(0, index);
    }
    return "";
  }
  ngOnDestroy() {
    if (this.formSubscription) this.formSubscription.unsubscribe();
  }
}
