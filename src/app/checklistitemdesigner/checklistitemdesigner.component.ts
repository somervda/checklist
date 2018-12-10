import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit, NgZone } from "@angular/core";
import { ChecklistItemModel } from "../models/checklistItemModel";
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

  onAddClick() {}
}
