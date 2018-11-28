import { AngularFirestoreModule } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { FirebaseStorage } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore'

@Component({
  selector: 'app-mychecklists',
  templateUrl: './mychecklists.component.html',
  styleUrls: ['./mychecklists.component.css']
})
export class MychecklistsComponent implements OnInit {

  constructor(private db: AngularFirestore) { }

  ngOnInit() {
    this.db.collection("/checklists").get().subscribe(data => console.log("Chacklists data", data));
    //this.db.list("/checklists").valueChanges   

  }

}
