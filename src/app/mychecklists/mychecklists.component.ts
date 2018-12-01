import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-mychecklists",
  templateUrl: "./mychecklists.component.html",
  styleUrls: ["./mychecklists.component.css"]
})
export class MychecklistsComponent implements OnInit {
  checklists$;
  checklists;

  // See https://swimlane.gitbook.io/ngx-datatable/api/column/inputs
  columns = [
    { prop: "id", name: "Id", width: 200 },
    { prop: "title", name: "Title" },
    { prop: "author", name: "Author" }
  ];

  constructor(private db: AngularFirestore) {}

  ngOnInit() {
    // See https://www.udemy.com/the-complete-angular-master-class/learn/v4/t/lecture/7673810?start=0
    // Using observable and async to manage lifetime of subscription in sync with lifetime of the component

    // use map operator to normaize snapshotchanges to a more easily managed array of objects that have document id  // and data at same level
    // see https://stackoverflow.com/questions/48795092/angular-httpclient-map-observable-array-of-objects

    this.checklists$ = this.db
      .collection("/checklists")
      .snapshotChanges()
      .pipe(
        map(data =>
          data.map(row => {
            return Object.assign(
              { id: row.payload.doc.id },
              row.payload.doc.data()
            );
          })
        )
      );

    // this.db
    //   .collection("/checklists")
    //   .snapshotChanges()
    //   .pipe(
    //     map(data =>
    //       data.map(row => {
    //         return Object.assign(
    //           { id: row.payload.doc.id },
    //           row.payload.doc.data()
    //         );
    //         // return {
    //         //   xmas: "25"
    //         // };
    //         console.log("row", row);
    //       })
    //     )
    //   )
    //   .subscribe(snapshot => {
    //     this.checklists = snapshot;
    //     console.log("snapshot: ", snapshot);
    //   });
  }
}
