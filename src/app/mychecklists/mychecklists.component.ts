import { AngularFirestoreModule } from "@angular/fire/firestore";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FirebaseStorage } from "@angular/fire";
import { AngularFirestore } from "@angular/fire/firestore";
import { Subscription } from "rxjs";

@Component({
  selector: "app-mychecklists",
  templateUrl: "./mychecklists.component.html",
  styleUrls: ["./mychecklists.component.css"]
})
export class MychecklistsComponent implements OnInit, OnDestroy {
  checklists = [];
  checklistSubscription: Subscription;

  constructor(private db: AngularFirestore) {}

  ngOnInit() {
    // See https://www.udemy.com/the-complete-angular-master-class/learn/v4/t/lecture/7673810?start=0
    this.checklistSubscription = this.db
      .collection("/checklists")
      .snapshotChanges()
      .subscribe(snapshot => {
        this.checklists = snapshot;
        console.log("Checklists docs", snapshot);
      });
    //this.db.list("/checklists").valueChanges
  }

  ngOnDestroy() {
    this.checklistSubscription.unsubscribe();
  }
}
