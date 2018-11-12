import { Component, OnInit } from "@angular/core";

@Component({
  selector: "mychecklist",
  templateUrl: "./mychecklist.component.html",
  styleUrls: ["./mychecklist.component.css"]
})
export class MychecklistComponent implements OnInit {
  rows = [
    { Title: "Boat launching", category: "Boat" },
    { Title: "Boat cleaning", category: "Boat" },
    { Title: "Vacation Packing", category: "Travel" },
    { Title: "Hotel selection", category: "Travel" },
    { Title: "RV preparation", category: "Travel" },
    { Title: "Software release", category: "IT" },
    { Title: "Clean House", category: "Home" },
    { Title: "Winterize house", category: "Home" },
    { Title: "Mow lawn", category: "Home" }
  ];
  columns = [{ prop: "Title" }, { name: "Category" }];

  constructor() {}

  ngOnInit() {}
}
