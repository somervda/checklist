import { Component, OnInit } from "@angular/core";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  // Note: use of backticks or template-literals
  images = [1, 2, 3].map(
    () => `https://picsum.photos/900/500?random&t=${Math.random()}`
  );

  constructor() {}

  ngOnInit() {}
}
