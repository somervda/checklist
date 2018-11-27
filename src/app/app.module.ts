import { ClapiService } from "./services/clapi.service";
import { AuthService } from "./services/auth.service";

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from '@angular/forms';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { ToastrModule } from "ngx-toastr";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import {
  NgbDropdownModule,
  NgbCarouselModule,
  NgbCollapseModule,
  NgbTooltipModule
} from "@ng-bootstrap/ng-bootstrap";
import { HomeComponent } from "./home/home.component";
import { NotfoundComponent } from "./notfound/notfound.component";
import { FooterbarComponent } from "./footerbar/footerbar.component";
import { NavigationbarComponent } from "./navigationbar/navigationbar.component";
import { UserprofileComponent } from "./userprofile/userprofile.component";
import { UsersettingsComponent } from "./usersettings/usersettings.component";
import { MychecklistComponent } from "./mychecklist/mychecklist.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { LoginComponent } from "./login/login.component";
import { environment } from "src/environments/environment";
import { SignupComponent } from './signup/signup.component';
import { MychecklistsComponent } from './mychecklists/mychecklists.component';



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
    LoginComponent,
    SignupComponent,
    MychecklistsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule, // required animations module
    HttpClientModule,
    ToastrModule.forRoot(), // ToastrModule added
    NgbDropdownModule,
    NgbCarouselModule,
    NgbCollapseModule,
    NgxDatatableModule,
    NgbTooltipModule,
    RouterModule.forRoot([
      { path: "", component: HomeComponent },
      { path: "login", component: LoginComponent },
      { path: "signup", component: SignupComponent },
      { path: "userprofile", component: UserprofileComponent },
      { path: "usersettings", component: UsersettingsComponent },
      { path: "mychecklists", component: MychecklistsComponent },
      { path: "**", component: NotfoundComponent }
    ]),
    AngularFireModule.initializeApp(environment.fbConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [AuthService, ClapiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
