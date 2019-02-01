import { FilterstoreService } from "./../services/filterstore.service";
import { CommunityAccessState } from "./../models/userModel";
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
  styleUrls: ["./mychecklists.component.scss"]
})
export class MychecklistsComponent implements OnInit, OnDestroy {
  checklists$;
  ChecklistStatus = ChecklistStatus;
  checklistSubscription;
  checklists = [];
  filterToggle: boolean = false;

  showOwned: boolean = true;
  checklistStatusAsArray;

  queryLimit = 100;
  queryLimitExceeded = false;

  CommunityAccessState = CommunityAccessState;
  myCommunities;

  // See https://swimlane.gitbook.io/ngx-datatable/api/column/inputs

  constructor(
    private db: AngularFirestore,
    public auth: AuthService,
    public filterStore: FilterstoreService
  ) {}

  ngOnInit() {
    let map: { id: number; name: string }[] = [];

    this.myCommunities = this.auth.user.communitiesAsArray.filter(
      c =>
        c.accessState == CommunityAccessState.leader ||
        c.accessState == CommunityAccessState.member ||
        c.accessState == CommunityAccessState.leadershipInvited
    );

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
    console.log(
      "filterByStatus",
      this.filterStore.myChecklistFilters.selectedStatus
    );
    this.refreshChecklists();
  }

  filterByAge() {
    console.log("filterByAge", this.filterStore.myChecklistFilters.selectedAge);
    this.refreshChecklists();
  }

