import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  @Input() name: string;
  @Input() rightButtonTooltip: string;
  @Input() rightButtonIconClass: string;
  @Input() rightButtonShow: boolean = true;
  @Input() rightButtonDisabled: boolean = false;
  @Input() rightButtonText:string = "";
  @Output() rightButtonClick = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onRightButtonClick() {
    this.rightButtonClick.emit();
  }
}
