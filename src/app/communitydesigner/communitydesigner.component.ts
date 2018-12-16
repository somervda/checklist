import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-communitydesigner",
  templateUrl: "./communitydesigner.component.html",
  styleUrls: ["./communitydesigner.component.css"]
})
export class CommunitydesignerComponent implements OnInit {
  checklist$;
  id;
  action;
  checklist = new CommunityModel();

  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private toastr: ToastrService,
    private router: Router,
    private auth: AuthService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.action = paramMap.get("action");
      this.id = paramMap.get("id");
      if (this.action == "U" && this.id) {
        // Only set up loading from firebase if in Add mode
        this.checklist$ = this.db
          .doc("/checklists/" + this.id)
          .snapshotChanges();
        this.checklist$.subscribe(doc => {
          console.log("Checklist Designer subscribed doc", doc);
          this.checklist.loadFromObject(doc.payload.data(), doc.id);
        });

        // Get a list of checklist items
        if (this.action == "U") {
          this.db
            .collection("checklistItems", ref =>
              ref.where("checklistId", "==", this.id)
            )
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
        }
      }

      console.log(this.checklist);
    });
  }

  onAddClick() {
    // Create a new checklist using form data (and no field validation errors)
    // then get the new id and route back to designer in modify mode (Has id)
    this.checklist.owner = this.auth.getUserEmail;
    this.checklist.dateCreated = new Date();
    this.checklist.status = ChecklistStatus.Active;
    console.log("Add a new checklist", this.checklist);
    // Add a new document with a generated id. Note, need to cast to generic object
    this.db
      .collection("checklists")
      .add(JSON.parse(JSON.stringify(this.checklist)))
      .then(docRef => {
        console.log("Document written with ID: ", docRef.id);
        this.toastr.success("DocRef: " + docRef.id, "Checklist Created", {
          timeOut: 3000
        });
        this.ngZone.run(() =>
          this.router.navigate(["/checklistdesigner/U/" + docRef.id])
        );
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
  }

  onNameUpdate() {
    this.checklist.dbFieldUpdate(
      this.id,
      "title",
      this.checklist.title,
      this.db
    );
  }
  onDescriptionUpdate() {
    this.checklist.dbFieldUpdate(
      this.id,
      "description",
      this.checklist.description,
      this.db
    );
  }

  onItemAddClick() {
    this.router.navigate(["/checklistitemdesigner/A/" + this.id]);
  }
}
