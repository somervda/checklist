import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

/* Used to store session data for the lifetime of the app

Usage: Inject service to */

@Injectable()
export class SessionStore {
  // Store session information in sessionStorage
  // this will preserve the information

  // app_metadata must not be changeable on the client so store that as the encoded accessToken
  // this includes role info (it would be bad if role for a user can be changed by the user)
  // user_metadata is ok to be stored in plain text in local storage

  public isInRole(roleName) {
    return false;
  }

  public clearStorage() {
    sessionStorage.clear();
  }

  public setRoles(accessToken: string) {
    sessionStorage.setItem("accessToken", accessToken);
  }
  public setUserPicture(picture: string) {
    sessionStorage.setItem("picture", picture);
  }

  public userPicture() {
    return sessionStorage.getItem("picture");
  }
}
