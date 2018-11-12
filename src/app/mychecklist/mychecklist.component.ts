import { Component, OnInit } from "@angular/core";
import { ClapiService } from "../services/clapi.service";

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

  clapiData: any;

  constructor(private clapi: ClapiService) { }

  ngOnInit() {
    this.showMyChecklists();
  }



  showMyChecklists() {
    this.clapi.getMyChecklists('')
      .subscribe(
        (data: any) => {
          this.clapiData = data;
          console.log("clapi data:", this.clapiData);
        },
        error => console.log("clapi error:", error)
      );

  }
}
