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
  public isTemplate: boolean;
  //
  public status: ChecklistStatus;
  public dateCreated: Date;
  // dateTargeted is when the checklist should be completed by
  public dateTargeted: Date;
  // owner is the auth uid, owner can update and design the checklist
  public owner: string;
  // communityId is optional if the checklist is only a personal checklist
  public communityId: string;
  // Template is a copy of the original checklist/template that was used to create
  // the checklist (Optional)
  public template: object;

  loadFromObject(data, id) {
    this.title = data.title;
    this.description = data.description;
    this.id = id;
    this.isTemplate = data.isTemplate;
    this.owner = data.owner;
    this.communityId = data.communityId;
    this.dateTargeted = data.dateTargeted;
    this.dateCreated = data.dateCreated;
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
  Active = 0,
  Complete = 1,
  Under_Construction = 2,
  Deleted = 3
}
