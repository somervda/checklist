import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AngularFirestore } from "@angular/fire/firestore";

import { Checklist } from "../models/checklist";

@Component({
  selector: "app-checklistdesigner",
  templateUrl: "./checklistdesigner.component.html",
  styleUrls: ["./checklistdesigner.component.css"]
})
export class ChecklistdesignerComponent implements OnInit {
  checklist$;
  id; // id is used to indicate if this will be in add mode or update mode
  model = new Checklist("", "");

  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get("id");
      if (this.id)
        this.checklist$ = this.db.doc("/checklists/" + this.id).get();
    });
  }

  onAddClick() {
    // Create a new checklist using form data (and no field validation errors)
    // then get the new id and route back to designer in modify mode (Has id)
    console.log("Add a new checklist");
  }
}
