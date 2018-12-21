import { AuthService } from "./../services/auth.service";
import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { map, combineLatest } from "rxjs/operators";
import { ChecklistStatus } from "../models/checklistModel";
import { FirebaseStorage } from "@angular/fire";

@Component({
  selector: "app-mychecklists",
  templateUrl: "./mychecklists.component.html",
  styleUrls: ["./mychecklists.component.css"]
})
export class MychecklistsComponent implements OnInit {
  checklists$;
  ChecklistStatus = ChecklistStatus;

  showOwned: boolean = true;
  selectedCommunity: string = "None";
  selectedStatus: number = -1;
  checklistStatusAsArray;

  // See https://swimlane.gitbook.io/ngx-datatable/api/column/inputs

  constructor(private db: AngularFirestore, public auth: AuthService) {}

  ngOnInit() {
    let map: { id: number; name: string }[] = [];

    for (var n in this.ChecklistStatus) {
      if (typeof this.ChecklistStatus[n] === "number") {
        map.push({ id: <any>this.ChecklistStatus[n], name: n });
      }
    }
    this.checklistStatusAsArray = map;
    console.log("ChecklistStatus.getChecklistStatusAsArray", map);
    this.refreshChecklists();
  }

  showOwner(checked: boolean) {
    if (checked) this.showOwned = true;
    else this.showOwned = false;
    this.refreshChecklists();
  }

  showCommunity() {
    //console.log("showCommunity", this.selectedCommunity);
    this.refreshChecklists();
  }

  filterByStatus() {
    console.log("filterByStatus", this.selectedStatus);
    this.refreshChecklists();
  }

  refreshChecklists() {
    // 2 queries are run (owner query and community query) then are combined into one observable
    // see https://stackoverflow.com/questions/50930604/optional-parameter-and-clausule-where

    // Query1 for checklists by owner
    var ownerRef = this.db.collection("checklists/", ref => {
      let retVal = ref as any;
      retVal = retVal.where("owner.uid", "==", this.auth.getUserUID); // Default select checklists owned by user
      if (this.showOwned == false) {
        retVal = retVal.where("owner.uid", "==", ""); // Force no owned checklists to be selected
      }
      if (this.selectedStatus != -1) {
        retVal = retVal.where("status", "==", Number(this.selectedStatus));
      }
      console.log("refreshChecklists owner retVal", retVal);
      return retVal;
    });

    // Query2 for checklists by community
    var communityRef = this.db.collection("checklists/", ref => {
      let retVal = ref as any;
      // Default will select communityId = None (nothing selected)
      retVal = retVal.where(
        "community.communityId",
        "==",
        this.selectedCommunity
      );
      if (this.selectedStatus != -1) {
        retVal = retVal.where("status", "==", Number(this.selectedStatus));
      }
      console.log("refreshChecklists community retVal", retVal);
      return retVal;
    });

    // Create simplifies Observables of arrays.

    // See https://www.udemy.com/the-complete-angular-master-class/learn/v4/t/lecture/7673810?start=0
    // Using observable and async to manage lifetime of subscription in sync with lifetime of the component

    // use map operator to normaize snapshotchanges to a more easily managed array of objects that have document id  // and data at same level
    // see https://stackoverflow.com/questions/48795092/angular-httpclient-map-observable-array-of-objects

    const ownerCL$ = ownerRef.snapshotChanges().pipe(
      map(documentChangeAction =>
        documentChangeAction.map(row => {
          return Object.assign(
            { id: row.payload.doc.id },
            row.payload.doc.data()
          );
        })
      )
    );

    const communityCL$ = communityRef.snapshotChanges().pipe(
      map(documentChangeAction =>
        documentChangeAction.map(row => {
          return Object.assign(
            { id: row.payload.doc.id },
            row.payload.doc.data()
          );
        })
      )
    );

    // ownerCL$.subscribe(data => console.log("Test #5 ownerCL$", data));

    // communityCL$.subscribe(data => console.log("Test #5 communityCL$", data));

    // role the two arrays from the combineLatest operation to make one long array (using the ... array operator)
    this.checklists$ = ownerCL$.pipe(
      combineLatest(communityCL$),
      map(([cl1, cl2]) => [...cl1, ...cl2])
    );
    // Show results
    this.checklists$.subscribe(data => console.log("Init checklists$", data));
  }
}
