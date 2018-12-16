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

  constructor(private db: AngularFirestore) {}

  ngOnInit() {
    const accessField: string =
      "communities." + this.communityId + ".accessState";

    // this.db
    //   .collection("users", ref =>
    //     ref.where(
    //       "communities",
    //       "array-contains",
    //       "{ community:'Tw8CPGkAwTxjUxW7dnNg',roleState:'member'}"
    //     )
    //   )
    //   .get()
    //   .toPromise()
    //   .then(data => console.log("array of maps test", data));

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
        console.log(" docs collection", data.docs);
        this.users = data.docs;
      });
  }
}
