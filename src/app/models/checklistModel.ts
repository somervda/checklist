// This model is more for helping with the consistancy of the checklist documents
// in the firestore db but
export class ChecklistModel {
  // Duplicates the actual document id but will be useful to have it in the document fields as well
  // especially if the checklistModel is used to define the template object (when applicable)
  public id: string;
  public title: string;
  public description: string;
  // Templates can only be used to create checklists , not as a checklist with its own data
  public isTemplate: boolean;
  //
  public status: ChecklistStatus;
  public dateCreated: Date;
  // owner can be a user email or community name
  public owner: string;
  // Template is a copy of the original checklist/template that was used to create
  // the checklist (Optional)
  public template: object;

  constructor() {}

  // // id
  // public set id(id: string) {
  //   this._id = id;
  // }

  // public get id(): string {
  //   return this._id;
  // }

  // // description
  // public set description(description: string) {
  //   this._description = description;
  // }

  // public get description(): string {
  //   return this._description;
  // }

  // // title
  // public set title(title: string) {
  //   this._title = title;
  // }

  // public get title(): string {
  //   return this._title;
  // }
}

export enum ChecklistStatus {
  active = 0,
  completed = 1,
  underConstruction = 2,
  deleted = 3
}
