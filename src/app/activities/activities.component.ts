import { ActivityModel } from "./../models/activityModel";
import { Component, OnInit, Input, Output, OnDestroy } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuditlogService } from "../services/auditlog.service";
import { ToastrService } from "ngx-toastr";
import { map } from "rxjs/internal/operators/map";

@Component({
  selector: "app-activities",
  templateUrl: "./activities.component.html",
  styleUrls: ["./activities.component.scss"]
})
export class ActivitiesComponent implements OnInit, OnDestroy {
  @Input() communityId: string;
  @Input() categoryId: string;
  @Input() allowUpdates: boolean;
  // @Output() categoryAction = new EventEmitter();

  activities$;
  activitiesubscription;
  activities;

  constructor(
    public auth: AuthService,
    private db: AngularFirestore,
    private als: AuditlogService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.activities$ = this.db
      .collection("activities", ref =>
        ref.where("categoryId", "==", this.categoryId)
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

  ngOnDestroy() {
    if (this.activitiesubscription) {
      this.activitiesubscription.unsubscribe();
    }
  }
}
