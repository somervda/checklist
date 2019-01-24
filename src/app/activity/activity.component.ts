import { ActivityModel } from "./../models/activityModel";
import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-activity",
  templateUrl: "./activity.component.html",
  styleUrls: ["./activity.component.scss"]
})
export class ActivityComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() editMode: boolean;

  activity;

  activitySubscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: AngularFirestore,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.activitySubscription = this.db
      .doc("activities/" + this.id)
      .snapshotChanges()
      .subscribe(action => {
        this.activity = new ActivityModel(action.payload);
        // console.log("activity subscription", this.activity);
      });
  }

  onActivityDelete() {
    console.log("onActivityDelete()");

    // Check if any chcklistItems have the activity . If so then
    // confirm before deleting.
    this.db.collection("checklistItems", ref => ref.where("activity.id", "==", this.activity.id))
    .get()
    .toPromise()
    .then(data => {
      let deleteConfirmed = true;
      console.log("onActivityDelete data", data);
      if (data.docs.length != 0) {
        deleteConfirmed =
         confirm("Checklist Items were found that are assigned to this activity." +
         " If you delete this activity you may want to update the checklist items impacted." +
         " The checklist items will continue to work with the old activity information until updated." +
         " Are you sure you want to delete this activity code");
        
      }
      console.log("onActivityDelete deleteConfirmed", deleteConfirmed);
    
    
    })



  }

  ngOnDestroy() {
    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
    }
  }
}
