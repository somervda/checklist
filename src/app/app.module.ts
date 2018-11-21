import { ClapiService } from "./services/clapi.service";
import { AuthService } from "./services/auth.service";

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

// Firebase
import { FirebaseUIModule } from "firebaseui-angular";
import * as firebase from "firebase/app";
import * as firebaseui from "firebaseui";
// currently there is a bug while building the app with --prod
// - https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/76
// the plugin exposes the two libraries as well. You can use those:
//import {FirebaseUIModule, firebase, firebaseui} from 'firebaseui-angular';

import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";

import { ToastrModule } from "ngx-toastr";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import {
  NgbDropdownModule,
  NgbCarouselModule,
  NgbCollapseModule
} from "@ng-bootstrap/ng-bootstrap";
import { HomeComponent } from "./home/home.component";
import { NotfoundComponent } from "./notfound/notfound.component";
import { FooterbarComponent } from "./footerbar/footerbar.component";
import { NavigationbarComponent } from "./navigationbar/navigationbar.component";
import { SessionStore } from "./services/session.store.service";
import { UserprofileComponent } from "./userprofile/userprofile.component";
import { UsersettingsComponent } from "./usersettings/usersettings.component";
import { MychecklistComponent } from "./mychecklist/mychecklist.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { LoginComponent } from "./login/login.component";
import { environment } from "src/environments/environment";

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: "popup",
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      scopes: ["public_profile", "email", "user_likes", "user_friends"],
      customParameters: {
        auth_type: "reauthenticate"
      },
      provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID
    },
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    {
      requireDisplayName: false,
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    },
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
  ],
  // tosUrl: '<your-tos-link>',
  // privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
  credentialHelper: firebaseui.auth.CredentialHelper.NONE
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotfoundComponent,
    NavigationbarComponent,
    FooterbarComponent,
    FooterbarComponent,
    NavigationbarComponent,
    UserprofileComponent,
    UsersettingsComponent,
    MychecklistComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // required animations module
    HttpClientModule,
    ToastrModule.forRoot(), // ToastrModule added
    NgbDropdownModule,
    NgbCarouselModule,
    NgbCollapseModule,
    NgxDatatableModule,
    RouterModule.forRoot([
      { path: "", component: HomeComponent },
      { path: "login", component: LoginComponent },
      { path: "userprofile", component: UserprofileComponent },
      { path: "usersettings", component: UsersettingsComponent },
      { path: "mychecklist", component: MychecklistComponent },
      { path: "**", component: NotfoundComponent }
    ]),
    AngularFireModule.initializeApp(environment.fbConfig),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig)
  ],
  providers: [AuthService, SessionStore, ClapiService],
  bootstrap: [AppComponent]
})
export class AppModule {}
