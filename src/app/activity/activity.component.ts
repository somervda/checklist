import { ActivityModel } from "./../models/activityModel";
import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "../services/auth.service";
import { AuditlogService } from "../services/auditlog.service";

@Component({
  selector: "app-activity",
  templateUrl: "./activity.component.html",
  styleUrls: ["./activity.component.scss"]
})
export class ActivityComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() editMode: boolean;

  activity: ActivityModel;

  activitySubscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: AngularFirestore,
    public auth: AuthService,
    private als: AuditlogService
  ) {}

  ngOnInit() {
    this.activitySubscription = this.db
      .doc("activities/" + this.id)
      .snapshotChanges()
      .subscribe(action => {
        this.activity = new ActivityModel(action.payload);
        console.log("activity subscription", this.activity);
      });
  }

  onBackspace(event) {
    //console.log("onBackspace", this.activity.name.trim().length );
    if (this.activity.name.trim().length ==1) {
      //console.log("onBackspace dontpropagate" );
      return false;
    }
  }

  onDelete(event) {
    console.log("onDelete", event.target.selectionStart, event.target.selectionEnd,this.activity.name.trim().length  );
    if ((event.target.selectionEnd - event.target.selectionStart ) >=this.activity.name.trim().length) {
      console.log("onDelete dontpropagate" );
      return false;
    }
  }



  onNameUpdate() {
    console.log("onNameUpdate()",this.activity);
    if(this.activity.name.trim().length==0) {
      console.error("Activity name can not be blank");
    }
    else {
    this.activity.dbFieldUpdate(
      this.activity.id,
      "name",
      this.activity.name,
      this.db,
      this.als
    );
    }
  }

  onActivityDelete() {
    console.log("onActivityDelete()");

    // Check if any chcklistItems have the activity . If so then
    // confirm before deleting.
    this.db
      .collection("checklistItems", ref =>
        ref.where("activity.id", "==", this.activity.id)
      )
      .get()
      .toPromise()
      .then(data => {
        let deleteConfirmed = true;
        console.log("onActivityDelete data", data);
        if (data.docs.length != 0) {
          deleteConfirmed = confirm(
            "Checklist Items were found that are assigned to this activity." +
              " If you delete this activity you may want to update the checklist items impacted." +
              " The checklist items will continue to work with the old activity information until updated." +
              "\n\nAre you sure you want to delete this activity code?"
          );
        }
        console.log("onActivityDelete deleteConfirmed", deleteConfirmed);
        this.db
          .collection("activities")
          .doc(this.activity.id)
          .delete()
          .then(() => {
            this.als.logUpdate(this.activity.id, "activities", "DELETE", "");
            console.log("Document successfully deleted!");
          })
          .catch(error => {
            console.error("Error removing document: ", error);
          });
      });
  }

  ngOnDestroy() {
    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
    }
  }
}
