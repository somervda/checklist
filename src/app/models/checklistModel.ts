import { AngularFirestore } from "@angular/fire/firestore";
import { ToastrService } from "ngx-toastr";
import { firestore } from "firebase";
// This model is more for helping with the consistancy of the checklist documents
// in the firestore db but
export class ChecklistModel {
  // Duplicates the actual document id but will be useful to have it in the document fields as well
  // especially if the checklistModel is used to define the template object (when applicable)
  // id will only be filled in for the template
  public id: string;
  public title: string;
  public description: string;
  // Templates can only be used to create checklists , not as a checklist with its own data
  public isTemplate: boolean = false;
  //
  public status: ChecklistStatus;
  public dateCreated: Date = new Date();
  // dateTargeted is when the checklist should be completed by
  public dateTargeted: Date = new Date();
  // owner is the auth uid, owner can update and design the checklist
  public owner: { uid: string; displayName: string };
  // communityId is optional if the checklist is only a personal checklist
  public community: { communityId: string; name: string };
  // Template is a copy of the original checklist/template that was used to create
  // the checklist (Optional)
  public template: object = {};

  loadFromObject(payload) {
    this.title = payload.data().title;
    this.description = payload.data().description;
    this.id = payload.id;
    this.isTemplate = payload.data().isTemplate;
    this.owner = payload.data().owner;
    this.community = payload.data().community;

    // Hold dates in the model as datatype Date
    // convert from firestore Timestamp object

    if (
      payload.data().dateTargeted &&
      payload.data().dateTargeted.__proto__.constructor.name == "Timestamp"
    )
      this.dateTargeted = payload.data().dateTargeted.toDate();
    else this.dateTargeted = null;

    if (
      payload.data().dateCreated &&
      payload.data().dateCreated.__proto__.constructor.name == "Timestamp"
    )
      this.dateCreated = payload.data().dateCreated.toDate();
    else this.dateCreated = null;

    console.log(
      "checklistsModel load from object",
      payload.data(),
      " dateCreated:",
      this.dateCreated
    );
  }

  dbFieldUpdate(docId: string, fieldName: string, newValue: any, db) {
    console.log(fieldName + " before Update", docId, newValue);
    let updateObject = {};
    updateObject[fieldName] = newValue;
    db.doc("/checklists/" + docId) // Update to firestore collection
      .update(updateObject)
      .then(data => console.log(fieldName + " updated"))
      .catch(error => console.log(fieldName + " update error ", error));
  }

  get asObject() {
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
    if (this.dateTargeted) {
      if (
        this.dateTargeted <= new Date() &&
        this.status == ChecklistStatus.Active
      )
        return true;
    }
    return false;
  }

  constructor() {
    this.owner = { uid: "", displayName: "" };
    this.community = { communityId: "", name: "" };
  }
}

export enum ChecklistStatus {
  Active = 0,
  Complete = 1,
  Under_Construction = 2,
  Deleted = 3
}
