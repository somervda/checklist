export class AuditLogModel {
  public type: string;
  public docId: string;
  public collection: string;
  public fieldName: string;
  public newValue;
  public uid: string;
  public dateCreated: Date;

  constructor(doc) {
    // Overloaded constructor, either will initialize based on
    // a firestore document being passed , or will initialize to default values
    this.type = "Audit";
    this.docId = doc.docId;
    this.collection = doc.collection;
    this.fieldName = doc.fieldName;
    this.newValue = doc.newValue;
    this.uid = doc.uid;
    this.dateCreated = new Date();
  }

  get json() {
    return {
      docId: this.docId,
      collection: this.collection,
      fieldName: this.fieldName,
      newValue: this.newValue,
      uid: this.uid,
      dateCreated: this.dateCreated
    };
  }
}
