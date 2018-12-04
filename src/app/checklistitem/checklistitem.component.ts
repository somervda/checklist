import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable, Subscription } from "rxjs";

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
  constructor(private db: AngularFirestore) {}

  ngOnInit() {
    this.checklistItem$ = this.db.doc("/checklistItems/" + this.id).get();
    this.checklistItem$.subscribe(data => (this.checked = data.data().value));
    //console.log("Oninit subscribed", this.checklistItemSubscribe);
  }

  onClick() {
    console.log("Checked:", !this.checked);
  }

  ngOnDestroy() {
    // Looks like the subscription already gets cleaned up because it is associated with
    // the async observable
    /*     console.log("unsubscribe before", this.checklistItemSubscribe);
    this.checklistItemSubscribe.unsubscribe();
    console.log("unsubscribe after", this.checklistItemSubscribe); */
  }
}
