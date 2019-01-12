import { AuthService } from "./../services/auth.service";
import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";

@Component({
  selector: "app-mycommunities",
  templateUrl: "./mycommunities.component.html",
  styleUrls: ["./mycommunities.component.scss"]
})
export class MycommunitiesComponent implements OnInit {
  //communities$;
  communities = [];

  // See https://swimlane.gitbook.io/ngx-datatable/api/column/inputs

  constructor(public auth: AuthService) {}

  ngOnInit() {
    this.communities = this.auth.user.communitiesAsArray;
  }
}
