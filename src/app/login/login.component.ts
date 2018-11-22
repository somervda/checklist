import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  constructor(public afAuth: AngularFireAuth) {}

  ngOnInit() {}

  loginGoogle() {
console.log("signup google clicked");
    this.afAuth.auth.signInWithPopup( new firebase.auth.GoogleAuthProvider());
  }

  loginEmail() {
    console.log("signup email clicked");
        this.afAuth.auth.signInWithPopup( new firebase.auth.EmailAuthProvider());
      }
}
