import { ChecklistModel } from "./../models/checklistModel";
import { AuthService } from "./../services/auth.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { ToastrService } from "ngx-toastr";
import { auth } from "firebase";
import { CommunityAccessState } from "../models/userModel";

@Component({
  selector: "app-checklist",
  templateUrl: "./checklist.component.html",
  styleUrls: ["./checklist.component.scss"]
})
export class ChecklistComponent implements OnInit, OnDestroy {
  checklist$;
  //checklistItems$;
  checklistitems;
  id;
  showDesignerButton: boolean = false;
  CommunityAccessState = CommunityAccessState;
  checklist = new ChecklistModel();
  checklistSubscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: AngularFirestore,
    private toastr: ToastrService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get("id");
      this.checklist$ = this.db.doc("/checklists/" + this.id).get();
      this.checklistSubscription = this.checklist$.subscribe(doc => {
        console.log("onInit doc", doc.data());
        this.checklist.loadFromObject(doc);

        // Update screan options based on user access
        if (doc.data().owner && doc.data().owner.uid) {
          if (doc.data().owner.uid == this.auth.getUserUID)
            this.showDesignerButton = true;
        }
        console.log(
          "Checklist onInit 1 :",
          this.auth.user,
          " -2- ",
          this.auth.user.communities
        );
        console.log(
          "Checklist onInit 1.5 :",
          this.auth.user.communities["Tw8CPGkAwTxjUxW7dnNg"]
          //   this.auth.user.getCommunityDetails("Tw8CPGkAwTxjUxW7dnNg")
        );
        if (
          this.auth.user.communities &&
          doc.data().community &&
          doc.data().community.communityId &&
          this.auth.user.communities[doc.data().community.communityId] &&
          this.auth.user.communities[doc.data().community.communityId]
            .accessState
        ) {
          console.log(
            "Checklist onInit 2 :",
            this.auth.user.communities[doc.data().community.communityId]
              .accessState
          );
          if (
            this.auth.user.communities[doc.data().community.communityId]
              .accessState == CommunityAccessState.leader
          )
            this.showDesignerButton = true;
        }
      });

      // Get checklistItems
      // this.checklistItems$ = this.db
      //   .collection("checklistItems", ref => ref.where("checklistId", "==", id))
      //   .snapshotChanges();
      //this.checklistItems$.subscribe(snap => console.log(snap));

      // Changed to using a lists so list of checklistitems is only retrieved once
      // when first entering the component. Checklistsitem updates will still be handled in
      // the checklistsitem component in real time, but lists of checklistitems
      // will not be refreshed each time back end changes occur (i.e. adding or deleting an item)
      this.db
        .collection("checklistItems", ref =>
          ref.where("checklistId", "==", this.id)
        )
        .get()
        .toPromise()
        .then(snapshot => {
          this.checklistitems = snapshot.docs;
          // console.log("getter", this.checklistitems);
        })
        .catch(error => {
          this.toastr.error(error.message, "Failed to get checkbox items", {
            timeOut: 5000
          });
        });
    });
  }

  onDesignerClick() {
    this.router.navigate(["/checklistdesigner/U/" + this.id]);
  }

  ngOnDestroy() {
    if (this.checklistSubscription) this.checklistSubscription.unsubscribe();
  }
}
