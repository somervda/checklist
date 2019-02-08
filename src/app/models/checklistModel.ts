import { ChecklistItemModel, ChecklistItemResult } from "./checklistItemModel";
import { AngularFirestore } from "@angular/fire/firestore";
import { ToastrService } from "ngx-toastr";
import { firestore } from "firebase";
import { jsonpCallbackContext } from "@angular/common/http/src/module";
// This model is more for helping with the consistancy of the checklist documents
// in the firestore db but
export class ChecklistModel {
  // Id Duplicates the actual document id but will be useful to have it in the document fields as well
  // especially if the checklistModel is used to define the template object (when applicable)
  // id will only be filled in for the template
  public id: string = "";
  public title: string = "";
  public description: string = "";
  // Templates can only be used to create checklists , not as a checklist with its own data
  public isTemplate: boolean = false;
  //
  public status: ChecklistStatus;
  public dateCreated: Date = null;
  // dateTargeted is when the checklist should be completed by
  public dateTargeted: Date = null;
  // owner is the auth uid, owner can update and design the checklist
  public owner: { uid: string; displayName: string };
  // communityId is optional if the checklist is only a personal checklist
  public community: { id: string; name: string };
  // Template is a copy of the original checklist/template that was used to create
  // the checklist (Optional)
  public template: object = {};

  theme: { id: string; name: string };
  category: { id: string; name: string };

  dbFieldUpdate(docId: string, fieldName: string, newValue: any, db, als) {
    if (docId && fieldName) {
      console.log(fieldName + " before Update", docId, newValue);
      let updateObject = {};
      updateObject[fieldName] = newValue;
      db.doc("/checklists/" + docId) // Update to firestore collection
        .update(updateObject)
        .then(data => {
          console.log(fieldName + " updated");
          als.logUpdate(docId, "checklists", fieldName, newValue);
        })
        .catch(error => console.log(fieldName + " update error ", error));
    }
  }

