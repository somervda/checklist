export class CommunityModel {
  public id: string;
  public name: string;
  public description: string;
  public status: string;

  loadFromObject(payload) {
    this.name = payload.data().name;
    this.description = payload.data().description;
    this.id = payload.id;
    this.status = payload.data().status;
  }

  dbFieldUpdate(docId: string, fieldName: string, newValue: any, db) {
    console.log(fieldName + " before Update", docId, newValue);
    let updateObject = {};
    updateObject[fieldName] = newValue;
    db.doc("/communities/" + docId) // Update to firestore collection
      .update(updateObject)
      .then(data => console.log(fieldName + " updated"))
      .catch(error => console.log(fieldName + " update error ", error));
  }
}
