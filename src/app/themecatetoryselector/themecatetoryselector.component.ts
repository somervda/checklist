import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter
} from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../services/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { ThemeModel } from "../models/themeModel";
import { map } from "rxjs/operators";
import { CategoryModel } from "../models/categoryModel";

@Component({
  selector: "app-themecatetoryselector",
  templateUrl: "./themecatetoryselector.component.html",
  styleUrls: ["./themecatetoryselector.component.scss"]
})
export class ThemecatetoryselectorComponent implements OnInit, OnDestroy {
  @Input() theme: { id: string; name: string };
  @Input() category: { id: string; name: string };
  // Filter mode option changes behavior for use as a selection filter
  // adds the special category value of {categoryId : "-1", name : "All"}
  // that indicates no filter on theme/category
  @Input() filterMode: boolean = false;

  @Output() themeCategoryChange = new EventEmitter();

  themeSubscription;
  themes: [ThemeModel];
  themes$;
  selectedThemeId: string;

  categorySubscription;
  categories: [CategoryModel];
  categories$;
  selectedCategoryId: string;

  closeResult: string;

  constructor(
    private modalService: NgbModal,
    public auth: AuthService,
    private db: AngularFirestore
  ) {}

  ngOnInit() {
    const themeRef = this.db.collection("themes");
    this.themes$ = themeRef.snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const theme: ThemeModel = new ThemeModel(action.payload.doc);
          return theme;
        });
      })
    );
    this.themeSubscription = this.themes$.subscribe(
      results => (this.themes = results)
    );
  }

  loadCategories(themeId: string) {
    console.log("loadCategories themeId:", themeId);
    if (this.categorySubscription) this.categorySubscription.unsubscribe();
    const categoriesRef = this.db.collection("categories", ref =>
      ref.where("theme.id", "==", themeId)
    );
    this.categories$ = categoriesRef.snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const category: CategoryModel = new CategoryModel(action.payload.doc);

          return category;
        });
      })
    );
    this.categorySubscription = this.categories$.subscribe(results => {
      this.categories = results;
      // console.log("loadCategories subscribe categories:", this.categories);
      // console.log(
      //   "loadCategories subscribe selectdCategoryId:",
      //   this.selectedCategoryId
      // );
      // Force selection of first category when theme is changed
      if (this.theme.id != this.selectedThemeId && this.categories.length > 0)
        this.selectedCategoryId = this.categories[0].id;
    });
  }

  onThemeSelectorChange() {
    console.log("onThemeSelectorChange");
    this.loadCategories(this.selectedThemeId);
  }

  open(content) {
    this.selectedThemeId = this.theme.id;
    this.selectedCategoryId = this.category.id;
    this.loadCategories(this.theme.id);
    console.log(
      "open themeSelector",
      this.theme,
      this.category,
      this.selectedCategoryId
    );
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(result => {
        if (result == "Save") {
          const selectedTheme = this.themes.find(
            o => o.id == this.selectedThemeId
          );
          this.theme.name = selectedTheme.name;
          this.theme.id = selectedTheme.id;
          const selectedCategory = this.categories.find(
            o => o.id == this.selectedCategoryId
          );
          this.category.name = selectedCategory.name;
          this.category.id = selectedCategory.id;
          const returnValue = {
            themeId: this.theme.id,
            themeName: this.theme.name,
            categoryId: this.category.id,
            categoryName: this.category.name
          };
          this.themeCategoryChange.emit(returnValue);
        }
        if (result == "All") {
          const returnValue = {
            themeId: "",
            themeName: "",
            categoryId: "-1",
            categoryName: "All"
          };
          this.themeCategoryChange.emit(returnValue);
        }
      });
  }

  ngOnDestroy() {
    if (this.themeSubscription) this.themeSubscription.unsubscribe();
    if (this.categorySubscription) this.categorySubscription.unsubscribe();
  }
}
