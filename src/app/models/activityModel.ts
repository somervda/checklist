export class ActivityModel {
    public id: string;
    public name: string;
    public category: { id: string; name: string };
  
    constructor(doc?) {
      // Overloaded constructor, either will initialize based on
      // a firestore document being passed , or will initialize to default values
      // console.log("categoryModel constructor doc:", doc);
      if (doc) {
        this.name = doc.data().name;
        this.id = doc.id;
        this.category = doc.data().category;
      } else {
        this.name = "";
        this.id = "";
        this.category = { id: "", name: "" };
      }
    }
    
    get json() {
      return {
        id: this.id,
        name: this.name,
        category: this.category
      };
    }
  
    dbFieldUpdate(docId: string, fieldName: string, newValue: any, db, als) {
      if (docId && fieldName) {
        const updateObject = {};
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
  }