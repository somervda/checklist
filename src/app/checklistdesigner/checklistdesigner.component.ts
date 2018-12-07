import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AngularFirestore } from "@angular/fire/firestore";

import { ChecklistModel } from "../models/checklistModel";

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
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get("id");
      if (this.id)
        this.checklist$ = this.db.doc("/checklists/" + this.id).get();
      this.checklist.title = "xxx";
      this.checklist.template = {id: "", title: "" , description:""};
      this.checklist.template.description="xxx";
      console.log(this.checklist);
    });
  }

  onAddClick() {
    // Create a new checklist using form data (and no field validation errors)
    // then get the new id and route back to designer in modify mode (Has id)
    console.log("Add a new checklist");
  }
}
