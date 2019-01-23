import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { CategoryModel } from "../models/categoryModel";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"]
})
export class CategoryComponent implements OnInit, OnDestroy {
  categorySubscription;
  category: CategoryModel;
  category$;
  categoryId;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: AngularFirestore
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.categoryId = paramMap.get("id");
      this.category$ = this.db
        .doc("/categories/" + this.categoryId)
        .snapshotChanges();
      this.categorySubscription = this.category$.subscribe(snapshot => {
        this.category = new CategoryModel(snapshot.payload);
      });
    });
  }

  onDesignerClick() {
    this.router.navigate(["/categorydesigner/U/" + this.category.id]);
  }

  ngOnDestroy() {
    if (this.categorySubscription) this.categorySubscription.unsubscribe();
  }
}