  refreshChecklists() {
    this.queryLimitExceeded = false;
    // 2 queries are run (owner query and community query) then are combined into one observable
    // see https://stackoverflow.com/questions/50930604/optional-parameter-and-clausule-where

    // *** 1. Query1 for checklists by owner , only query if the ownership selector is All or Owner
    var ownerRef = this.db.collection("checklists/", ref => {
      let retVal = ref as any;
      retVal = retVal.where("owner.uid", "==", this.auth.getUserUID); // Select checklists owned by user
      if (
        this.filterStore.myChecklistFilters.selectedOwnership != "All" &&
        this.filterStore.myChecklistFilters.selectedOwnership != "Owned"
      ) {
        retVal = retVal.where("owner.uid", "==", ""); // Force no owned checklists to be selected
      }
      if (this.filterStore.myChecklistFilters.selectedStatus != -1) {
        retVal = retVal.where(
          "status",
          "==",
          Number(this.filterStore.myChecklistFilters.selectedStatus)
        );
      }
      if (this.filterStore.myChecklistFilters.selectedCategory.id != "-1") {
        retVal = retVal.where(
          "category.id",
          "==",
          this.filterStore.myChecklistFilters.selectedCategory.id
        );
      }

      switch (Number(this.filterStore.myChecklistFilters.selectedAge)) {
        case -1:
          // All - no additional filter
          break;
        case 0:
          // Overdue
          retVal = retVal.where("dateTargeted", "<", new Date());
          break;
        default:
          retVal = retVal.where(
            "dateCreated",
            ">",
            this.addDays(
              new Date(),
              this.filterStore.myChecklistFilters.selectedAge * -1
            )
          );
          break;
      }

      retVal = retVal.limit(this.queryLimit);
      console.log("refreshChecklists owner retVal", retVal);
      return retVal;
    });

    // Create simplifies Observables of arrays.

    // See https://www.udemy.com/the-complete-angular-master-class/learn/v4/t/lecture/7673810?start=0
    // Using observable and async to manage lifetime of subscription in sync with lifetime of the component

    // use map operator to normalize snapshotchanges to a more easily managed array of checklists objects
    // see https://stackoverflow.com/questions/48795092/angular-httpclient-map-observable-array-of-objects

    const ownerCL$ = ownerRef.snapshotChanges().pipe(
      map(documentChangeAction =>
        documentChangeAction.map(row => {
          // Need to set the id after creating the checklistitem
          // otherwise the id get cleared out when the data() is applied
          let checklistItem = row.payload.doc.data();
          checklistItem["id"] = row.payload.doc.id;
          checklistItem["isOverdue"] = this.isOverdue(checklistItem);
          return checklistItem as ChecklistModel;
        })
      )
    );

    // *** 2. Build and array of observables over the checklists in communities that the user can access
    var communityCLArray$ = [];
    let queryCommunities = this.myCommunities.slice();

    if (
      this.filterStore.myChecklistFilters.selectedOwnership != "All" &&
      this.filterStore.myChecklistFilters.selectedOwnership != "Owned"
    ) {
      // Only query the selected community
      queryCommunities = [
        {
          id: this.filterStore.myChecklistFilters.selectedOwnership,
          accessState: 0,
          name: ""
        }
      ];
    }
    if (this.filterStore.myChecklistFilters.selectedOwnership != "Owned") {
      queryCommunities.forEach(userCommunity => {
        // Query2 for checklists by community
        console.log("userCommunity", userCommunity);
        var communityRef = this.db.collection("checklists/", ref => {
          let retVal = ref as any;
          // Default will select community.id = None (nothing selected)
          retVal = retVal.where("community.id", "==", userCommunity.id);
          if (this.filterStore.myChecklistFilters.selectedStatus != -1) {
            retVal = retVal.where(
              "status",
              "==",
              Number(this.filterStore.myChecklistFilters.selectedStatus)
            );
          }
          if (this.filterStore.myChecklistFilters.selectedCategory.id != "-1") {
            retVal = retVal.where(
              "category.id",
              "==",
              this.filterStore.myChecklistFilters.selectedCategory.id
            );
          }

          console.log(
            "Query1 selectedAge",
            this.filterStore.myChecklistFilters.selectedAge
          );
          switch (Number(this.filterStore.myChecklistFilters.selectedAge)) {
            case -1:
              // All - no additional filter
              break;
            case 0:
              // Overdue
              retVal = retVal.where("dateTargeted", "<", new Date());
              break;
            default:
              retVal = retVal.where(
                "dateCreated",
                ">",
                this.addDays(
                  new Date(),
                  this.filterStore.myChecklistFilters.selectedAge * -1
                )
              );
              break;
          }

          console.log("refreshChecklists community retVal", retVal);
          retVal = retVal.limit(this.queryLimit);
          return retVal;
        });

        // Push the observable for matching checklists onto the observable array (OR query)
        communityCLArray$.push(
          communityRef.snapshotChanges().pipe(
            map(documentChangeAction =>
              documentChangeAction.map(row => {
                // Need to set the id after creating the checklistitem
                // otherwise the id get cleared out when the data() is applied
                let checklistItem = row.payload.doc.data();
                checklistItem["id"] = row.payload.doc.id;
                checklistItem["isOverdue"] = this.isOverdue(checklistItem);
                return checklistItem as ChecklistModel;
              })
            )
          )
        );
      });
    }

    // *** 3. role the  arrays from the combineLatest operation to make one long array (using the ... array operator)
    this.checklists$ = ownerCL$;
    communityCLArray$.forEach((communityCLArrayEntry$, index) => {
      //let indexId = [{ indexer: 99 }];
      this.checklists$ = this.checklists$.pipe(
        combineLatest(communityCLArrayEntry$),
        map(([cl1, cl2]) => {
          // Check number of items retrieved in each query does not exceed the queryLimit

          if (index == 0) {
            if (cl1.length >= this.queryLimit) this.queryLimitExceeded = true;
          }
          if (cl2.length >= this.queryLimit) this.queryLimitExceeded = true;

          // append the cl2 array to the cl1 array
          return [...cl1, ...cl2];
        })
      );
    });
    // *** 4. Subscribe create array of checklists without duplicates
    // There may be faster ways of doing dedups .
    // Also remove deleted items unless explicitly requested
    this.checklistSubscription = this.checklists$.subscribe(data => {
      // console.log("Init checklists$", data);
      this.checklists = [];
      data.forEach(item => {
        //console.log("Process checklistItems", item);
        const id = item.id;
        let isMatch = false;
        this.checklists.forEach(entry => {
          if (entry.id == item.id) isMatch = true;
        });

        if (!isMatch) {
          this.checklists.push(item);
        }
      });
      //console.log("Init unique checklists", this.checklists);
    });
    this.filterToggle = false;
  }

  filterToggler() {
    this.filterToggle = !this.filterToggle;
  }

  ngOnDestroy() {
    if (this.checklistSubscription) this.checklistSubscription.unsubscribe();
  }

  addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  themeCategoryChange(result) {
    console.log("themeCategoryChange", result);
    this.filterStore.myChecklistFilters.selectedCategory = {
      id: result.categoryId,
      name: result.categoryName
    };
    this.filterStore.myChecklistFilters.selectedTheme = {
      id: result.themeId,
      name: result.themeName
    };
    this.refreshChecklists();
  }

  isOverdue(checklist): boolean {
    if (checklist.dateTargeted) {
      console.log(
        "isOverdue",
        checklist.title,
        checklist.dateTargeted,
        checklist.status
      );
      if (
        checklist.dateTargeted.seconds <= Date.now() / 1000 &&
        checklist.status == ChecklistStatus.Active
      ) {
        console.log("isOverdure True!!");
        return true;
      }
    }
    return false;
  }
}
