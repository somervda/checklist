import { Subscription } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-tester",
  templateUrl: "./tester.component.html",
  styleUrls: ["./tester.component.css"]
})
export class TesterComponent implements OnInit {
  users$;

  constructor(private db: AngularFirestore) {}

  ngOnInit() {
    this.db
      .collection("users", ref =>
        ref.where(
          "communities",
          "array-contains",
          "{ community:'Tw8CPGkAwTxjUxW7dnNg',roleState:'member'}"
        )
      )
      .get()
      .toPromise()
      .then(data => console.log("array of maps test", data));

    this.db
      .collection("users", ref =>
        ref.where("memberOfCommunity", "array-contains", "Tw8CPGkAwTxjUxW7dnNg")
      )
      .get()
      .toPromise()
      .then(data => console.log("array of strings test", data));
  }
}
