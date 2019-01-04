import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "./../services/auth.service";
import { Component, OnInit } from "@angular/core";
import { CommunityAccessState } from "../models/userModel";
import { StylingIndex } from "@angular/core/src/render3/interfaces/styling";

@Component({
  selector: "userprofile",
  templateUrl: "./userprofile.component.html",
  styleUrls: ["./userprofile.component.scss"]
})
export class UserprofileComponent implements OnInit {
  CommunityAccessState = CommunityAccessState;
  communities;

  constructor(public auth: AuthService, private db: AngularFirestore) {}

  ngOnInit() {
    this.communities = this.auth.user.communitiesAsArray;
  }

  changeInitialPagePreference() {
    this.auth.user.dbFieldUpdate(
      this.auth.getUserUID,
      "initialPagePreference",
      this.auth.user.initialPagePreference,
      this.db
    );
  }

  onDisplayNameUpdate() {
    this.auth.updateUserProfile("Jim", this.auth.getUserPicture);
  }

  onUserPictureUpdate() {
    this.auth.updateUserProfile(this.auth.getUserDisplayname, "none");
  }
}
