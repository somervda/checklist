import { Component, OnInit, NgZone, ViewChild, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../services/auth.service";
import { NgForm } from "@angular/forms";
import { ThemeModel } from "../models/themeModel";
import { AuditlogService } from "../services/auditlog.service";

@Component({
  selector: "app-themedesigner",
  templateUrl: "./themedesigner.component.html",
  styleUrls: ["./themedesigner.component.scss"]
})
export class ThemedesignerComponent implements OnInit, OnDestroy {
  theme$;
  id;
  action;
  theme = new ThemeModel();
  themeSubscription;
  isValidForm: boolean;
  formSubscription;

  @ViewChild(NgForm) frmMain: NgForm;

  EditorConfig = {
    editable: true,
    spellcheck: true,
    height: "auto",
    minHeight: "100px",
    width: "auto",
    minWidth: "0",
    translate: "yes",
    enableToolbar: true,
    showToolbar: true,
    placeholder: "Enter text here...",
    imageEndPoint: "",
    toolbar: [
      ["bold", "italic", "underline"],
      ["horizontalLine", "orderedList", "unorderedList"],
      ["undo"]
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private toastr: ToastrService,
    private router: Router,
    private auth: AuthService,
    private ngZone: NgZone,
    private als: AuditlogService
  ) {}

  ngOnInit() {
    // Subscribe to form to get the validation state
    this.formSubscription = this.frmMain.statusChanges.subscribe(result => {
      this.isValidForm = result == "VALID";
    });

    this.route.paramMap.subscribe(paramMap => {
      this.action = paramMap.get("action");
      this.id = paramMap.get("id");
      if (this.action == "U" && this.id) {
        // Only set up loading from firebase if in Add mode
        this.theme$ = this.db.doc("/themes/" + this.id).snapshotChanges();
        this.themeSubscription = this.theme$.subscribe(snapshot => {
          console.log("Theme Designer subscribed snapshot", snapshot);
          this.theme = new ThemeModel(snapshot.payload);
        });
      }
    });
  }

  onAddClick() {
    console.log("Add a new theme", this.theme);
    // Add a new document with a generated id. Note, need to cast to generic object
    this.db
      .collection("themes")
      .add(this.theme.json)
      .then(docRef => {
        this.als.logUpdate(docRef.id,"themes","ADD",this.theme.json);
        console.log("Document written with ID: ", docRef.id);
        this.toastr.success("DocRef: " + docRef.id, "Theme Created", {
          timeOut: 3000
        });
        this.ngZone.run(() =>
          this.router.navigate(["/themedesigner/U/" + docRef.id])
        );
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
  }

  onNameUpdate() {
    this.theme.dbFieldUpdate(
      this.id,
      "name",
      this.theme.name,
      this.db,
      this.als
    );
  }

  onDescriptionUpdate() {
    console.log("onDescriptionUpdate", this.theme.description);
    this.theme.dbFieldUpdate(
      this.id,
      "description",
      this.theme.description,
      this.db,
      this.als
    );
  }

  onReturnThemeClick() {
    this.router.navigate(["/theme/" + this.id]);
  }

  ngOnDestroy() {
    if (this.themeSubscription) this.themeSubscription.unsubscribe();

    if (this.formSubscription) this.formSubscription.unsubscribe();
  }
}
