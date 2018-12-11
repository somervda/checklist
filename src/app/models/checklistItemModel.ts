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
