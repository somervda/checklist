import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { ThemeModel } from "../models/themeModel";
import { CategoryModel } from "../models/categoryModel";
import { map } from "rxjs/operators";

@Component({
  selector: "app-theme",
  templateUrl: "./theme.component.html",
  styleUrls: ["./theme.component.scss"]
})
export class ThemeComponent implements OnInit, OnDestroy {
  theme$;
  themeSubscription;
  theme: ThemeModel;

  categorySubscription;
  categories: [CategoryModel];
  categories$;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: AngularFirestore
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      var id = paramMap.get("id");
      this.theme$ = this.db.doc("/themes/" + id).snapshotChanges();
      this.themeSubscription = this.theme$.subscribe(snapshot => {
        this.theme = new ThemeModel(snapshot.payload);
        // Get categories for the theme
        const categoryRef = this.db.collection("/categories", ref =>
          ref.where("theme.themeId", "==", this.theme.id)
        );
        this.categories$ = categoryRef.snapshotChanges().pipe(
          map(actions => {
            return actions.map(action => {
              const category: CategoryModel = new CategoryModel(
                action.payload.doc
              );
              return category;
            });
          })
        );
        this.categorySubscription = this.categories$.subscribe(
          results => (this.categories = results)
        );
      });
    });
  }

  onDesignerClick() {
    this.router.navigate(["/themedesigner/U/" + this.theme.id]);
  }

  onNewCategory() {
    this.router.navigate(["/categorydesigner/A/" + this.theme.id]);
  }

  ngOnDestroy() {
    console.log("theme ondestroy");
    if (this.themeSubscription) this.themeSubscription.unsubscribe();
    if (this.categorySubscription) this.categorySubscription.unsubscribe();
  }
}
