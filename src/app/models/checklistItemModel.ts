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
  // allowNA indicates that the user can mark the item as Not Applicable
  // when filling out the checklist
  public allowNA: boolean;
  public result: ChecklistItemResult;
  public resultType: ChecklistItemResultType;
  // user can enter comments about the checklist item and status
  public userComment: string;
  public template: object;

  // Utility Functions

  loadFromObject(data) {
    this.result = data.result;
    this.prompt = data.prompt;
    this.id = data.id;
    this.checklistId = data.checklistId;
    this.description = data.description;
    this.resultType = data.resultType;
    this.userComment = data.userComment;
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
