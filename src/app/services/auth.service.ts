import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

import { SessionStore } from "./session.store.service";
import { ToastrService } from "ngx-toastr";

import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from "firebase/app";

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private sessionStore: SessionStore,
    private toastr: ToastrService,
    public afAuth: AngularFireAuth,
    private ngZone: NgZone
  ) { }

  logout() {
    // sessionStorage.removeItem("profile");
    // sessionStorage.removeItem("token");

    this.sessionStore.clearStorage();
    this.afAuth.auth.signOut();
    console.log("Auth logged out, local storage cleared");
    this.router.navigate(["/"]);
    this.toastr.success("Signed out");
  }

  isAuthenticated() {
    return this.afAuth.auth.currentUser;
  }

  loginGoogle() {
    // see https://firebase.google.com/docs/auth/web/google-signin 
    var provider = new firebase.auth.GoogleAuthProvider();
    // see google options at https://developers.google.com/identity/protocols/OpenIDConnect#authenticationuriparameters 
    provider.setCustomParameters({
      'prompt': 'select_account',
      'scope': 'profile'
    });
    this.afAuth.auth.signInWithPopup(provider)
      .then(authState => {
        console.log("GoogleLogin: ", authState);
        if (authState.additionalUserInfo)
          this.sessionStore.setUserPicture(authState.additionalUserInfo.profile['picture'])
        this.toastr.success("Signed In");
        // Need to run navigates within the angular ngZone or it redirects too early
        // https://stackoverflow.com/questions/51455545/when-to-use-ngzone-run
        this.ngZone.run(() => this.router.navigate(["/"]));
      })
      .catch(error => {
        console.log("GoogleLogin Error: ", error);
        this.toastr.error("Signed In Failed");
      });
  }

  loginEmail(email: string, password: string) {
    console.log("auth.loginEmail:", email, " ", password)
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(authState => {
        console.log("EmailLogin: ", authState);
        this.toastr.success("Signed In");
        this.ngZone.run(() => this.router.navigate(["/"]));
      })
      .catch(error => {
        console.log("EmailLogin Error: ", error);
        this.toastr.error("Signed In Failed");
      });
  }
}
