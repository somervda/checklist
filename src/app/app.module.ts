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

import { RecaptchaModule } from "ng-recaptcha";

import { AppComponent } from "./app.component";
import {
  NgbAccordionModule,
  NgbDropdownModule,
  NgbCarouselModule,
  NgbCollapseModule,
  NgbTooltipModule,
  NgbRatingModule,
  NgbDatepickerModule,
  NgbModalModule
} from "@ng-bootstrap/ng-bootstrap";

import { NgxEditorModule } from "ngx-editor";
import { PopoverModule } from "ngx-bootstrap"; // NgxEditorModule dependency

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
import { ThemeComponent } from "./theme/theme.component";
import { ThemesComponent } from "./themes/themes.component";
import { ThemedesignerComponent } from "./themedesigner/themedesigner.component";
import { AuditlogService } from "./services/auditlog.service";
import { CategoryComponent } from "./category/category.component";
import { CategorydesignerComponent } from "./categorydesigner/categorydesigner.component";
import { ThemecatetoryselectorComponent } from "./themecatetoryselector/themecatetoryselector.component";
import { ActivityComponent } from "./activity/activity.component";
import { CommunitymanagermodalComponent } from './communitymanagermodal/communitymanagermodal.component';

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
    TesterComponent,
    ThemeComponent,
    ThemesComponent,
    ThemedesignerComponent,
    CategoryComponent,
    CategorydesignerComponent,
    ThemecatetoryselectorComponent,
    ActivityComponent,
    CommunitymanagermodalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule, // required animations module
    HttpClientModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      positionClass: "toast-top-right"
    }), // ToastrModule added
    NgbAccordionModule,
    NgbDropdownModule,
    NgbCarouselModule,
    NgbCollapseModule,
    NgxDatatableModule,
    NgbTooltipModule,
    NgbRatingModule,
    NgbDatepickerModule,
    NgxEditorModule,
    NgbModalModule,
    PopoverModule,
    RecaptchaModule,
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
      // Themes
      { path: "themes", component: ThemesComponent },
      { path: "theme/:id", component: ThemeComponent },
      {
        path: "themedesigner/:action",
        component: ThemedesignerComponent
      },
      {
        path: "themedesigner/:action/:id",
        component: ThemedesignerComponent
      },
      // Categories
      { path: "category/:id", component: CategoryComponent },
      {
        path: "categorydesigner/:action",
        component: CategorydesignerComponent
      },
      {
        path: "categorydesigner/:action/:id",
        component: CategorydesignerComponent
      },
      // Misc
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
  providers: [AuthService, ClapiService, AuditlogService],
  bootstrap: [AppComponent]
})
export class AppModule {}
