import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable, Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-checklistitem",
  templateUrl: "./checklistitem.component.html",
  styleUrls: ["./checklistitem.component.css"]
})
export class ChecklistitemComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() index: number;
  checklistItem$;
  checklistItemSubscribe: Subscription;
  checked = true;
  constructor(private db: AngularFirestore, private toastr: ToastrService) {}

  ngOnInit() {
    // Get observable of changes to the checklistsitem so real time changes are actioned
    this.checklistItem$ = this.db
      .doc("/checklistItems/" + this.id)
      .snapshotChanges();
    // Also subscribe to observable to keep check local value
    // (not sure how to do this more elegantly) up to date.
    this.checklistItem$.subscribe(snapshot => {
      this.checked = snapshot.payload.data().value;
      // console.log("subscribe to checklistsitem$", snapshot);
    });
    //console.log("Oninit subscribed", this.checklistItemSubscribe);
  }

  onClick() {
    // console.log("Checked:", !this.checked);
    this.db
      .doc("/checklistItems/" + this.id)
      .update({ value: !this.checked })
      .then(() => {
        // console.log("Checked Update successfully");
      })
      .catch(error => {
        this.toastr.error(error.message, "Checkbox update failed", {
          timeOut: 5000
        });
        // Reset check box
        this.checked = !this.checked;
      });
  }

  ngOnDestroy() {
    // Looks like the subscription already gets cleaned up because it is associated with
    // the async observable. Code below was so I could confirm that the
    // checklistItemSubscribe subscription is cleaned up
    // console.log("unsubscribe before", this.checklistItemSubscribe);
    // this.checklistItemSubscribe.unsubscribe();
    // console.log("unsubscribe after", this.checklistItemSubscribe);
  }
}
