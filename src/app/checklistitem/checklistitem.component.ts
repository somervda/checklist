import { Component, OnInit, Input } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: "app-checklistitem",
  templateUrl: "./checklistitem.component.html",
  styleUrls: ["./checklistitem.component.css"]
})
export class ChecklistitemComponent implements OnInit {
  @Input() id: string;
  checklistItem$;
  checked = true;
  constructor(private db: AngularFirestore) {}

  ngOnInit() {
    this.checklistItem$ = this.db.doc("/checklistItems/" + this.id).get();
    this.checklistItem$.subscribe(data => (this.checked = data.data().value));
  }

  onClick(event) {
    console.log("Checked:", this.checked);
  }
}
