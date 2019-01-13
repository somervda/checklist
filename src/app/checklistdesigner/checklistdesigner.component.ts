import { AuthService } from "./../services/auth.service";

import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit, NgZone, ViewChild, OnDestroy } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AngularFirestore } from "@angular/fire/firestore";

import { ChecklistModel, ChecklistStatus } from "../models/checklistModel";
import { NgForm } from "@angular/forms";
import { AuditlogService } from "../services/auditlog.service";

@Component({
  selector: "app-checklistdesigner",
  templateUrl: "./checklistdesigner.component.html",
  styleUrls: ["./checklistdesigner.component.scss"]
})
export class ChecklistdesignerComponent implements OnInit, OnDestroy {
  checklist$;
  id;
  action;
  checklist = new ChecklistModel();
  checklistitems;
  model: { year: number; month: number; day: number };
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
        this.checklist$ = this.db
          .doc("/checklists/" + this.id)
          .snapshotChanges();
        this.checklist$.subscribe(doc => {
          console.log("Checklist Designer subscribed doc", doc);
          this.checklist = new ChecklistModel(doc.payload);
          if (this.checklist.dateTargeted != null)
            this.model = {
              year: this.checklist.dateTargeted.getFullYear(),
              month: this.checklist.dateTargeted.getMonth() + 1,
              day: this.checklist.dateTargeted.getDate()
            };
        });

        // Get a list of checklist items
        if (this.action == "U") {
          this.db
            .collection("checklistItems", ref =>
              ref.where("checklistId", "==", this.id)
            )
            .get()
            .toPromise()
            .then(snapshot => {
              this.checklistitems = snapshot.docs;
              // console.log("getter", this.checklistitems);
            })
            .catch(error => {
              this.toastr.error(error.message, "Failed to get checkbox items", {
                timeOut: 5000
              });
            });
        }
      }
    });
  }

  onAddClick() {
    // Create a new checklist using form data (and no field validation errors)
    // then get the new id and route back to designer in modify mode (Has id)
    let displayName: string = this.auth.getUserEmail;
    if (this.auth.getUserDisplayname) {
      displayName = this.auth.getUserDisplayname;
    }
    console.log("Add new checklist uid", this.auth.getUserUID);
    this.checklist.owner.uid = this.auth.getUserUID;
    this.checklist.owner.displayName = displayName;

    this.checklist.community.communityId = "";
    this.checklist.community.name = "";

    this.checklist.dateCreated = new Date(); // Be better to use the server datetime

    this.checklist.status = ChecklistStatus.Active;

    console.log("Add a new checklist", this.checklist, this.checklist.json);
    // Add a new document
    this.db
      .collection("checklists")
      .add(this.checklist.json)
      .then(docRef => {
        console.log("Document written with ID: ", docRef.id);
        this.als.logUpdate(docRef.id, "checklists", "ADD", this.checklist.json);
        this.toastr.success("DocRef: " + docRef.id, "Checklist Created", {
          timeOut: 3000
        });
        this.ngZone.run(() =>
          this.router.navigate(["/checklistdesigner/U/" + docRef.id])
        );
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
  }

  onTitleUpdate() {
    this.checklist.dbFieldUpdate(
      this.id,
      "title",
      this.checklist.title,
      this.db,
      this.als
    );
  }
  onDescriptionUpdate() {
    this.checklist.dbFieldUpdate(
      this.id,
      "description",
      this.checklist.description,
      this.db,
      this.als
    );
  }

  onTargetDateUpdate() {
    //console.log("onTargetDateUpdate model:", this.model);
    let modelDate = this.modelAsDate();
    console.log("modelDate:", modelDate);
    if (modelDate === undefined)
      this.checklist.dbFieldUpdate(
        this.id,
        "dateTargeted",
        {},
        this.db,
        this.als
      );
    else
      this.checklist.dbFieldUpdate(
        this.id,
        "dateTargeted",
        modelDate,
        this.db,
        this.als
      );
  }

  modelAsDate(): Date {
    if (this.model && this.model.year && this.model.month && this.model.day) {
      let modelDate = new Date(
        this.model.year,
        this.model.month - 1,
        this.model.day,
        0,
        0,
        0
      );
      return modelDate;
    }
    return undefined;
  }

  onReturnToChecklistClick() {
    this.router.navigate(["/checklist/" + this.id]);
  }

  onItemAddClick() {
    this.router.navigate(["/checklistitemdesigner/A/" + this.id]);
  }

  ngOnDestroy() {
    if (this.formSubscription) this.formSubscription.unsubscribe();
  }
}
