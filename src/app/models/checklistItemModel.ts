//import { ChecklistItemResult } from "./checklistItemModel";
export class ChecklistItemModel {
  // Duplicates the actual document id but will be useful to have it in the document fields as well
  // especially if the checklistItemModel is used to define the template object (when applicable)
  // id will only be filled in for the template
  public id: string;
  public prompt: string;
  public description: string;
  public checklistId: string;
  public owner: { uid: string; displayName: string };
  public activity: { id: string; name: string };
  public dateCreated: Date;
  public status: ChecklistItemStatus;
  public evidence: string;
  // allowNA indicates that the user can mark the item as Not Applicable
  // when filling out the checklist
  public allowNA: boolean;
  public result: ChecklistItemResult;
  public resultType: ChecklistItemResultType;
  // user can enter comments about the checklist item and status
  public userComment: string;
  public template: object;

  // Utility Functions
  constructor(doc?) {
    if (doc) {
      this.result = doc.data().result;
      this.prompt = doc.data().prompt;
      this.id = doc.id;
      this.checklistId = doc.data().checklistId;
      if (doc.data().description) {
        this.description = doc.data().description;
      } else {
        this.description = "";
      }
      this.resultType = doc.data().resultType;
      this.userComment = doc.data().userComment;
      if (doc.data().activity) this.activity = doc.data().activity;
      else {
        this.activity = { id: "", name: "None" };
      }
      this.evidence = doc.data().evidence;
      if (
        doc.data().dateCreated &&
        doc.data().dateCreated.seconds &&
        (doc.data().dateCreated.nanoseconds ||
          doc.data().dateCreated.nanoseconds === 0)
      )
        this.dateCreated = doc.data().dateCreated.toDate();
      else this.dateCreated = null;
      if (doc.data().allowNA) {
        this.allowNA = doc.data().allowNA;
      } else {
        this.allowNA = false;
      }
      if (doc.data().template) {
        this.template = doc.data().template;
      } else {
        this.template = {};
      }
      this.owner = doc.data().owner;
      this.status = doc.data().status;
    } else {
      this.result = ChecklistItemResult.false;
      this.prompt = "";
      this.id = "";
      this.checklistId = "";
      this.description = "";
      this.resultType = ChecklistItemResultType.checkbox;
      this.userComment = "";
      this.activity = { id: "", name: "None" };
      this.evidence = "";
      this.dateCreated = null;
      this.allowNA = false;
      this.template = {};
      this.owner = { uid: "", displayName: "" };
      this.status = ChecklistItemStatus.Active;
    }
  }

  get json() {
    return {
      result: this.result,
      prompt: this.prompt,
      id: this.id,
      checklistId: this.checklistId,
      description: this.description,
      resultType: this.resultType,
      userComment: this.userComment,
      evidence: this.evidence,
      activity: this.activity,
      dateCreated: this.dateCreated,
      allowNA: this.allowNA,
      template: this.template,
      owner: { uid: this.owner.uid, displayName: this.owner.displayName },
      status: this.status
    };
  }

  dbFieldUpdate(docId: string, fieldName: string, newValue: any, db, als) {
    if (docId && fieldName) {
      console.log(fieldName + " before Update", docId, newValue);
      let updateObject = {};
      updateObject[fieldName] = newValue;
      console.log(updateObject);
      db.doc("/checklistItems/" + docId)
        .update(updateObject)
        .then(data => {
          console.log(fieldName + " updated");
          als.logUpdate(docId, "checklistItems", fieldName, newValue);
        })
        .catch(error => console.log(fieldName + " update error ", error));
    }
  }

  // Gets and sets

  get isChecked(): boolean {
    if (this.result == ChecklistItemResult.true) return true;
    else return false;
  }

  set isChecked(value: boolean) {
    if (value) this.result = ChecklistItemResult.true;
    else this.result = ChecklistItemResult.false;
  }

  get isNA(): boolean {
    if (this.result == ChecklistItemResult.NA) return true;
    else return false;
  }

  set isNA(value: boolean) {
    if (value) this.result = ChecklistItemResult.NA;
  }

  get rating(): number {
    switch (this.result) {
      case ChecklistItemResult.low: {
        return 1;
      }
      case ChecklistItemResult.mediumLow: {
        return 2;
      }
      case ChecklistItemResult.medium: {
        return 3;
      }
      case ChecklistItemResult.mediumHigh: {
        return 4;
      }
      case ChecklistItemResult.high: {
        return 5;
      }
      default: {
        return null;
      }
    }
  }

  set rating(value: number) {
    switch (value) {
      case 1: {
        this.result = ChecklistItemResult.low;
        break;
      }
      case 2: {
        this.result = ChecklistItemResult.mediumLow;
        break;
      }
      case 3: {
        this.result = ChecklistItemResult.medium;
        break;
      }
      case 4: {
        this.result = ChecklistItemResult.mediumHigh;
        break;
      }
      case 5: {
        this.result = ChecklistItemResult.high;
        break;
      }
      default: {
        break;
      }
    }
  }
}

export enum ChecklistItemStatus {
  Active = 0, // Normal will show on checklists
  Deleted = 1, // Esentially removed will not show anywhere (no user option to delete or undelete)
  Suppressed = 2 // Remove from showing on checklist (Owner can suppress and unsuppress items in the designer)
}

// How the results of the item can be represented (4 choices)
export enum ChecklistItemResultType {
  checkbox = 0,
  checkboxNA = 1,
  rating = 2,
  ratingNA = 3
}

export enum ChecklistItemResult {
  NA = -1,
  false = 0,
  true = 1,
  low = 101,
  mediumLow = 102,
  medium = 103,
  mediumHigh = 104,
  high = 105
}
