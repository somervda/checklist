import { auth } from "firebase";
import { UserModel, CommunityAccessState } from "./../models/userModel";
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
          if (!this.user.initialPagePreference) {
            // Set initialPagePreference yo mychecklists if not set
            this.user.initialPagePreference = "mychecklists";
            this.user.dbFieldUpdate(
              this.afAuth.auth.currentUser.uid,
              "initialPagePreference",
              this.user.initialPagePreference,
              this.db
            );
          }

          // Show toastr notification if invites are pending
          // Show toastr notification if invites are pending
          CommunityAccessState: CommunityAccessState;
          let inviteMsg: string = "";
          this.user.communitiesAsArray.forEach(community => {
            if (community.accessState == CommunityAccessState.membershipInvited)
              inviteMsg +=
                "Pending membership invitation for the <b>" +
                community.name +
                "</b> community. ";

            if (community.accessState == CommunityAccessState.leadershipInvited)
              inviteMsg +=
                "Pending leadership invitation for the <b>" +
                community.name +
                "</b> community. ";
          });
          if (inviteMsg != "") {
            this.toastr.info(
              inviteMsg +
                "<br />Go via <i>&quot;My Communities&quot;</i> &rarr; <i>&quot;Community&quot;</i> page to accept or reject these invitations.",
              "Community Invitations Pending",
              {
                timeOut: 10000,
                enableHtml: true
              }
            );
          }

          this.ngZone.run(() =>
            this.router.navigate([this.user.initialPagePreference])
          );
        });
    }
  }

  logout() {
    this.afAuth.auth.signOut();
    this.user = new UserModel();
    this.router.navigate(["/"]);
    this.toastr.success("", "Signed out", {
      timeOut: 500
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

  get isProviderFirebase(): boolean {
    let isFirebase: boolean = false;
    this.afAuth.auth.currentUser.providerData.forEach(provider => {
      if (provider.providerId == "password") isFirebase = true;
    });
    console.log("Provider:", this.afAuth.auth.currentUser.providerData);
    return isFirebase;
  }

  updateUserProfile(displayName: string, photoURL: string) {
    if (!photoURL || photoURL == "")
      photoURL = "https://ui-avatars.com/api/?name=" + displayName;
    if (this.isProviderFirebase) {
      this.afAuth.auth.currentUser
        .updateProfile({
          displayName: displayName,
          photoURL: photoURL
        })
        .then(function() {
          console.log("updateUserProfile - success");
        })
        .catch(function(error) {
          console.log("updateUserProfile error:", error);
        });
    }
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
