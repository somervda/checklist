import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-community",
  templateUrl: "./community.component.html",
  styleUrls: ["./community.component.css"]
})
export class CommunityComponent implements OnInit {
  community$;

  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      var id = paramMap.get("id");
      this.community$ = this.db.doc("/communities/" + id).get();
    });
  }
}
