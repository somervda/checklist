export class UserModel {
  public id: string;
  public displayName: string;
  public email: string;
  public isSystemAdministrator: boolean = false;
  public lastLogin: Date;
  public communities = {}; // holds map of communities associated with the user
  public initialPagePreference: string;

  loadFromObject(doc) {
    this.id = doc.id; // Use the object ID
    this.displayName = doc.data().displayName;
    this.email = doc.data().email;
    this.lastLogin = doc.data().lastLogin;
    this.isSystemAdministrator = doc.data().isSystemAdministrator;
    console.log("userModel loadFromObject", doc.data().communities);
    this.communities = doc.data().communities;
    this.initialPagePreference = doc.data().initialPagePreference;
  }

  dbFieldUpdate(docId: string, fieldName: string, newValue: any, db, als?) {
    console.log(fieldName + " before Update", docId, newValue);
    if (docId && fieldName) {
      let updateObject = {};
      updateObject[fieldName] = newValue;
      db.doc("/users/" + docId) // Update to firestore collection
        .update(updateObject)
        .then(data => {
          // Special case - als not available when called from Auth service
          if (als) {
            als.logUpdate(docId, "users", fieldName, newValue);
          }
          console.log(fieldName + " updated");
        })
        .catch(error => console.error(fieldName + " update error ", error));
    }
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

  public accessStateAsString(accessState: CommunityAccessState): string {
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

  getCommunityDetails(communityId: string) {
    const communityObject = {
      id: communityId,
      name: this.communities[communityId].name,
      accessState: this.communities[communityId].accessState
    };
    return communityObject;
  }

  acceptCommunityInvitation(communityId: string, db, als) {
    // Will change accessState for the community
    // and update the user details and send an update to the
    // backend
    let accessState: CommunityAccessState = this.communities[communityId]
      .accessState;

    if (
      accessState === CommunityAccessState.membershipInvited ||
      accessState === CommunityAccessState.leadershipInvited
    ) {
      if (accessState === CommunityAccessState.membershipInvited) {
        accessState = CommunityAccessState.member;
      }
      if (accessState === CommunityAccessState.leadershipInvited) {
        accessState = CommunityAccessState.leader;
      }
      this.communities[communityId].accessState = accessState;
      this.dbFieldUpdate(
        this.id,
        "communities." + communityId + ".accessState",
        accessState,
        db,
        als
      );
    } else {
      console.error(
        "acceptCommunityInvitation not in invitation state",
        accessState
      );
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
