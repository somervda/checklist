import { AuditlogService } from "./../services/auditlog.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit, NgZone, OnDestroy, ViewChild } from "@angular/core";
import {
  ChecklistItemModel,
  ChecklistItemStatus,
  ChecklistItemResultType,
  ChecklistItemResult
} from "../models/checklistItemModel";
import { AngularFirestore } from "@angular/fire/firestore";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../services/auth.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-checklistitemdesigner",
  templateUrl: "./checklistitemdesigner.component.html",
  styleUrls: ["./checklistitemdesigner.component.scss"]
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
  isValidForm: boolean;
  formSubscription;

  @ViewChild(NgForm) frmMain: NgForm;

  descriptionEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "auto",
    minHeight: "70px",
    width: "auto",
    minWidth: "0",
    translate: "yes",
    enableToolbar: true,
    showToolbar: true,
    placeholder: "Enter text here...",
    imageEndPoint: "",
    toolbar: [
      ["bold", "italic", "underline"],
      ["horizontalLine", "orderedList", "unorderedList"],
      ["undo"]
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private toastr: ToastrService,
    private router: Router,
    private auth: AuthService,
    private ngZone: NgZone,
    private als: AuditlogService
  ) {}

  ngOnInit() {
    // Subscribe to form to get the validation state
    this.formSubscription = this.frmMain.statusChanges.subscribe(result => {
      this.isValidForm = result == "VALID";
      //console.log("state", this.isValidForm);
    });

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
            this.checklistItem = new ChecklistItemModel(snapshot.payload);
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
    this.checklistItem.owner.uid = this.auth.getUserUID;
    this.checklistItem.owner.displayName = this.auth.getUserDisplayname;
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
      this.checklistItem.result = ChecklistItemResult.medium;

    console.log(
      "Add a new checklistItem",
      this.checklistItem,
      this.checklistItem.json
    );

    // Add a new document with a generated id. Note, need to cast to generic object
    this.db
      .collection("checklistItems")
      .add(this.checklistItem.json)
      .then(docRef => {
        this.als.logUpdate(
          docRef.id,
          "checklistItems",
          "ADD",
          this.checklistItem.json
        );
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
      this.db,
      this.als
    );
  }
  onDescriptionUpdate() {
    this.checklistItem.dbFieldUpdate(
      this.id,
      "description",
      this.checklistItem.description,
      this.db,
      this.als
    );
  }

  onResultTypeUpdate() {
    this.checklistItem.dbFieldUpdate(
      this.id,
      "resultType",
      this.checklistItem.resultType,
      this.db,
      this.als
    );
  }

  onReturnChecklistDesignerClick() {
    this.router.navigate([
      "/checklistdesigner/U/" + this.checklistItem.checklistId
    ]);
  }

  ngOnDestroy() {
    // Incase there is no use of async in the html template , then need to clean up the subscription

    console.log(
      "checklistitem designer ngOnDestroy",
      this.checklistItemSubscription
    );
    if (this.checklistItemSubscription)
      this.checklistItemSubscription.unsubscribe();

    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }
}
