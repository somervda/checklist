import { appRoutes } from "./routing/appRoutes";
import { ClapiService } from "./services/clapi.service";
import { AuthService } from "./services/auth.service";

import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
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
import { NavigationbarComponent } from "./widgets/navigationbar/navigationbar.component";
import { UserprofileComponent } from "./userprofile/userprofile.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { LoginComponent } from "./login/login.component";
import { environment } from "src/environments/environment";
import { SignupComponent } from "./signup/signup.component";
import { MychecklistsComponent } from "./mychecklists/mychecklists.component";
import { ChecklistComponent } from "./checklist/checklist.component";
import { ChecklistitemComponent } from "./checklistitem/checklistitem.component";
import { ChecklistdesignerComponent } from "./checklistdesigner/checklistdesigner.component";
import { HeaderComponent } from "./widgets/header/header.component";
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
import { ThemecatetoryselectorComponent } from "./widgets/themecatetoryselector/themecatetoryselector.component";
import { CommunitymanagermodalComponent } from "./widgets/communitymanagermodal/communitymanagermodal.component";
import { ActivityComponent } from "./activity/activity.component";
import { ActivitiesComponent } from "./activities/activities.component";
import { ChecklistmanagermodalComponent } from "./widgets/checklistmanagermodal/checklistmanagermodal.component";

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
    CommunitymanagermodalComponent,
    ActivityComponent,
    ActivitiesComponent,
    ChecklistmanagermodalComponent
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
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(environment.fbConfig),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [AuthService, ClapiService, AuditlogService],
  bootstrap: [AppComponent]
})
export class AppModule {}
