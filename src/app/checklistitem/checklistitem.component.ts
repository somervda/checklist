import { Component, OnInit, Input } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: "app-checklistitem",
  templateUrl: "./checklistitem.component.html",
  styleUrls: ["./checklistitem.component.css"]
})
export class ChecklistitemComponent implements OnInit {
  @Input() id;
  checklistItem$;
  constructor(private db: AngularFirestore) {}

  ngOnInit() {
    this.checklistItem$ = this.db.doc("/checklistItems/" + this.id).get();
  }
}
