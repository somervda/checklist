import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: "app-mychecklists",
  templateUrl: "./mychecklists.component.html",
  styleUrls: ["./mychecklists.component.css"]
})
export class MychecklistsComponent implements OnInit {
  checklists$;

  constructor(private db: AngularFirestore) {}

  ngOnInit() {
    // See https://www.udemy.com/the-complete-angular-master-class/learn/v4/t/lecture/7673810?start=0
    // Using observable and async to manage lifetime of subscription in sync with lifetime of the component
    this.checklists$ = this.db.collection("/checklists").snapshotChanges();
  }
}
