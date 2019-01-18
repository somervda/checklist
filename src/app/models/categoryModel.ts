export class CategoryModel {
  public id: string;
  public name: string;
  public description: string;
  public theme: { id: string; name: string };

  constructor(doc?) {
    // Overloaded constructor, either will initialize based on
    // a firestore document being passed , or will initialize to default values
    // console.log("categoryModel constructor doc:", doc);
    if (doc) {
      this.name = doc.data().name;
      this.description = doc.data().description;
      this.id = doc.id;
      this.theme = doc.data().theme;
    } else {
      this.name = "";
      this.description = "";
      this.id = "";
      this.theme = { id: "", name: "" };
    }
  }

  get json() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      theme: this.theme
    };
  }

  dbFieldUpdate(docId: string, fieldName: string, newValue: any, db, als) {
    if (docId && fieldName) {
      let updateObject = {};
      updateObject[fieldName] = newValue;
      db.doc("/categories/" + docId) // Update to firestore collection
        .update(updateObject)
        .then(data => {
          console.log(fieldName + " updated");
          als.logUpdate(docId, "categories", fieldName, newValue);
        })
        .catch(error => console.error(fieldName + " update error ", error));
    }
  }

  get shortDescription() {
    let noHTML = this.description.replace(/<(.|\n)*?>/g, ' ');
    if (noHTML.length> 40) {
      return noHTML.substring(0,40) + "...";
    }
    else {
      return noHTML;
    }
  }
}
