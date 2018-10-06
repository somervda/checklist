import { Component, OnInit } from "@angular/core";

@Component({
  selector: "footerbar",
  templateUrl: "./footerbar.component.html",
  styleUrls: ["./footerbar.component.css"]
})
export class FooterbarComponent implements OnInit {
  year: number;
  constructor() { }

  ngOnInit() {
    this.year = new Date().getFullYear();
  }
}
