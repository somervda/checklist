import { AuthService } from "./../services/auth.service";
import {
  ChecklistItemModel,
  ChecklistItemResultType,
  ChecklistItemResult
} from "./../models/checklistItemModel";
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
  checklistItem = new ChecklistItemModel();
  ChecklistItemResult = ChecklistItemResult;
  ChecklistItemResultType = ChecklistItemResultType;
  dropdownOpen: boolean = false;

  constructor(
    private db: AngularFirestore,
    private toastr: ToastrService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    // Get observable of changes to the checklistsitem so real time changes are actioned
    this.checklistItem$ = this.db
      .doc("/checklistItems/" + this.id)
      .snapshotChanges();
    // Also subscribe to observable to keep check local value
    // (not sure how to do this more elegantly) up to date.
    this.checklistItem$.subscribe(snapshot => {
      this.checklistItem.loadFromObject(snapshot.payload.data(), snapshot.id);
    });
  }

  onClick() {
    let resultValue;
    if (this.checklistItem.isChecked) {
      resultValue = ChecklistItemResult.false;
    } else {
      resultValue = ChecklistItemResult.true;
    }

    this.checklistItem.dbFieldUpdate(this.id, "result", resultValue, this.db);
  }

  onUserCommentUpdate() {
    this.checklistItem.dbFieldUpdate(
      this.id,
      "userComment",
      this.checklistItem.userComment,
      this.db
    );
  }

  onNAUpdate() {
    this.checklistItem.dbFieldUpdate(
      this.id,
      "isNA",
      this.checklistItem.isNA,
      this.db
    );
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
