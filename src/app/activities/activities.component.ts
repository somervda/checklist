import { AuditlogService } from "./../services/auditlog.service";
import { AuditLogModel } from "./../models/auditLogModel";
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
  newActivity: ActivityModel;

  constructor(
    public auth: AuthService,
    private db: AngularFirestore,
    private als: AuditlogService
  ) {}

  ngOnInit() {
    console.log(
      "activities onInit parentId:",
      this.parentId,
      " parentType:",
      this.parentType
    );
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
    this.activitiesubscription = this.activities$.subscribe(results => {
      this.activities = results;
      console.log("activities ngOnInit subscribe");
    });

    this.newActivity = new ActivityModel();
  }

  onNewActivity() {
    console.log("onNewActivity");
    this.newActivity.parentType = this.parentType;
    this.newActivity.parentId = this.parentId;

    this.db
      .collection("activities")
      .add(this.newActivity.json)
      .then(docRef => {
        this.als.logUpdate(
          docRef.id,
          "activities",
          "ADD",
          this.newActivity.json
        );
        console.log("Document written with ID: ", docRef.id);
        this.newActivity = new ActivityModel();
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
  }

  ngOnDestroy() {
    if (this.activitiesubscription) {
      this.activitiesubscription.unsubscribe();
    }
  }
}
