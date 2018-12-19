export class UserModel {
  public id: string;
  public displayName: string;
  public email: string;
  public isSystemAdministrator: boolean = false;
  public lastLogin: Date;
  public communities = {}; // holds map of communities associated with the user

  loadFromObject(data, id) {
    this.id = id; // Use the object ID
    this.displayName = data.displayName;
    this.email = data.email;
    this.lastLogin = data.lastLogin;
    this.isSystemAdministrator = data.isSystemAdministrator;
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

  accessStateAsString(accessState: CommunityAccessState): string {
    switch (accessState) {
      case CommunityAccessState.member:
        return "Member";
      case CommunityAccessState.membershipInvited:
        return "Invited to be a member";
      case CommunityAccessState.membershipDeclined:
        return "Declined Member";
      case CommunityAccessState.leader:
        return "Leader";
      case CommunityAccessState.leadershipInvited:
        return "Invited to be leader";
      case CommunityAccessState.leadershipDeclined:
        return "Declined leadership";
      default:
        return "Unknown";
    }
  }

  // Getters and Setters

  get communitiesAsArray(): any[] {
    // for use in ng-datatable etc
    // console.log("communitiesAsArray");
    let communityArray = [];
    for (let community in this.communities) {
      const communityObject = {
        id: community,
        name: this.communities[community].name,
        accessState: this.communities[community].accessState
      };

      communityArray.push(communityObject);
    }
    // console.log("communitiesAsArray:", communityArray);
    return communityArray;
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