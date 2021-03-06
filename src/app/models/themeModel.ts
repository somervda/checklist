export class ThemeModel {
  public id: string;
  public name: string;
  public description: string;

  constructor(doc?) {
    // Overloaded constructor, either will initialize based on
    // a firestore document being passed , or will initialize to default values
    //console.log("themeModel constructor doc:", doc);
    if (doc) {
      this.name = doc.data().name;
      this.description = doc.data().description;
      this.id = doc.id;
    } else {
      this.name = "";
      this.description = "";
      this.id = "";
    }
  }

  get json() {
    return {
      id: this.id,
      name: this.name,
      description: this.description
    };
  }

  dbFieldUpdate(docId: string, fieldName: string, newValue: any, db, als) {
    if (docId && fieldName) {
      let updateObject = {};
      updateObject[fieldName] = newValue;
      db.doc("/themes/" + docId) // Update to firestore collection
        .update(updateObject)
        .then(data => {
          console.log(fieldName + " updated");
          als.logUpdate(docId, "themes", fieldName, newValue);
        })
        .catch(error => console.error(fieldName + " update error ", error));
    }
  }
}
