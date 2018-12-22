// The native html checkbox was not working properly on
// safari and iOS , I think the browser must fire an extra click event when the ngModel updates
// (and reverses the update just made)

import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-checkbox",
  templateUrl: "./checkbox.component.html",
  styleUrls: ["./checkbox.component.css"],
  outputs: ["clickUnChecked", "clickChecked"]
})
export class CheckboxComponent implements OnInit {
  constructor() {}
  @Input() checked: boolean = false;
  @Output() clickUnChecked = new EventEmitter();
  @Output() clickChecked = new EventEmitter();

  ngOnInit() {}

  onClick(state: boolean) {
    if (state) this.clickUnChecked.emit();
    else this.clickChecked.emit();
  }

  
}
