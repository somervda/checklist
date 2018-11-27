import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase} from '@angular/fire/database'

@Component({
  selector: 'app-mychecklists',
  templateUrl: './mychecklists.component.html',
  styleUrls: ['./mychecklists.component.css']
})
export class MychecklistsComponent implements OnInit {

  constructor( private db: AngularFireDatabase) { }

  ngOnInit() {
    this.db.list("/checklists").valueChanges   
    .then()
  }

}
