//import { ChecklistItemResult } from "./checklistItemModel";
export class ChecklistItemModel {
  // Duplicates the actual document id but will be useful to have it in the document fields as well
  // especially if the checklistItemModel is used to define the template object (when applicable)
  // id will only be filled in for the template
  public id: string;
  public prompt: string;
  public description: string;
  public checklistId: string;
  public owner: string;
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

  loadFromObject(payload) {
    this.result = payload.data().result;
    this.prompt = payload.data().prompt;
    this.id = payload.id;
    this.checklistId = payload.data().checklistId;
    this.description = payload.data().description;
    this.resultType = payload.data().resultType;
    this.userComment = payload.data().userComment;
    this.evidence = payload.data().evidence;
  }

  dbFieldUpdate(docId: string, fieldName: string, newValue: any, db) {
    console.log(fieldName + " before Update", docId, newValue);
    let updateObject = {};
    updateObject[fieldName] = newValue;
    console.log(updateObject);
    db.doc("/checklistItems/" + docId)
      .update(updateObject)
      .then(data => console.log(fieldName + " updated"))
      .catch(error => console.log(fieldName + " update error ", error));
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
  Active = 0,
  Deleted = 1
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
