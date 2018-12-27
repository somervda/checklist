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
import { checkAndUpdateDirectiveDynamic } from "@angular/core/src/view/provider";

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

  EditorConfig = {
    editable: true,
    spellcheck: true,
    height: "auto",
    minHeight: "70px",
    width: "auto",
    minWidth: "0",
    translate: "yes",
    enableToolbar: true,
    showToolbar: true,
    imageEndPoint: "",
    toolbar: [
      ["bold", "italic", "underline"],
      ["horizontalLine", "orderedList", "unorderedList"],
      ["undo"]
    ]
  };

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
      // this.toastr.info("", "init", {
      //   timeOut: 1000
      // });

      this.checklistItem.loadFromObject(snapshot.payload);
      console.log(
        "Checklistitem subscribe isNA:",
        this.checklistItem.isNA,
        " result:",
        this.checklistItem.result
      );
    });
  }

  onUserCommentUpdate() {
    this.checklistItem.dbFieldUpdate(
      this.id,
      "userComment",
      this.checklistItem.userComment,
      this.db
    );
  }

  onEvidenceUpdate() {
    this.checklistItem.dbFieldUpdate(
      this.id,
      "evidence",
      this.checklistItem.evidence,
      this.db
    );
  }

  onNAUpdate(checked: boolean) {
    let resultValue;
    if (checked) {
      resultValue = ChecklistItemResult.NA;
    } else {
      // Reset to default result based on result type
      if (
        this.checklistItem.resultType == ChecklistItemResultType.checkbox ||
        this.checklistItem.resultType == ChecklistItemResultType.checkboxNA
      ) {
        resultValue = ChecklistItemResult.false;
      } else {
        resultValue = ChecklistItemResult.medium;
      }
    }

    this.checklistItem.dbFieldUpdate(this.id, "result", resultValue, this.db);
  }

  onRatingUpdate() {
    console.log(
      "ChecklistItem onRatingUpdate",
      this.checklistItem.rating,
      " ",
      this.checklistItem.result
    );
    this.checklistItem.dbFieldUpdate(
      this.id,
      "result",
      this.checklistItem.result,
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

  oncbClick(checked: boolean) {
    if (checked)
      this.checklistItem.dbFieldUpdate(
        this.id,
        "result",
        ChecklistItemResult.false,
        this.db
      );
    else
      this.checklistItem.dbFieldUpdate(
        this.id,
        "result",
        ChecklistItemResult.true,
        this.db
      );
  }
}
