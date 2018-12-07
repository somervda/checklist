import { AuthService } from "./../services/auth.service";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AngularFirestore } from "@angular/fire/firestore";

import { ChecklistModel, ChecklistStatus } from "../models/checklistModel";

@Component({
  selector: "app-checklistdesigner",
  templateUrl: "./checklistdesigner.component.html",
  styleUrls: ["./checklistdesigner.component.css"]
})
export class ChecklistdesignerComponent implements OnInit {
  checklist$;
  id; // id is used to indicate if this will be in add mode or update mode
  checklist = new ChecklistModel();

  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private toastr: ToastrService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get("id");
      if (this.id) {
        // Only set up loading from firebase if not in Add mode
        this.checklist$ = this.db
          .doc("/checklists/" + this.id)
          .snapshotChanges();
        this.checklist$.subscribe(doc => {
          console.log("Checklist Designer subscribed doc", doc);
          this.checklist.title = doc.payload.data().title;
          this.checklist.id = doc.id;
        });
      }

      console.log(this.checklist);
    });
  }

  onAddClick() {
    // Create a new checklist using form data (and no field validation errors)
    // then get the new id and route back to designer in modify mode (Has id)
    this.checklist.owner = this.auth.getUserEmail;
    this.checklist.dateCreated = new Date();
    console.log("Add a new checklist", this.checklist);
    // Add a new document with a generated id. Note, need to cast to generic object
    this.db
      .collection("checklists")
      .add(JSON.parse(JSON.stringify(this.checklist)))
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        this.toastr.success("DocRef: ",
         "Checklist created",
         {
          timeOut: 2000
        });
        this.ngZone.run(() => this.router.navigate(["/checklistdesigner/" + docRef.id]));

      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
  }
}
