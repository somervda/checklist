import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { ThemeModel } from "../models/themeModel";
import { map } from "rxjs/operators";
import { observable } from "rxjs";

@Component({
  selector: "app-themes",
  templateUrl: "./themes.component.html",
  styleUrls: ["./themes.component.scss"]
})
export class ThemesComponent implements OnInit, OnDestroy {
  themeSubscription;
  themes: [ThemeModel];
  themes$;

  constructor(public auth: AuthService, private db: AngularFirestore) {}

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

  ngOnDestroy() {
    //if (this.themeSubscription) this.themeSubscription.unsubscribe();
  }
}
