import { Routes } from "@angular/router";

import { NotfoundComponent } from "./../notfound/notfound.component";
import { TesterComponent } from "./../tester/tester.component";
import { CategorydesignerComponent } from "./../categorydesigner/categorydesigner.component";
import { CategoryComponent } from "./../category/category.component";
import { ThemesComponent } from "./../themes/themes.component";
import { ThemedesignerComponent } from "./../themedesigner/themedesigner.component";
import { ThemeComponent } from "./../theme/theme.component";
import { CommunitydesignerComponent } from "./../communitydesigner/communitydesigner.component";
import { CommunityComponent } from "./../community/community.component";
import { MycommunitiesComponent } from "./../mycommunities/mycommunities.component";
import { ChecklistdesignerComponent } from "./../checklistdesigner/checklistdesigner.component";
import { ChecklistComponent } from "./../checklist/checklist.component";
import { MychecklistsComponent } from "./../mychecklists/mychecklists.component";
import { UserprofileComponent } from "./../userprofile/userprofile.component";
import { SignupComponent } from "./../signup/signup.component";
import { LoginComponent } from "./../login/login.component";
import { HomeComponent } from "./../home/home.component";
import { ChecklistitemdesignerComponent } from "./../checklistitemdesigner/checklistitemdesigner.component";

export const appRoutes: Routes = [
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
];
