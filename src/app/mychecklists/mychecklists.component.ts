import { AngularFirestoreModule } from "@angular/fire/firestore";
import { Component, OnInit } from "@angular/core";
import { FirebaseStorage } from "@angular/fire";
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: "app-mychecklists",
  templateUrl: "./mychecklists.component.html",
  styleUrls: ["./mychecklists.component.css"]
})
export class MychecklistsComponent implements OnInit {
  checklists = [];

  constructor(private db: AngularFirestore) {}

  ngOnInit() {
    this.db
      .collection("/checklists")
      .get()
      .subscribe(snapshot => {
        this.checklists = snapshot.docs;
        console.log("Checklists docs", snapshot.docs);
      });
    //this.db.list("/checklists").valueChanges
  }
}
