import { AuthService } from "./../services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit, NgZone, OnDestroy, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AngularFirestore } from "@angular/fire/firestore";

import { CommunityModel } from "../models/communityModel";
import { NgForm } from "@angular/forms";
import { AuditlogService } from "../services/auditlog.service";

@Component({
  selector: "app-communitydesigner",
  templateUrl: "./communitydesigner.component.html",
  styleUrls: ["./communitydesigner.component.scss"]
})
export class CommunitydesignerComponent implements OnInit, OnDestroy {
  community$;
  id;
  action;
  community = new CommunityModel();
  communitySubscription;
  isValidForm: boolean;
  formSubscription;

  @ViewChild(NgForm) frmMain: NgForm;

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
    });

    this.route.paramMap.subscribe(paramMap => {
      this.action = paramMap.get("action");
      this.id = paramMap.get("id");
      if (this.action == "U" && this.id) {
        // Only set up loading from firebase if in Add mode
        this.community$ = this.db
          .doc("/communities/" + this.id)
          .snapshotChanges();
        this.communitySubscription = this.community$.subscribe(snapshot => {
          console.log("Community Designer subscribed snapshot", snapshot);
          this.community = new CommunityModel(snapshot.payload);
        });
      }
    });
  }

  onAddClick() {
    this.community.status = "active";
    console.log("Add a new community", this.community);
    // Add a new document with a generated id. Note, need to cast to generic object
    this.db
      .collection("communities")
      .add(this.community.json)
      .then(docRef => {
        this.als.logUpdate(
          docRef.id,
          "communities",
          "ADD",
          this.community.json
        );
        //console.log("Document written with ID: ", docRef.id);
        this.toastr.success("DocRef: " + docRef.id, "Community Created", {
          timeOut: 3000
        });
        this.ngZone.run(() =>
          this.router.navigate(["/communitydesigner/U/" + docRef.id])
        );
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
  }

  onNameUpdate() {
    this.community.dbFieldUpdate(
      this.id,
      "name",
      this.community.name,
      this.db,
      this.als
    );
  }

  onDescriptionUpdate() {
    console.log("onDescriptionUpdate", this.community.description);
    this.community.dbFieldUpdate(
      this.id,
      "description",
      this.community.description,
      this.db,
      this.als
    );
  }

  onReturnCommunityClick() {
    this.router.navigate(["/community/" + this.id]);
  }

  ngOnDestroy() {
    if (this.communitySubscription) this.communitySubscription.unsubscribe();

    if (this.formSubscription) this.formSubscription.unsubscribe();
  }
}
