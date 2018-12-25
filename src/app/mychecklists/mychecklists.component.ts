import { ChecklistModel } from "./../models/checklistModel";
import { AuthService } from "./../services/auth.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { map, combineLatest } from "rxjs/operators";
import { ChecklistStatus } from "../models/checklistModel";
import { FirebaseStorage } from "@angular/fire";
import { observable, empty } from "rxjs";

@Component({
  selector: "app-mychecklists",
  templateUrl: "./mychecklists.component.html",
  styleUrls: ["./mychecklists.component.css"]
})
export class MychecklistsComponent implements OnInit, OnDestroy {
  checklists$;
  ChecklistStatus = ChecklistStatus;
  checklistSubscription;
  filterToggle: boolean = false;

  showOwned: boolean = true;
  selectedOwnership: string = "All";
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
    console.log("onInit ChecklistStatus.getChecklistStatusAsArray", map);
    // this.auth.user$.subscribe(e => {
    //   console.log("mychecklists onInit user$.subscribe");
    //   this.refreshChecklists();
    // });
    console.log("onInit user", this.auth.user);
    this.refreshChecklists();
  }

  showOwner(checked: boolean) {
    if (checked) this.showOwned = true;
    else this.showOwned = false;
    this.refreshChecklists();
  }

  onChangeOwnership() {
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

    // *** 1. Query1 for checklists by owner , only query if the ownership selector is All or Owner
    var ownerRef = this.db.collection("checklists/", ref => {
      let retVal = ref as any;
      retVal = retVal.where("owner.uid", "==", this.auth.getUserUID); // Select checklists owned by user
      if (
        this.selectedOwnership != "All" &&
        this.selectedOwnership != "Owned"
      ) {
        retVal = retVal.where("owner.uid", "==", ""); // Force no owned checklists to be selected
      }
      if (this.selectedStatus != -1) {
        retVal = retVal.where("status", "==", Number(this.selectedStatus));
      }
      //console.log("refreshChecklists owner retVal", retVal);
      return retVal;
    });

    // Create simplifies Observables of arrays.

    // See https://www.udemy.com/the-complete-angular-master-class/learn/v4/t/lecture/7673810?start=0
    // Using observable and async to manage lifetime of subscription in sync with lifetime of the component

    // use map operator to normaize snapshotchanges to a more easily managed array of checklists objects
    // see https://stackoverflow.com/questions/48795092/angular-httpclient-map-observable-array-of-objects

    const ownerCL$ = ownerRef.snapshotChanges().pipe(
      map(documentChangeAction =>
        documentChangeAction.map(row => {
          return {
            id: row.payload.doc.id,
            ...row.payload.doc.data()
          } as ChecklistModel;
        })
      )
    );

    // *** 2. Build and array of observables over the checklists in communities that the user can access
    var communityCLArray$ = [];
    var communitiesToQuery = this.auth.user.communitiesAsArray; // select all user communities bt default
    if (this.selectedOwnership != "All" && this.selectedOwnership != "Owned") {
      // Only query the selected community
      communitiesToQuery = [
        { id: this.selectedOwnership, accessState: 0, name: "" }
      ];
    }
    if (this.selectedOwnership != "Owned") {
      communitiesToQuery.forEach(userCommunity => {
        // Query2 for checklists by community
        console.log("userCommunity", userCommunity);
        var communityRef = this.db.collection("checklists/", ref => {
          let retVal = ref as any;
          // Default will select communityId = None (nothing selected)
          retVal = retVal.where(
            "community.communityId",
            "==",
            userCommunity.id
          );
          if (this.selectedStatus != -1) {
            retVal = retVal.where("status", "==", Number(this.selectedStatus));
          }
          console.log("refreshChecklists community retVal", retVal);
          return retVal;
        });

        // Push the observable for matching checklists onto the observable array (OR query)
        communityCLArray$.push(
          communityRef.snapshotChanges().pipe(
            map(documentChangeAction =>
              documentChangeAction.map(row => {
                return {
                  id: row.payload.doc.id,
                  ...row.payload.doc.data()
                } as ChecklistModel;
              })
            )
          )
        );
      });
    }

    // *** 3. role the  arrays from the combineLatest operation to make one long array (using the ... array operator)
    this.checklists$ = ownerCL$;
    communityCLArray$.forEach(communityCLArrayEntry$ => {
      this.checklists$ = this.checklists$.pipe(
        combineLatest(communityCLArrayEntry$),
        map(([cl1, cl2]) => [...cl1, ...cl2])
      );
    });
    // Subscribe to show results
    this.checklistSubscription = this.checklists$.subscribe(data =>
      console.log("Init checklists$", data)
    );
  }

  filterToggler() {
    this.filterToggle = !this.filterToggle;
  }

  ngOnDestroy() {
    if (this.checklistSubscription) this.checklistSubscription.unsubscribe();
  }
}
