import { AuthService } from "./../services/auth.service";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit, NgZone, ViewChild, OnDestroy } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AngularFirestore } from "@angular/fire/firestore";

import { ChecklistModel, ChecklistStatus } from "../models/checklistModel";
import { NgForm } from "@angular/forms";

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
    private ngZone: NgZone
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
          this.checklist.loadFromObject(doc.payload);
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

    this.checklist.owner = {
      uid: this.auth.getUserUID,
      displayName: displayName
    };
    this.checklist.dateCreated = new Date();
    this.checklist.status = ChecklistStatus.Active;
    console.log("Add a new checklist", this.checklist);
    // Add a new document with a generated id. Note, need to cast to generic object
    this.db
      .collection("checklists")
      .add(JSON.parse(JSON.stringify(this.checklist)))
      .then(docRef => {
        console.log("Document written with ID: ", docRef.id);
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
      this.db
    );
  }
  onDescriptionUpdate() {
    this.checklist.dbFieldUpdate(
      this.id,
      "description",
      this.checklist.description,
      this.db
    );
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
