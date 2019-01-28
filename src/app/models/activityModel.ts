export class ActivityModel {
  public id: string;
  public name: string;
  public parentType: ActivityParentType;
  public parentId: string;

  constructor(doc?) {
    // Overloaded constructor, either will initialize based on
    // a firestore document being passed , or will initialize to default values
    console.log("activityModel constructor doc:", doc);
    if (doc) {
      this.name = doc.data().name;
      this.id = doc.id;

      this.parentType = doc.data().parentType;
      this.parentId = doc.data().parentId;
    } else {
      this.name = "";
      this.id = "";
    }
  }

  get json() {
    return {
      id: this.id,
      name: this.name,
      parentId: this.parentId,
      parentType: this.parentType
    };
  }

  dbFieldUpdate(docId: string, fieldName: string, newValue: any, db, als) {
    if (docId && fieldName) {
      const updateObject = {};
      updateObject[fieldName] = newValue;
      db.doc("/activities/" + docId) // Update to firestore collection
        .update(updateObject)
        .then(data => {
          console.log(fieldName + " updated");
          als.logUpdate(docId, "activities", fieldName, newValue);
        })
        .catch(error => console.error(fieldName + " update error ", error));
    }
  }
}

export enum ActivityParentType {
  category = 1,
  community = 2
}
