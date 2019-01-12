import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { ThemeModel } from "../models/themeModel";

@Component({
  selector: "app-theme",
  templateUrl: "./theme.component.html",
  styleUrls: ["./theme.component.scss"]
})
export class ThemeComponent implements OnInit, OnDestroy {
  theme$;
  themeSubscription;
  theme: ThemeModel;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: AngularFirestore
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      var id = paramMap.get("id");
      this.theme$ = this.db.doc("/themes/" + id).snapshotChanges();
      this.themeSubscription = this.theme$.subscribe(
        snapshot => (this.theme = new ThemeModel(snapshot.payload))
      );
    });
  }

  onDesignerClick() {
    this.router.navigate(["/themedesigner/U/" + this.theme.id]);
  }

  ngOnDestroy() {
    console.log("theme ondestroy");
    if (this.themeSubscription) this.themeSubscription.unsubscribe();
  }
}
