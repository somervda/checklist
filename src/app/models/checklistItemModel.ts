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
  public template: object;
}

export enum ChecklistItemStatus {
  Active = 0,
  Deleted = 1
}
