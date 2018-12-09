import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-checklistitemdesigner",
  templateUrl: "./checklistitemdesigner.component.html",
  styleUrls: ["./checklistitemdesigner.component.css"]
})
export class ChecklistitemdesignerComponent implements OnInit {
  id;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get("id");
    });
  }

  onAddClick() {}
}
