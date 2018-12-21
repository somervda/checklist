import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  @Input() name: string;
  @Input() rightButtonRoute: string;
  @Input() rightButtonTooltip: string;
  @Input() rightButtonIconClass: string;
  @Input() rightButtonShow: boolean = true;

  constructor() {}

  ngOnInit() {}
}
