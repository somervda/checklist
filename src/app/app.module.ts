import { AuthService } from "./services/auth.service";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
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
    MychecklistComponent
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
      { path: "userprofile", component: UserprofileComponent },
      { path: "usersettings", component: UsersettingsComponent },
      { path: "mychecklist", component: MychecklistComponent },
      { path: "**", component: NotfoundComponent }
    ])
  ],
  providers: [AuthService, SessionStore],
  bootstrap: [AppComponent]
})
export class AppModule {}
