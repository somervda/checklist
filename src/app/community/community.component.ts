import { CommunityModel } from "./../models/communityModel";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-community",
  templateUrl: "./community.component.html",
  styleUrls: ["./community.component.css"]
})
export class CommunityComponent implements OnInit, OnDestroy {
  community$;
  community = new CommunityModel();
  communitySubscription;

  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      var id = paramMap.get("id");
      // See example at https://www.techiediaries.com/angular-firestore-tutorial/
      this.community$ = this.db.doc("/communities/" + id).snapshotChanges();
      this.communitySubscription = this.community$.subscribe(snapshot => {
        this.community = {
          id: snapshot.payload.id,
          ...snapshot.payload.data()
        } as CommunityModel;

        //this.community.loadFromObject(snapshot.payload.data(), snapshot.id);
        console.log("community onInit data", snapshot, this.community);
      });
    });
  }

  ngOnDestroy() {
    console.log("community ondestroy");
    this.communitySubscription.unsubscribe();
  }
}
