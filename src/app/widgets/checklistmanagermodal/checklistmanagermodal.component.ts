import { CommunityAccessState } from "../../models/userModel";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../../services/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuditlogService } from "../../services/auditlog.service";
import { ToastrService } from "ngx-toastr";
import { ThemeModel } from "../../models/themeModel";
import { CategoryModel } from "../../models/categoryModel";
import { map } from "rxjs/operators";
import { ChecklistModel, ChecklistStatus } from "src/app/models/checklistModel";

@Component({
  selector: "app-checklistmanagermodal",
  templateUrl: "./checklistmanagermodal.component.html",
  styleUrls: ["./checklistmanagermodal.component.scss"]
})
export class ChecklistmanagermodalComponent implements OnInit {
  @Input() checklistId: string;
  @Output() categoryAction = new EventEmitter();

  checklist: ChecklistModel;

  selectedAction: string;
  title: string;
  copyAsTemplate = false;

  ChecklistStatus = ChecklistStatus;

  themeSubscription;
  themes: [ThemeModel];
  themes$;
  selectedThemeId: string;

  categorySubscription;
  categories: [CategoryModel];
  categories$;
  selectedCategoryId: string;

  constructor(
    private modalService: NgbModal,
    public auth: AuthService,
    private db: AngularFirestore,
    private als: AuditlogService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.themes$ = this.db
      .collection("themes")
      .snapshotChanges()
      .pipe(
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

  open(content) {
    this.selectedAction = "";
    this.db
      .doc("checklists/" + this.checklistId)
      .get()
      .toPromise()
      .then(doc => {
        this.checklist = new ChecklistModel(doc);
        console.log(
          "checklistmanagermodal open",
          this.checklistId,
          this.checklist
        );
        this.title = this.checklist.title;
        if (this.checklist.theme.id != "") {
          this.selectedThemeId = this.checklist.theme.id;
          this.loadCategories(this.selectedThemeId);
        }
        if (this.checklist.category.id != "") {
          this.selectedCategoryId = this.checklist.category.id;
        }

        console.log("open checklist", this.checklist);

        this.modalService
          .open(content, { ariaLabelledBy: "modal-basic-title" })
          .result.then(result => {
            if (result == "Confirm") {
              switch (this.selectedAction) {
                case "copy":
                  this.copy();
                  break;
                case "publish":
                  this.publish();
                  break;
                case "complete":
                  this.complete();
                  break;
                case "active":
                  this.active();
                  break;
                case "delete":
                  this.delete();
                  break;
                default:
                  console.error("Unexpected Action:", this.selectedAction);
                  break;
              }
              this.categoryAction.emit();
            }
          });
      })
      .catch(error =>
        console.error("checklistmanagermodal getChecklist", error)
      );
  }

  copy() {
    console.log("copy");
    const newChecklistsId = this.checklist.copy(
      this.title,
      { id: "", name: "" },
      this.copyAsTemplate,
      { uid: this.auth.user.id, displayName: this.auth.user.displayName },
      this.checklist.theme,
      this.checklist.category,
      this.db,
      this.als
    );
  }

  isInCommunity() {
    // Checks to see if user is a; community member, leader or leader invitee
    if (this.checklist.community && this.checklist.community.id != "") {
      const userCommunity = this.auth.user.getCommunityDetails(
        this.checklist.community.id
      );
      if (
        userCommunity.accessState == CommunityAccessState.leader ||
        userCommunity.accessState == CommunityAccessState.member ||
        userCommunity.accessState == CommunityAccessState.leadershipInvited
      )
        return true;
    }

    return false;
  }

  isCommunityLeader() {
    // Checks to see if user is a; community leader
    if (this.checklist.community && this.checklist.community.id != "") {
      const userCommunity = this.auth.user.getCommunityDetails(
        this.checklist.community.id
      );
      if (userCommunity.accessState == CommunityAccessState.leader) return true;
    }

    return false;
  }

  publish() {
    console.log(
      "publish ",
      this.selectedThemeId,
      " - ",
      this.selectedCategoryId
    );
    // Restricted version of copy, always copies as a template
    // to the Public Community
    const targetTheme = this.themes.find(
      theme => theme.id == this.selectedThemeId
    );
    console.log("publish targetTheme:", targetTheme);
    const targetCategory = this.categories.find(
      category => category.id == this.selectedCategoryId
    );
    console.log("publish targetCategory:", this.categories, targetCategory);
    const newChecklistsId = this.checklist.copy(
      this.title,
      { id: "PUBLIC", name: "Public Templates" },
      true,
      { uid: this.auth.user.id, displayName: this.auth.user.displayName },
      { id: targetTheme.id, name: targetTheme.name },
      { id: targetCategory.id, name: targetCategory.name },
      this.db,
      this.als
    );
  }

  complete() {
    console.log("status complete");
    this.checklist.dbFieldUpdate(
      this.checklistId,
      "status",
      ChecklistStatus.Complete,
      this.db,
      this.als
    );
  }

  active() {
    console.log("active");
    this.checklist.dbFieldUpdate(
      this.checklistId,
      "status",
      ChecklistStatus.Active,
      this.db,
      this.als
    );
  }

  delete() {
    console.log("delete");
    if (!confirm("Confirm that this checklist should be deleted.")) return;
    console.log("delete confirmed");
    this.checklist.dbFieldUpdate(
      this.checklistId,
      "status",
      ChecklistStatus.Deleted,
      this.db,
      this.als
    );
  }

  onThemeSelectorChange() {
    console.log("onThemeSelectorChange");
    this.loadCategories(this.selectedThemeId);
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
      // Force selection of first category when theme is changed
      if (
        this.checklist.theme.id != this.selectedThemeId &&
        this.categories.length > 0
      )
        this.selectedCategoryId = this.categories[0].id;
    });
  }

  ngOnDestroy() {}
}