  get json() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      isTemplate: this.isTemplate,
      status: this.status,
      dateCreated: this.dateCreated,
      dateTargeted: this.dateTargeted,
      owner: { uid: this.owner.uid, displayName: this.owner.displayName },
      community: {
        id: this.community.id,
        name: this.community.name
      },
      theme: { id: this.theme.id, name: this.theme.name },
      category: { id: this.category.id, name: this.category.name },
      template: this.template
    };
  }

  get dateCreatedShortDate(): string {
    if (this.isValidDate(this.dateCreated))
      return this.dateCreated.toLocaleDateString();
    return "";
  }

  get dateTargetedShortDate(): string {
    if (this.isValidDate(this.dateTargeted))
      return this.dateTargeted.toLocaleDateString();
    return "Not set";
  }

  isValidDate(date) {
    return (
      date &&
      Object.prototype.toString.call(date) === "[object Date]" &&
      !isNaN(date)
    );
  }

  get isOverdue(): boolean {
    console.log("isOverdue");
    if (this.dateTargeted) {
      console.log("isOverdue", this.title, this.dateTargeted, this.status);
      if (
        this.dateTargeted <= new Date() &&
        this.status == ChecklistStatus.Active
      )
        return true;
    }
    return false;
  }

  constructor(doc?) {
    if (doc) {
      this.title = doc.data().title;
      this.description = doc.data().description;
      this.id = doc.id;
      this.isTemplate = doc.data().isTemplate;
      this.owner = doc.data().owner;
      this.community = doc.data().community;
      this.status = doc.data().status;
      this.category = doc.data().category;
      if (doc.data().theme) this.theme = doc.data().theme;
      else this.theme = { id: "", name: "[None Selected]" };
      if (doc.data().category) this.category = doc.data().category;
      else this.category = { id: "", name: "[None Selected]" };

      // Hold dates in the model as datatype Date
      // convert from firestore Timestamp object
      // Note: nanoseconds can often be set to 0 they messes up existence coercion test so
      // I do an extra check that the value is not numeric 0
      if (
        doc.data().dateTargeted &&
        doc.data().dateTargeted.seconds &&
        (doc.data().dateTargeted.nanoseconds ||
          doc.data().dateTargeted.nanoseconds === 0)
      ) {
        this.dateTargeted = doc.data().dateTargeted.toDate();
      } else this.dateTargeted = null;

      if (
        doc.data().dateCreated &&
        doc.data().dateCreated.seconds &&
        (doc.data().dateCreated.nanoseconds ||
          doc.data().dateCreated.nanoseconds === 0)
      )
        this.dateCreated = doc.data().dateCreated.toDate();
      else this.dateCreated = null;

      console.log(
        "checklistsModel load from object",
        doc.data(),
        " dateCreated:",
        this.dateCreated
      );
    } else {
      this.title = "";
      this.description = "";
      this.id = "";
      this.status = ChecklistStatus.Active;
      this.isTemplate = false;
      this.owner = { uid: "", displayName: "" };
      this.community = { id: "", name: "" };
      this.dateTargeted = null;
      this.dateCreated = null;
      this.theme = { id: "", name: "[None Selected]" };
      this.category = { id: "", name: "[None Selected]" };
    }
  }

  copy(
    targetTitle: string,
    targetCommunity: { id: string; name: string },
    copyIsTemplate: boolean,
    owner: { uid: string; displayName: string },
    targetTheme: { id: string; name: string },
    targetCategory: { id: string; name: string },
    db,
    als
  ): string {
    // Makes a copy of the current checklist and associated checklistItems
    // Strip out all result info on a copy and set status to under_construction.
    // make the person copying the checklist the owner
    // Checklist details are already available but will create an array
    // of checklistItems before we start to copy when doing the update
    // If copyIsTemplate then mark the new checklist as a template

    console.log("copy start", targetTheme, targetCategory);
    let checkListItemsJson = new Array();
    let checklistJson = this.json;

    // Set selected checklist fields to default values
    checklistJson.title = targetTitle;
    checklistJson.isTemplate = copyIsTemplate;
    checklistJson.id = db.createId();
    checklistJson.dateCreated = new Date();
    checklistJson.dateTargeted = null;
    checklistJson.owner = owner;
    checklistJson.status = ChecklistStatus.Under_Construction;
    checklistJson.community = targetCommunity;
    checklistJson.theme = targetTheme;
    checklistJson.category = targetCategory;
    console.log("copy checklistJson", checklistJson);

    // get checklist item and make an array of new items to be copies
    db.collection("checklistItems", ref =>
      ref.where("checklistId", "==", this.id)
    )
      .get()
      .toPromise()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let checklistItemJson = new ChecklistItemModel(doc).json;
          checklistItemJson.dateCreated = new Date();
          checklistItemJson.evidence = "";
          checklistItemJson.result = ChecklistItemResult.false;
          checklistItemJson.userComment = "";
          checklistItemJson.owner = owner;
          checklistItemJson.checklistId = checklistJson.id;
          checkListItemsJson.push(checklistItemJson);
        });
        // console.log("copy checklistItems getter", checkListItemsJson);
        this.batchWriteChecklist(db, als, checklistJson, checkListItemsJson);
      })
      .catch(error => {
        console.error("copy error getting checklistItems", error);
      });

    return checklistJson.id;
  }

  batchWriteChecklist(db, als, checklistJson, checkListItemsJson) {
    // Batch write of the checklists and checklistitems
    var batch = db.firestore.batch();

    // checklist writer
    var clRef = db.collection("checklists").doc(checklistJson.id).ref;
    console.log("batchWriteChecklist", checkListItemsJson);
    batch.set(clRef, checklistJson);

    // checklistItems writer
    checkListItemsJson.forEach(cli => {
      cli.id = db.createId();
      var cliRef = db.collection("checklistItems").doc(cli.id).ref;
      batch.set(cliRef, cli);
    });

    // Commit the batch
    batch
      .commit()
      .then(() => {
        console.log("copy success", checklistJson.id);
        als.logUpdate(checklistJson.id, "checklists", "Copy", checklistJson);
      })
      .catch(error => {
        console.error("copy error", error);
      });
  }
}

export enum ChecklistStatus {
  Active = 1,
  Under_Construction = 2,
  Deleted = 3,
  Complete = 4
}
