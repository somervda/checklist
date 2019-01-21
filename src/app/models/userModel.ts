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

  constructor() {}

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
      case CommunityAccessState.leader:
        return "Leader";
      case CommunityAccessState.leadershipInvited:
        return "Invited to be leader";
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

  removeDowngradeCommunity(communityId: string, db, als, toastr) {
    let accessState: CommunityAccessState = this.communities[communityId]
      .accessState;

    if (accessState !== CommunityAccessState.leader) {
      // remove the specific community when not the leader
      delete this.communities[communityId];
      this.dbFieldUpdate(this.id, "communities", this.communities, db, als);
    } else {
      // Leadership can only be removed when there are other leaders for the community
      // Leadership removal drops the user back to being a member
      const communityNode = "communities." + communityId + ".accessState";
      db.collection("users", ref =>
        ref.where(communityNode, "==", CommunityAccessState.leader)
      )
        .get()
        .toPromise()
        .then(data => {
          console.log("removeCommunity - make leader a member", data);
          if (data.docs.length > 1) {
            // Ok to reduce leader to memeber
            this.communities[communityId].accessState =
              CommunityAccessState.member;
            this.dbFieldUpdate(
              this.id,
              "communities",
              this.communities,
              db,
              als
            );
            console.log(
              "removeCommunity after leader to member",
              this.communities
            );
            // Special for leader removal - route to home because
            // refresh of communities is delayed due to the asynchronous call
          } else {
            toastr.error(
              "Cant remove your leadership role when you are the only leader for this community."
            );
          }
        });
    }
  }

  inviteToCommunity(
    communityId: string,
    inviteeEmail: string,
    inviteeAccessState: CommunityAccessState,
    db,
    als,
    toastr
  ) {
    // Rules
    // User doing the invite must be a community leader
    // Invitee must not be in the community already
    // Invitee must be a member before being invited to be a leader

    let community: { name: string; accessState: CommunityAccessState } = this
      .communities[communityId];

    if (community.accessState !== CommunityAccessState.leader) {
      toastr.error("You must be a community leader to invite other members");
    } else {
      db.collection("users", ref => ref.where("email", "==", inviteeEmail))
        .get()
        .toPromise()
        .then(data => {
          console.log("inviteToCommunity data", data);
          if (data.docs.length != 1) {
            toastr.info("Invitee with matching email not found.");
          } else {
            let invitee = new UserModel();
            invitee.loadFromObject(data.docs[0]);
            console.log("inviteToCommunity invitee", invitee);
            if (inviteeAccessState == CommunityAccessState.membershipInvited) {
              if (invitee.communities[communityId]) {
                toastr.error(
                  "Invitee is already member of this community, or has been invited to be  member of this community."
                );
                return;
              }
              // add a membership invite to the invitees communities
              invitee.communities[communityId] = {
                name: community.name,
                accessState: CommunityAccessState.membershipInvited
              };
              invitee.dbFieldUpdate(
                invitee.id,
                "communities",
                invitee.communities,
                db,
                als
              );
            }
            if (inviteeAccessState == CommunityAccessState.leadershipInvited) {
              console.log("inviteToCommunity invite leader");
              if (
                !invitee.communities[communityId] ||
                invitee.communities[communityId].accessState !=
                  CommunityAccessState.member
              ) {
                console.log(
                  "inviteToCommunity not leader",
                  invitee.communities[communityId].accessState
                );
                toastr.error(
                  "Invitee must already be a community member before they can be invited to be a leader of the community "
                );
                return;
              }
              if (community.accessState != CommunityAccessState.leader) {
                toastr.error(
                  "You must already be a leader before can invite another member to be a leader of the community "
                );
                return;
              }
              // Update a membership invite to the invitees communities
              invitee.communities[communityId] = {
                name: community.name,
                accessState: CommunityAccessState.leadershipInvited
              };
              invitee.dbFieldUpdate(
                invitee.id,
                "communities",
                invitee.communities,
                db,
                als
              );
              toastr.info("Leader invite was sent to " + invitee.email);
            }
          }
        });
    }
  }

  // Getters and Setters

  get communitiesAsArray(): [{id:string,name:string, accessState: CommunityAccessState}] {
    // for use in ng-datatable etc
    // console.log("communitiesAsArray");
    let communityArray = [];
    for (let community in this.communities) {
      const communityObject = {
        id: community as string,
        name: this.communities[community].name as string,
        accessState: this.communities[community].accessState as CommunityAccessState
      };

      communityArray.push(communityObject);
    }
    // console.log("communitiesAsArray:", communityArray);
    return communityArray;
  }

  get accessibleCommunitiesAsArray(): any[] {
    // for use in ng-datatable etc
    // console.log("communitiesAsArray");
    let communityArray = [];
    for (let community in this.communitiesAsArray) {
      if (community.accessState == CommunityAccessState.member
        )
            communityArray.push(community);
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
  leader = 10,
  leadershipInvited = 11
}
