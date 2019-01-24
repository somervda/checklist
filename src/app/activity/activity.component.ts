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
  }

  ngOnDestroy() {
    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
    }
  }
}
