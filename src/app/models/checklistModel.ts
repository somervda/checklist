import { AngularFirestore } from "@angular/fire/firestore";
import { ToastrService } from "ngx-toastr";
import { firestore } from "firebase";
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
  public community: { communityId: string; name: string };
  // Template is a copy of the original checklist/template that was used to create
  // the checklist (Optional)
  public template: object = {};

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
        communityId: this.community.communityId,
        name: this.community.name
      },
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
    return "";
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
      this.community = { communityId: "", name: "" };
      this.dateTargeted = null;
      this.dateCreated = null;
    }
  }
}

export enum ChecklistStatus {
  Active = 1,
  Under_Construction = 2,
  Deleted = 3,
  Complete = 4
}
