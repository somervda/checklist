import { AuthService } from "./../services/auth.service";
import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";

@Component({
  selector: "app-mycommunities",
  templateUrl: "./mycommunities.component.html",
  styleUrls: ["./mycommunities.component.scss"]
})
export class MycommunitiesComponent implements OnInit {
  //communities$;
  communities = [];

  // See https://swimlane.gitbook.io/ngx-datatable/api/column/inputs

  constructor(public auth: AuthService) {}

  ngOnInit() {
    // See https://www.udemy.com/the-complete-angular-master-class/learn/v4/t/lecture/7673810?start=0
    // Using observable and async to manage lifetime of subscription in sync with lifetime of the component
    // use map operator to normaize snapshotchanges to a more easily managed array of objects that have document id  // and data at same level
    // see https://stackoverflow.com/questions/48795092/angular-httpclient-map-observable-array-of-objects
    // Original version
    //    this.communities$ = this.db
    //   .collection("/communities")
    //   .snapshotChanges()
    //   .pipe(
    //     map(documentChangeAction =>
    //       documentChangeAction.map(row => {
    //         return Object.assign(
    //           { id: row.payload.doc.id },
    //           row.payload.doc.data()
    //         );
    //       })
    //     )
    //   );
    this.communities = this.auth.user.communitiesAsArray;
    // console.log("MyCommunities onInit :", this.communities);
  }
}
