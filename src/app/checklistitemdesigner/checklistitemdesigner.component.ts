import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit, NgZone, OnDestroy } from "@angular/core";
import {
  ChecklistItemModel,
  ChecklistItemStatus,
  ChecklistItemResultType,
  ChecklistItemResult
} from "../models/checklistItemModel";
import { AngularFirestore } from "@angular/fire/firestore";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-checklistitemdesigner",
  templateUrl: "./checklistitemdesigner.component.html",
  styleUrls: ["./checklistitemdesigner.component.css"]
})
export class ChecklistitemdesignerComponent implements OnInit, OnDestroy {
  // id is the checklist id when action = A
  // id is the checklistitem id when action = U
  id;
  action;
  checklistItem = new ChecklistItemModel();
  checklistItem$;
  checklistItemSubscription;
  ChecklistItemResultType = ChecklistItemResultType;

  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private toastr: ToastrService,
    private router: Router,
    private auth: AuthService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.action = paramMap.get("action");
      this.id = paramMap.get("id");

      if (this.action == "U" && this.id) {
        // Only set up loading from firebase if in Add mode
        this.checklistItem$ = this.db
          .doc("/checklistItems/" + this.id)
          .snapshotChanges();
        this.checklistItemSubscription = this.checklistItem$.subscribe(
          snapshot => {
            console.log("checklistItemDesigner ngOnInit subscribe");
            this.checklistItem.loadFromObject(
              snapshot.payload.data(),
              snapshot.id
            );
          }
        );
      }
      if (this.action == "A") {
        // Set default for an add
        this.checklistItem.resultType = ChecklistItemResultType.checkbox;
      }
    });
  }

  onAddClick() {
    // Create a new checklistitem using form data (and no field validation errors)
    // then get the new id and route back to designer in modify mode (Has id)
    this.checklistItem.owner = this.auth.getUserEmail;
    this.checklistItem.dateCreated = new Date();
    this.checklistItem.status = ChecklistItemStatus.Active;
    this.checklistItem.checklistId = this.id;
    // Set default result settings
    if (
      this.checklistItem.resultType == ChecklistItemResultType.checkbox ||
      this.checklistItem.resultType == ChecklistItemResultType.checkboxNA
    )
      this.checklistItem.result = ChecklistItemResult.false;
    if (
      this.checklistItem.resultType == ChecklistItemResultType.rating ||
      this.checklistItem.resultType == ChecklistItemResultType.ratingNA
    )
      this.checklistItem.result = ChecklistItemResult.low;

    console.log("Add a new checklistItem", this.checklistItem);

    // Add a new document with a generated id. Note, need to cast to generic object
    this.db
      .collection("checklistItems")
      .add(JSON.parse(JSON.stringify(this.checklistItem)))
      .then(docRef => {
        console.log("ChecklistItem written with ID: ", docRef.id);
        this.toastr.success("", "ChecklistItem Created", {
          timeOut: 1000
        });
        this.ngZone.run(() =>
          this.router.navigate(["/checklistitemdesigner/U/" + docRef.id])
        );
      })
      .catch(function(error) {
        console.error("Error adding checklistItem: ", error);
      });
  }

  onPromptUpdate() {
    this.checklistItem.dbFieldUpdate(
      this.id,
      "prompt",
      this.checklistItem.prompt,
      this.db
    );
  }
  onDescriptionUpdate() {
    this.checklistItem.dbFieldUpdate(
      this.id,
      "description",
      this.checklistItem.description,
      this.db
    );
  }

  onResultTypeUpdate() {
    this.checklistItem.dbFieldUpdate(
      this.id,
      "resultType",
      this.checklistItem.resultType,
      this.db
    );
  }

  ngOnDestroy() {
    // Incase there is no use of async in the html template , then need to clean up the subscription

    console.log(
      "checklistitem designer ngOnDestroy",
      this.checklistItemSubscription
    );
    if (this.checklistItemSubscription)
      this.checklistItemSubscription.unsubscribe();
  }
}
