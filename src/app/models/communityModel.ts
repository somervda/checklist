export class CommunityModel {
  public id: string;
  public name: string;
  public description: string;
  public status: string;

  // loadFromObject(data, id) {
  //   this.name = data.name;
  //   this.description = data.description;
  //   this.id = id;
  //   this.status = data.status;
  // }

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
