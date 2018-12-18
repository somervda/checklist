import { auth } from "firebase";
import { UserModel } from "./../models/userModel";
import { AngularFirestore } from "@angular/fire/firestore";
import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

import { ToastrService } from "ngx-toastr";

import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from "firebase/app";

@Injectable()
export class AuthService {
  public user = new UserModel();
  public user$;
  constructor(
    private router: Router,
    private toastr: ToastrService,
    public afAuth: AngularFireAuth,
    public db: AngularFirestore,
    private ngZone: NgZone
  ) {}

  logout() {
    // sessionStorage.removeItem("profile");
    // sessionStorage.removeItem("token");

    this.afAuth.auth.signOut();
    // console.log("Auth logged out, local storage cleared");
    this.router.navigate(["/"]);
    this.toastr.success("", "Signed out", {
      timeOut: 1000
    });
  }

  isAuthenticated() {
    return this.afAuth.auth.currentUser;
  }

  loginGoogle() {
    // see https://firebase.google.com/docs/auth/web/google-
    this.persistSeason();

    var provider = new firebase.auth.GoogleAuthProvider();
    // see google options at https://developers.google.com/identity/protocols/OpenIDConnect#authenticationuriparameters
    provider.setCustomParameters({
      prompt: "select_account",
      scope: "profile"
    });
    this.afAuth.auth
      .signInWithPopup(provider)
      .then(authState => {
        console.log("GoogleLogin: ", authState);
        // if (authState.additionalUserInfo)
        //   this.sessionStore.setUserPicture(
        //     authState.additionalUserInfo.profile["picture"]
        //   );
        this.loginActions();
        this.toastr.success("", "Signed In", {
          timeOut: 1000
        });
        // Need to run navigates within the angular ngZone or it redirects too early
        // https://stackoverflow.com/questions/51455545/when-to-use-ngzone-run
        this.ngZone.run(() => this.router.navigate(["/"]));
      })
      .catch(error => {
        console.log("GoogleLogin Error: ", error);
        this.toastr.error(error.message, "Signed In Failed", {
          timeOut: 7000
        });
      });
  }

  loginEmail(email: string, password: string) {
    //console.log("auth.loginEmail:", email, " ", password)
    this.persistSeason();

    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(authState => {
        console.log("EmailLogin: ", authState);
        this.loginActions();
        this.toastr.success("", "Signed In", {
          timeOut: 1000
        });
        this.ngZone.run(() => this.router.navigate(["/"]));
      })
      .catch(error => {
        console.log("EmailLogin Error: ", error);
        this.toastr.error(error.message, "Signed In Failed", {
          timeOut: 7000
        });
      });
  }

  signup(email: string, password: string, displayname: string) {
    console.log("auth.signup:", email, " ", password);
    this.persistSeason();

    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(authState => {
        // console.log("Signup: ", authState);

        // https://ui-avatars.com/api/?name=Elon+Musk
        authState.user
          .updateProfile({
            displayName: displayname,
            photoURL: "https://ui-avatars.com/api/?name=" + displayname
          })
          .then(() => {
            console.log("signup updateprofile success");
            this.loginActions();
            this.toastr.success(email, "Signed Up");
            this.ngZone.run(() => this.router.navigate(["/"]));
          })
          .catch(error => {
            console.log("Signup updateprofile Error: ", error);
            this.toastr.error(error, "Signed Up Failed");
          });
      })

      .catch(error => {
        // console.log("Signup Error: ", error);
        this.toastr.error(error.message, "Signup Failed");
      });
  }

  private loginActions() {
    //Actions to perform on successful login
    console.log("Auth loginActions");

    var userRef = this.db.doc("users/" + this.afAuth.auth.currentUser.uid);

    // user setWithMerge to create user if does not exist
    // only merge fields that come from the authentication table
    // that way, if the user already has user information (i.e. communities)
    // it will not be overwritten after authentication
    var setWithMerge = userRef
      .set(
        {
          id: this.afAuth.auth.currentUser.uid,
          email: this.afAuth.auth.currentUser.email,
          displayName: this.afAuth.auth.currentUser.displayName,
          lastLogin: new Date()
        },
        { merge: true }
      )
      .then(() => {
        // After updating the usersrecord , subscribe to the doc and set user based on the subscription
        this.user$ = userRef.snapshotChanges();
        this.user$.subscribe(doc => {
          this.user.loadFromObject(doc.payload.data(), doc.payload.id);
          console.log("logonActions user :", doc, this.user);
        });
      })
      .catch(error =>
        this.toastr.error(error.message, "logonActions users update failed")
      );
  }

  get getUserPicture(): string {
    if (this.afAuth.auth.currentUser && this.afAuth.auth.currentUser.photoURL)
      return this.afAuth.auth.currentUser.photoURL;
    return null;
  }

  get getUserDisplayname(): string {
    if (
      this.afAuth.auth.currentUser &&
      this.afAuth.auth.currentUser.displayName
    )
      return this.afAuth.auth.currentUser.displayName;
    return null;
  }

  get getUserEmail(): string {
    if (this.afAuth.auth.currentUser && this.afAuth.auth.currentUser.email)
      return this.afAuth.auth.currentUser.email;
    return null;
  }

  persistSeason() {
    // See https://firebase.google.com/docs/auth/web/auth-state-persistence
    // This function will return immediately even though promise may still be
    // being actioned. See documentation , future authentication will wait for this function
    // to complete and persistance will be set appropriately

    this.afAuth.auth
      .setPersistence(firebase.auth.Auth.Persistence.NONE)
      .then(function() {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // console.log("persistSeason worked");
      })
      .catch(function(error) {
        // Handle Errors here.
        console.log("persistSeason error ", error);
      });
  }
}
