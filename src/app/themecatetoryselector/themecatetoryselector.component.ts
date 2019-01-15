import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../services/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { ThemeModel } from "../models/themeModel";
import { map } from "rxjs/operators";

@Component({
  selector: "app-themecatetoryselector",
  templateUrl: "./themecatetoryselector.component.html",
  styleUrls: ["./themecatetoryselector.component.scss"]
})
export class ThemecatetoryselectorComponent implements OnInit, OnDestroy {
  @Input() theme: { themeId: string; name: string };
  @Input() category: { categoryId: string; name: string };

  themeSubscription;
  themes: [ThemeModel];
  themes$;

  closeResult: string;

  constructor(
    private modalService: NgbModal,
    public auth: AuthService,
    private db: AngularFirestore
  ) {}

  ngOnInit() {
    const themeRef = this.db.collection("/themes");
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

  onThemeSelectorChange() {
    console.log();
  }

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  ngOnDestroy() {
    if (this.themeSubscription) this.themeSubscription.unsubscribe();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
}
