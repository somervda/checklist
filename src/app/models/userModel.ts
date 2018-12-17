export class UserModel {
  public id: string;
  public displayName: string;
  public email: string;
  public lastLogin: Date;
  public communities = {}; // holds map of communities associated with the user

  loadFromObject(data, id) {
    this.id = id; // Use the object ID
    this.displayName = data.displayName;
    this.email = data.email;
    this.lastLogin = data.lastLogin;
    this.communities = data.communities;
  }

  dbFieldUpdate(docId: string, fieldName: string, newValue: any, db) {
    console.log(fieldName + " before Update", docId, newValue);
    let updateObject = {};
    updateObject[fieldName] = newValue;
    db.doc("/users/" + docId) // Update to firestore collection
      .update(updateObject)
      .then(data => console.log(fieldName + " updated"))
      .catch(error => console.log(fieldName + " update error ", error));
  }

  mergeCommunity(id: string, name: string, accessState: CommunityAccessState) {
    // will add the community info if it doen't exist, or update if it does
    if (this.communities) {
      if (this.communities[id]) {
        // Update existing
        this.communities[id].name = name;
        this.communities[id].accessState = accessState;
      } else {
        // Create new
        this.communities[id] = { name: name, accessState: accessState };
      }
    } else {
      console.log("Error - no communities map on user");
    }
  }

  deleteCommunity(id: string) {
    delete this.communities[id];
  }
}

export enum CommunityAccessState {
  member = 0,
  membershipInvited = 1,
  membershipDeclined = 2,
  leader = 10,
  leadershipInvited = 11,
  leadershipDeclined = 12
}
