import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-checklist",
  templateUrl: "./checklist.component.html",
  styleUrls: ["./checklist.component.css"]
})
export class ChecklistComponent implements OnInit {
  checklist$;
  //checklistItems$;
  checklistitems;

  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      var id = paramMap.get("id");
      this.checklist$ = this.db.doc("/checklists/" + id).get();

      // Get checklistItems
      // this.checklistItems$ = this.db
      //   .collection("checklistItems", ref => ref.where("checklistId", "==", id))
      //   .snapshotChanges();
      //this.checklistItems$.subscribe(snap => console.log(snap));

      // Changed to using a lists so list of checklistitems is only retrieved once
      // when first entering the component. Checklistsitem updates will still be handled in
      // the checklistsitem component in real time, but lists of checklistitems
      // will not be refreshed each time back end changes occur (i.e. adding or deleting an item)
      this.db
        .collection("checklistItems", ref => ref.where("checklistId", "==", id))
        .get()
        .toPromise()
        .then(snapshot => {
          this.checklistitems = snapshot.docs;
          // console.log("getter", this.checklistitems);
        })
        .catch(error => {
          this.toastr.error(error.message, "Failed to get checkbox items", {
            timeOut: 5000
          });
        });
    });
  }
}
