import { ClapiService } from "./services/clapi.service";
import { AuthService } from "./services/auth.service";

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";

// Firebase
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";

import { ToastrModule } from "ngx-toastr";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import {
  NgbAccordionModule,
  NgbDropdownModule,
  NgbCarouselModule,
  NgbCollapseModule,
  NgbTooltipModule,
  NgbRatingModule
} from "@ng-bootstrap/ng-bootstrap";
import { HomeComponent } from "./home/home.component";
import { NotfoundComponent } from "./notfound/notfound.component";
import { FooterbarComponent } from "./footerbar/footerbar.component";
import { NavigationbarComponent } from "./navigationbar/navigationbar.component";
import { UserprofileComponent } from "./userprofile/userprofile.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { LoginComponent } from "./login/login.component";
import { environment } from "src/environments/environment";
import { SignupComponent } from "./signup/signup.component";
import { MychecklistsComponent } from "./mychecklists/mychecklists.component";
import { ChecklistComponent } from "./checklist/checklist.component";
import { ChecklistitemComponent } from "./checklistitem/checklistitem.component";
import { ChecklistdesignerComponent } from "./checklistdesigner/checklistdesigner.component";
import { HeaderComponent } from "./header/header.component";
import { ChecklistitemdesignerComponent } from "./checklistitemdesigner/checklistitemdesigner.component";
import { CheckboxComponent } from "./checkbox/checkbox.component";
import { MycommunitiesComponent } from "./mycommunities/mycommunities.component";
import { CommunityComponent } from "./community/community.component";
import { CommunitydesignerComponent } from "./communitydesigner/communitydesigner.component";
import { TesterComponent } from "./tester/tester.component";

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
    LoginComponent,
    SignupComponent,
    MychecklistsComponent,
    ChecklistComponent,
    ChecklistitemComponent,
    ChecklistdesignerComponent,
    HeaderComponent,
    ChecklistitemdesignerComponent,
    CheckboxComponent,
    MycommunitiesComponent,
    CommunityComponent,
    CommunitydesignerComponent,
    TesterComponent
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
    NgbRatingModule,
    NgbAccordionModule,
    RouterModule.forRoot([
      { path: "", component: HomeComponent },
      { path: "login", component: LoginComponent },
      { path: "signup", component: SignupComponent },
      { path: "userprofile", component: UserprofileComponent },
      // Checklist
      { path: "mychecklists", component: MychecklistsComponent },
      { path: "checklist/:id", component: ChecklistComponent },
      {
        path: "checklistdesigner/:action",
        component: ChecklistdesignerComponent
      },
      {
        path: "checklistdesigner/:action/:id",
        component: ChecklistdesignerComponent
      },
      {
        path: "checklistitemdesigner/:action",
        component: ChecklistitemdesignerComponent
      },
      {
        path: "checklistitemdesigner/:action/:id",
        component: ChecklistitemdesignerComponent
      },
      // Community
      { path: "mycommunities", component: MycommunitiesComponent },
      { path: "community/:id", component: CommunityComponent },
      {
        path: "communitydesigner/:action",
        component: CommunitydesignerComponent
      },
      {
        path: "communitydesigner/:action/:id",
        component: CommunitydesignerComponent
      },
      {
        path: "tester",
        component: TesterComponent
      },
      { path: "**", component: NotfoundComponent }
    ]),
    AngularFireModule.initializeApp(environment.fbConfig),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [AuthService, ClapiService],
  bootstrap: [AppComponent]
})
export class AppModule {}
