import { AuditlogService } from "./../services/auditlog.service";
import { AuthService } from "./../services/auth.service";
import { UserModel, CommunityAccessState } from "./../models/userModel";
//import { Subscription, Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { map, combineLatest } from "rxjs/operators";
//import { Subject } from "rxjs/Subject";

@Component({
  selector: "app-tester",
  templateUrl: "./tester.component.html",
  styleUrls: ["./tester.component.scss"]
})
export class TesterComponent implements OnInit, OnDestroy {
  users;
  communityId: string = "Tw8CPGkAwTxjUxW7dnNg";
  //communityId: string = "Ufrqt16S1Yr1c7cG7eqq";
  ownerORcommunity$;
  htmlContent;

  CommunityAccessState = CommunityAccessState;
  user = new UserModel();

  editorConfig = {
    editable: true,
    spellcheck: true,
    height: "auto",
    minHeight: "70px",
    width: "auto",
    minWidth: "0",
    translate: "yes",
    enableToolbar: true,
    showToolbar: true,
    placeholder: "Enter text here...",
    imageEndPoint: "",
    toolbar: [
      ["bold", "italic", "underline"],
      ["horizontalLine", "orderedList", "unorderedList"],
      ["undo"]
    ]
  };

  constructor(
    private db: AngularFirestore,
    private auth: AuthService,
    private als: AuditlogService
  ) {}

  ngOnInit() {
    // 01 - test querying based on user community map
    const accessField: string =
      "communities." + this.communityId + ".accessState";

    this.db
      .collection(
        "users",
        ref =>
          ref
            //         .where("memberOfCommunity", "array-contains", this.communityId)
            // .where(accessField, "==", "member") // Find users who have member access to the community
            .where(accessField, ">", "") // Will find users who have any access to community
      )
      .get()
      .toPromise()
      .then(data => {
        console.log("Test #1  docs collection", data.docs);
        this.users = data.docs;
      });

    // 02 Test user model
    //this.user.loadFromObject({ communities: {} }, "commId");
    console.log("Test #2 loadFromObject user:", this.user.communities);

    this.user.mergeCommunity("commId", "111", CommunityAccessState.leader);
    console.log("Test #2 mergeCommunity user:", this.user);
    this.user.mergeCommunity("commId2", "111", CommunityAccessState.member);
    console.log("Test #2 mergeCommunity user:", this.user);

    //this.user.deleteCommunity("commId2");
    console.log("Test #2 mergeCommunity user:", this.user);

    // 03 test that user information is retained in the auth service (singleton? service)
    console.log("Test #3", this.auth.user);

    // 04 test iterating through communities in user

    for (var community in this.auth.user.communities) {
      console.log(
        "Test #4",
        community + " - ",
        this.auth.user.communities[community]
      );
    }

    // 05 - merging 2 firestore queries to simulate a OR

    // Query1 for checklists by owner
    var ownerRef = this.db.collection("checklists/", ref =>
      ref.where("owner.uid", "==", "zb4s3QmJ67XdqFyun1gCRGUWyvN2")
    );

    // Query2 for checklists by community
    var communityRef = this.db.collection("checklists/", ref =>
      ref.where("community.communityId", "==", "Tw8CPGkAwTxjUxW7dnNg")
    );

    // Create simplifies Observables of arrays.
    var ownerCL$ = ownerRef.snapshotChanges().pipe(
      map(documentChangeAction =>
        documentChangeAction.map(row => {
          return Object.assign(
            { id: row.payload.doc.id },
            row.payload.doc.data()
          );
        })
      )
    );

    var communityCL$ = communityRef.snapshotChanges().pipe(
      map(documentChangeAction =>
        documentChangeAction.map(row => {
          return Object.assign(
            { id: row.payload.doc.id },
            row.payload.doc.data()
          );
        })
      )
    );

    ownerCL$.subscribe(data => console.log("Test #5 ownerCL$", data));

    communityCL$.subscribe(data => console.log("Test #5 communityCL$", data));

    // role the two arrays from the combineLatest operation to make one long array (using the ... array operator)
    this.ownerORcommunity$ = ownerCL$.pipe(
      combineLatest(communityCL$),
      map(([cl1, cl2]) => [...cl1, ...cl2])
    );
    // Show results
    this.ownerORcommunity$.subscribe(data =>
      console.log("Test #5 ownerORcommunity$", data)
    );
  }

  doBatchUpdate() {
    console.log("doBatchUpdate start");

    // Get a new write batch
    var batch = this.db.firestore.batch();
    // Set the value of 'collection'
    var itemRef = this.db.collection("checklistItems");
    // https://stackoverflow.com/questions/46618601/how-to-create-update-multiple-documents-at-once-in-firestore
    // Update each document
    itemRef.ref
      .get()
      .then(resp => {
        console.log(resp.docs);
        let batch = this.db.firestore.batch();

        resp.docs.forEach(userDocRef => {
          batch.update(userDocRef.ref, { status: 0 });
        });
        batch.commit().catch(err => console.error(err));
      })
      .catch(error => console.error(error));

    console.log("doBatchUpdate end");
  }

  doBatchUpdate2() {
    console.log("doBatchUpdate 2 - checklist.community.id  start");

    // Get a new write batch
    var batch = this.db.firestore.batch();
    // Set the value of 'collection'
    var itemRef = this.db.collection("checklists");
    // https://stackoverflow.com/questions/46618601/how-to-create-update-multiple-documents-at-once-in-firestore
    // Update each document
    itemRef.ref
      .get()
      .then(resp => {
        console.log(resp.docs);
        let batch = this.db.firestore.batch();

        resp.docs.forEach(userDocRef => {
          console.log("docref", userDocRef.data());
          let communityId = "";
          let communityName = "";
          if (userDocRef.data().community && userDocRef.data().community.id) {
            (communityId = userDocRef.data().community.id),
              (communityName = userDocRef.data().community.name);
          }
          batch.update(userDocRef.ref, {
            community: { id: communityId, name: communityName }
          });
        });
        batch.commit().catch(err => console.error(err));
      })
      .catch(error => console.error(error));

    console.log("doBatchUpdate 2 end");
  }

  themeCategoryChange(result) {
    console.log("themeCategoryChange", result);
  }

  doInvitationUpdate() {
    console.log("doInvitationUpdate");
    this.auth.user.acceptCommunityInvitation(
      "61Wm7hOEPjKdgyGHiU5c",
      this.db,
      this.als
    );
  }

  ngOnDestroy() {
    console.log("htmlContent: ", this.htmlContent);
  }
}
