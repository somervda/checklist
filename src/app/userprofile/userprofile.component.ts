import { AuditlogService } from "./../services/auditlog.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "./../services/auth.service";
import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { CommunityAccessState } from "../models/userModel";
import { StylingIndex } from "@angular/core/src/render3/interfaces/styling";
import { NgForm } from "@angular/forms";

@Component({
  selector: "userprofile",
  templateUrl: "./userprofile.component.html",
  styleUrls: ["./userprofile.component.scss"]
})
export class UserprofileComponent implements OnInit, OnDestroy {
  CommunityAccessState = CommunityAccessState;
  communities;
  isProviderFirebase: boolean = true;
  formSubscription;
  isValidForm: boolean;

  @ViewChild(NgForm) frmMain: NgForm;

  constructor(
    public auth: AuthService,
    private db: AngularFirestore,
    private als: AuditlogService
  ) {}

  ngOnInit() {
    this.communities = this.auth.user.communitiesAsArray;
    this.isProviderFirebase = this.auth.isProviderFirebase;
    // Subscribe to form to get the validation state
    this.formSubscription = this.frmMain.statusChanges.subscribe(result => {
      this.isValidForm = result == "VALID";
    });
  }

  changeInitialPagePreference(initialPagePreference: string) {
    console.log("changeInitialPagePreference", initialPagePreference);
    this.auth.user.dbFieldUpdate(
      this.auth.getUserUID,
      "initialPagePreference",
      initialPagePreference,
      this.db,
      this.als
    );
  }

  onDisplayNameUpdate(displayName: string) {
    // Always update the pictueURL based on display name
    if (this.isValidForm) this.auth.updateUserProfile(displayName, "");
  }

  onAction() {
    //console.log("reload communities list");
    this.communities = this.auth.user.communitiesAsArray;
  }

  ngOnDestroy() {
    if (this.formSubscription) this.formSubscription.unsubscribe();
  }
}
