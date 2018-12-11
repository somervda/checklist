import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit, NgZone } from "@angular/core";
import {
  ChecklistItemModel,
  ChecklistItemStatus
} from "../models/checklistItemModel";
import { AngularFirestore } from "@angular/fire/firestore";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-checklistitemdesigner",
  templateUrl: "./checklistitemdesigner.component.html",
  styleUrls: ["./checklistitemdesigner.component.css"]
})
export class ChecklistitemdesignerComponent implements OnInit {
  // id is the checklist id when action = A
  // id is the checklistitem id when action = U
  id;
  action;
  checklistItem = new ChecklistItemModel();
  checklistItem$;

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
        this.checklistItem$.subscribe(doc => {
          console.log("ChecklistItem Designer subscribed doc", doc.payload);
          this.checklistItem.prompt = doc.payload.data().prompt;
          this.checklistItem.id = doc.payload.id;
          this.checklistItem.checklistId = doc.payload.data().checklistId;
          this.checklistItem.description = doc.payload.data().description;
          console.log(
            "ChecklistItem Designer subscribed checklistItem",
            this.checklistItem
          );
        });
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
    console.log("Add a new checklistItem", this.checklistItem);
    // Add a new document with a generated id. Note, need to cast to generic object
    this.db
      .collection("checklistItems")
      .add(JSON.parse(JSON.stringify(this.checklistItem)))
      .then(docRef => {
        console.log("ChecklistItem written with ID: ", docRef.id);
        this.toastr.success("DocRef: " + docRef.id, "ChecklistItem Created", {
          timeOut: 3000
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
    console.log("onDescriptionUpdate", "/checklistItemItems/" + this.id);
    this.db
      .doc("/checklistItems/" + this.id)
      .update({ prompt: this.checklistItem.prompt })
      .then(data => console.log("prompt updated"))
      .catch(error => console.log("prompt updated error ", error));
  }
  onDescriptionUpdate() {
    console.log("onDescriptionUpdate", "/checklistItems/" + this.id);
    this.db
      .doc("/checklistItems/" + this.id)
      .update({ description: this.checklistItem.description })
      .then(data => console.log("description updated"))
      .catch(error => console.log("description updated error ", error));
  }
}
