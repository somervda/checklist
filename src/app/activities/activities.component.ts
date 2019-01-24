import { ActivityModel, ActivityParentType } from "./../models/activityModel";
import { Component, OnInit, Input, Output, OnDestroy } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/internal/operators/map";

@Component({
  selector: "app-activities",
  templateUrl: "./activities.component.html",
  styleUrls: ["./activities.component.scss"]
})
export class ActivitiesComponent implements OnInit, OnDestroy {
  @Input() parentType: ActivityParentType;
  @Input() parentId: string;
  @Input() editMode: boolean;
  // @Output() categoryAction = new EventEmitter();

  activities$;
  activitiesubscription;
  activities;

  constructor(public auth: AuthService, private db: AngularFirestore) {}

  ngOnInit() {
    this.activities$ = this.db
      .collection("activities", ref =>
        ref
          .where("parentType", "==", this.parentType)
          .where("parentId", "==", this.parentId)
      )
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(action => {
            const activity: ActivityModel = new ActivityModel(
              action.payload.doc
            );
            return activity;
          });
        })
      );
    this.activitiesubscription = this.activities$.subscribe(
      results => (this.activities = results)
    );
  }

  onNewActivity() {
    console.log("onNewActivity");
    // Add a dummy activity to activities 
    // the activity processing will take care of
    // adding or updating it based on the id (blank indicates it needs adding)
    this.activities.push(new ActivityModel());
  }

  ngOnDestroy() {
    if (this.activitiesubscription) {
      this.activitiesubscription.unsubscribe();
    }
  }
}
