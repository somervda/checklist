import { UserModel, CommunityAccessState } from "./../models/userModel";
import { CommunityModel } from "./../models/communityModel";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-community",
  templateUrl: "./community.component.html",
  styleUrls: ["./community.component.scss"]
})
export class CommunityComponent implements OnInit, OnDestroy {
  community$;
  community = new CommunityModel();
  communitySubscription;
  users: UserModel[];
  users$;
  userSubscription;
  user = new UserModel();

  CommunityAccessState = CommunityAccessState;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: AngularFirestore
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      var id = paramMap.get("id");
      // See example at https://www.techiediaries.com/angular-firestore-tutorial/
      this.community$ = this.db.doc("/communities/" + id).snapshotChanges();
      this.communitySubscription = this.community$.subscribe(snapshot => {
        this.community = new CommunityModel(snapshot.payload);

        // Get users in the community
        const communityMapQuery = "communities." + id + ".name";
        this.users$ = this.db
          .collection("users/", ref => ref.where(communityMapQuery, ">=", ""))
          .snapshotChanges();
        this.userSubscription = this.users$.subscribe(data => {
          this.users = data.map(e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data()
            } as UserModel;
          });

          console.log(
            "community onInit usersubscription",
            communityMapQuery,
            data,
            this.users
          );
        });

        //this.community.loadFromObject(snapshot.payload.data(), snapshot.id);
        console.log("community onInit data", this.community);
      });
    });
  }

  onDesignerClick() {
    this.router.navigate(["/communitydesigner/U/" + this.community.id]);
  }

  ngOnDestroy() {
    console.log("community ondestroy");
    if (this.communitySubscription) this.communitySubscription.unsubscribe();
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }
}
