import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";

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
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.action = paramMap.get("action");
      this.id = paramMap.get("id");
    });
  }

  onAddClick() {}
}
