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

    // app_metadata must not be changable so store that as the encoded accessToken

    

    public isInRole(roleName) {
     
        if (localStorage.getItem("accessToken"))
        {
            const decodedAccessToken = helper.decodeToken(localStorage.getItem("accessToken"));
            console.log("decodedAccessToken",decodedAccessToken);
            if (decodedAccessToken[environment.auth0.apiNameSpace  + '/roles'])
                {
                const roles: String[] = decodedAccessToken[environment.auth0.apiNameSpace  + '/roles'];
                console.log("roles",roles);
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