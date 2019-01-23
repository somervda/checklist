export class ActivityModel {
    public id: string;
    public name: string;
    // One or other will be present depending on if parent is 
    // a category or a community
    public categoryId : string;
    public communityId : string;
  
    constructor(doc?) {
      // Overloaded constructor, either will initialize based on
      // a firestore document being passed , or will initialize to default values
      // console.log("activityModel constructor doc:", doc);
      if (doc) {
        this.name = doc.data().name;
        this.id = doc.id;
        if (doc.data().categoryId) {
        this.categoryId = doc.data().categoryId;
        }
        if (doc.data().communityId) {
        this.communityId = doc.data().communityId;
        }
      } else {
        this.name = "";
        this.id = "";
      }
    }
    
    get json() {
      return {
        id: this.id,
        name: this.name,
        categoryId: this.categoryId,
        communityId: this.communityId
      };
    }

    get parent() : string {
      if (this.categoryId) {
      return "category";
      }
      if (this.communityId) {
        return "community";
        }
        return "";
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