import { AuthService } from "./../services/auth.service";
import { UserModel, CommunityAccessState } from "./../models/userModel";
import { Subscription } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-tester",
  templateUrl: "./tester.component.html",
  styleUrls: ["./tester.component.css"]
})
export class TesterComponent implements OnInit {
  users;
  communityId: string = "Tw8CPGkAwTxjUxW7dnNg";
  //communityId: string = "Ufrqt16S1Yr1c7cG7eqq";

  CommunityAccessState: CommunityAccessState;
  user = new UserModel();

  constructor(private db: AngularFirestore, private auth: AuthService) {}

  ngOnInit() {
    // 01 - test querying based on user community map
    const accessField: string =
      "communities." + this.communityId + ".accessState";

    this.db
      .collection(
        "users",
        ref =>
          ref
            //         .where("memberOfCommunity", "array-contains", this.communityId)
            // .where(accessField, "==", "member") // Find users who have member access to the community
            .where(accessField, ">", "") // Will find users who have any access to community
      )
      .get()
      .toPromise()
      .then(data => {
        console.log("Test #1  docs collection", data.docs);
        this.users = data.docs;
      });

    // 02 Test user model
    //this.user.loadFromObject({ communities: {} }, "commId");
    console.log("Test #2 loadFromObject user:", this.user.communities);

    this.user.mergeCommunity("commId", "111", CommunityAccessState.leader);
    console.log("Test #2 mergeCommunity user:", this.user);
    this.user.mergeCommunity("commId2", "111", CommunityAccessState.member);
    console.log("Test #2 mergeCommunity user:", this.user);

    //this.user.deleteCommunity("commId2");
    console.log("Test #2 mergeCommunity user:", this.user);

    // 03 test that user information is retained in the auth service (singleton? service)
    console.log("Test #3", this.auth.user);

    // 04 test iterating through communities in user

    for (var community in this.auth.user.communities) {
      console.log(
        "Test #4",
        community + " - ",
        this.auth.user.communities[community]
      );
    }
  }
}