import { AuthService } from "./../services/auth.service";
import { Component, OnInit } from "@angular/core";
import { CommunityAccessState } from "../models/userModel";

@Component({
  selector: "userprofile",
  templateUrl: "./userprofile.component.html",
  styleUrls: ["./userprofile.component.css"]
})
export class UserprofileComponent implements OnInit {
  CommunityAccessState = CommunityAccessState;
  communities;
  constructor(public auth: AuthService) {}

  ngOnInit() {

    this.communities = this.auth.user.communitiesAsArray;
  }
}
