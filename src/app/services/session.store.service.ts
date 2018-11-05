import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "../../environments/environment";
const helper = new JwtHelperService();

/* Used to store session data for the lifetime of the app

Usage: Inject service to */

@Injectable()
export class SessionStore {
    // Store session information in LocalStorage 
    // this will preserve the information 

    // app_metadata must not be changeable on the client so store that as the encoded accessToken
    // this includes role info (it would be bad if role for a user can be changed by the user)
    // user_metadata is ok to be stored in plain text in local storage
  

    public isInRole(roleName) {
     
        if (localStorage.getItem("accessToken"))
        {
            const decodedAccessToken = helper.decodeToken(localStorage.getItem("accessToken"));
            if (decodedAccessToken[environment.auth0.apiNameSpace  + '/roles'])
                {
                const roles: String[] = decodedAccessToken[environment.auth0.apiNameSpace  + '/roles'];
                return (roles.indexOf(roleName) > -1);
                }
        }
        return false;
    }

    public clearRoles() {
        localStorage.removeItem("accessToken");
    }

    public setRoles(accessToken:string) {
        localStorage.setItem("accessToken",accessToken);
    }


}