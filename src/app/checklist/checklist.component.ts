import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: "app-checklist",
  templateUrl: "./checklist.component.html",
  styleUrls: ["./checklist.component.css"]
})
export class ChecklistComponent implements OnInit {
  checklist$;
  checklistItems$;

  constructor(private route: ActivatedRoute, private db: AngularFirestore) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      var id = paramMap.get("id");
      this.checklist$ = this.db.doc("/checklists/" + id).get();

      // Get checklistItems
      this.checklistItems$ = this.db
        .collection("checklistItems", ref => ref.where("checklistId", "==", id))
        .snapshotChanges();
      this.checklistItems$.subscribe(snap => console.log(snap));
    });
  }
}
