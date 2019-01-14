import { Component, OnInit, NgZone, ViewChild, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../services/auth.service";
import { AuditlogService } from "../services/auditlog.service";
import { NgForm } from "@angular/forms";
import { CategoryModel } from "../models/categoryModel";
import { ThemeModel } from "../models/themeModel";

@Component({
  selector: "app-categorydesigner",
  templateUrl: "./categorydesigner.component.html",
  styleUrls: ["./categorydesigner.component.scss"]
})
export class CategorydesignerComponent implements OnInit, OnDestroy {
  category$;
  id;
  action;
  category = new CategoryModel();
  categorySubscription;
  isValidForm: boolean;
  formSubscription;

  theme = new ThemeModel();
  themeSubscription;
  theme$;

  @ViewChild(NgForm) frmMain: NgForm;

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
        this.category$ = this.db
          .doc("/categories/" + this.id)
          .snapshotChanges();
        this.categorySubscription = this.category$.subscribe(snapshot => {
          console.log("Category Designer subscribed snapshot", snapshot);
          this.category = new CategoryModel(snapshot.payload);
          this.theme.name = this.category.theme.name;
          this.theme.id = this.category.theme.themeId;
        });
      }
      if (this.action == "A" && this.id) {
        // Load theme info if new category, themeId is in url
        this.theme$ = this.db.doc("/themes/" + this.id).snapshotChanges();
        this.themeSubscription = this.theme$.subscribe(snapshot => {
          this.theme = new ThemeModel(snapshot.payload);
          console.log("Category Designer subscribed theme: ", this.theme);
        });
      }
    });
  }

  onAddClick() {
    this.category.theme = { themeId: this.theme.id, name: this.theme.name };
    console.log("Add a new category", this.category);
    // Add a new document with a generated id. Note, need to cast to generic object
    this.db
      .collection("categories")
      .add(this.category.json)
      .then(docRef => {
        this.als.logUpdate(docRef.id, "categories", "ADD", this.category.json);
        console.log("Document written with ID: ", docRef.id);
        this.toastr.success("DocRef: " + docRef.id, "Category Created", {
          timeOut: 3000
        });
        this.ngZone.run(() =>
          this.router.navigate(["/categorydesigner/U/" + docRef.id])
        );
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
  }

  onNameUpdate() {
    this.category.dbFieldUpdate(
      this.id,
      "name",
      this.category.name,
      this.db,
      this.als
    );
  }

  onDescriptionUpdate() {
    this.category.dbFieldUpdate(
      this.id,
      "description",
      this.category.description,
      this.db,
      this.als
    );
  }

  onReturnCategoryClick() {}

  ngOnDestroy() {
    if (this.formSubscription) this.formSubscription.unsubscribe();
    if (this.categorySubscription) this.categorySubscription.unsubscribe();
  }
}
