export class CommunityModel {
  public id: string;
  public name: string;
  public description: string;
  public status: string;

  constructor(doc?) {
    if (doc) {
      this.name = doc.data().name;
      this.description = doc.data().description;
      this.id = doc.id;
      this.status = doc.data().status;
    } else {
      this.name = "";
      this.description = "";
      this.id = "";
      this.status = "";
    }
  }

  // loadFromObject(payload) {
  //   this.name = payload.data().name;
  //   this.description = payload.data().description;
  //   this.id = payload.id;
  //   this.status = payload.data().status;
  // }

  get json() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      status: this.status
    };
  }

  dbFieldUpdate(docId: string, fieldName: string, newValue: any, db, als) {
    //console.log(fieldName + " before Update", docId, newValue);
    if (docId && fieldName) {
      let updateObject = {};
      updateObject[fieldName] = newValue;
      db.doc("/communities/" + docId) // Update to firestore collection
        .update(updateObject)
        .then(data => {
          console.log(fieldName + " updated");
          als.logUpdate(docId, "communities", fieldName, newValue);
        })
        .catch(error => console.error(fieldName + " update error ", error));
    }
  }

 
}
