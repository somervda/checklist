export class ChecklistModel {
  public title: string;
  public description: string;
  // Templates can only be used to create checklists , not as a checklist with its own data
  public isTemplate: boolean;
  public dateCreated: Date;
  public author: string;
  public template: {
    id: string;
    title: string;
    description: string;
  };

  constructor() {}
}
