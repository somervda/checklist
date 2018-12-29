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
  //public user$;

  public authStateChanges;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    public afAuth: AngularFireAuth,
    public db: AngularFirestore,
    private ngZone: NgZone
  ) {
    // Set  up a authentication watched to reload user info when user is authenticated
    // this covers inition signon and when the user refreshes the browser.
    this.authStateChanges = this.afAuth.auth.onAuthStateChanged(authuser => {
      console.log("onAuthStateChanges authuser", authuser);
      this.loadUser();
    });
  }

  loadUser() {
    console.log("loadUser 1");
    if (this.isAuthenticated()) {
      var userRef = this.db
        .collection("users")
        .doc(this.afAuth.auth.currentUser.uid);
      userRef
        .get()
        .toPromise()
        .then(doc => {
          console.log("loadUser user 2 doc:", doc);
          this.user.loadFromObject(doc);
          console.log("loadUser user 3 this.user:", this.user);

          //   When user data gets reloaded also refresh view to the defualt user home page (mychecklists)
          //   This is important to support refreshing the view after doing a browser refresh and
          //   to make a more natural workflow starting point after user signs in

          //   Need to run navigates within the angular ngZone or it redirects too early
          //   https://stackoverflow.com/questions/51455545/when-to-use-ngzone-run
          if (this.user.initialPagePreference)
            this.ngZone.run(() =>
              this.router.navigate([this.user.initialPagePreference])
            );
          else this.ngZone.run(() => this.router.navigate(["mychecklists"]));
        });

      // this.user$ = userRef.snapshotChanges();
      // this.user$.subscribe(snapshot => {
      //   this.user.loadFromObject(snapshot.payload);
      //   console.log("constructor user :", snapshot, this.user);
      //   // When user data gets reloaded also refresh view to the defualt user home page (mychecklists)
      //   // This is important to support refreshing the view after doing a browser refresh and
      //   // to make a more natural workflow starting point after user signs in

      //   // Need to run navigates within the angular ngZone or it redirects too early
      //   // https://stackoverflow.com/questions/51455545/when-to-use-ngzone-run
      //   if (this.user.initialPagePreference)
      //     this.ngZone.run(() =>
      //       this.router.navigate([this.user.initialPagePreference])
      //     );
      //   else this.ngZone.run(() => this.router.navigate(["mychecklists"]));
      // });
    }
  }

  logout() {
    this.afAuth.auth.signOut();
    this.user = new UserModel();
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
          lastLogin: new Date(),
          communities: { PUBLIC: { accessState: 0, name: "Public" } }
        },
        { merge: true }
      )
      .then(() => {
        this.loadUser();
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

  get getUserUID(): string {
    if (this.afAuth.auth.currentUser && this.afAuth.auth.currentUser.uid)
      return this.afAuth.auth.currentUser.uid;
    return null;
  }

  persistSeason() {
    // See https://firebase.google.com/docs/auth/web/auth-state-persistence
    // This function will return immediately even though promise may still be
    // being actioned. See documentation , future authentication will wait for this function
    // to complete and persistance will be set appropriately

    this.afAuth.auth
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
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
