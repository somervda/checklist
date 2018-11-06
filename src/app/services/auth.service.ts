import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";


import Auth0Lock from "auth0-lock";
import { SessionStore } from "./session.store.service";
import { JwtHelperService } from "@auth0/angular-jwt";
const helper = new JwtHelperService();

/*
This service manages the authentication activity with Auth0 and manages the authentication state.

Note: Password authentication on safari causes a problem because
 of default setting to the "Third part tracking" setting. 
 See https://community.auth0.com/t/unable-to-configure-verification-page-error-on-hosted-login/9214/37 
 for longer discussion but seems to indicate that moving to a hosted page will be better.

*/

@Injectable()
export class AuthService {
  auth0Options = {
    theme: {
      logo: "assets/images/hig-60.png",
      primaryColor: "	#006f00"
    },
    // See options at https://github.com/auth0/lock/blob/master/src/i18n/en.js
    languageDictionary: {
      title: "ourCheckLists.com"
    },
    auth: {
      redirectUrl: environment.auth0.callbackURL,
      responseType: "token id_token",
      audience: environment.auth0.audience,
      params: {
        scope: "openid profile"
      }
    },
    additionalSignUpFields: [
      {
        name: "shortName",
        placeholder: "Short Name",
        validator: function (shortName) {
          return {
            valid: shortName.length < 20,
            hint: "Short name must not exceed 20 chars."
          };
        }

      }

    ],
    autoclose: true,
    oidcConformant: true
  };

  lock = new Auth0Lock(
    environment.auth0.clientId,
    environment.auth0.domain,
    this.auth0Options
  );

  picture = "";

  constructor(private router: Router, private sessionStore: SessionStore) {
    this.lock.on("authenticated", (authResult: any) => {
      this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) {
          throw new Error(error);
        }
        //console.log("Auth AuthResult",authResult);
        sessionStorage.setItem("token", authResult.idToken);
        sessionStorage.setItem("profile", JSON.stringify(profile));
        console.log("Auth logged in", sessionStorage.getItem("token"));

        if (authResult.accessToken) {
          sessionStore.setRoles(authResult.accessToken);
        }

        this.router.navigate(["/"]);
      });
    });
  }

  login() {
    this.lock.show();
  }

  logout() {
    sessionStorage.removeItem("profile");
    sessionStorage.removeItem("token");
    this.sessionStore.clearRoles();
    console.log("Auth logged out, local storage cleared");
  }

  isAuthenticated() {
    if (sessionStorage.getItem("token")) {
      // Manually checking expiry date using javascript
      // until helper function works. See https://github.com/auth0/angular2-jwt/issues/557
      //console.log("Auth isAuthenticated token", sessionStorage.getItem("token"));
      const isAuth = helper.isTokenExpired(sessionStorage.getItem("token"));

      //console.log("Auth isAuthenticated decodedToken", decodedToken["name"]);
      const expDate = helper.getTokenExpirationDate(
        sessionStorage.getItem("token")
      );
      //console.log("Auth isAuthenticated isAuth", isAuth);
      //console.log("Auth isAuthenticated expDate", expDate);
      const dateNow = new Date();
      //console.log("Auth isAuthenticated dateTest", expDate > dateNow);

      // Store users picture to show on navigationBar when signed in
      if (expDate > dateNow) {
        const decodedToken = helper.decodeToken(sessionStorage.getItem("token"));
        if (decodedToken["picture"]) this.picture = decodedToken["picture"];
      }

      return expDate > dateNow;
    }
    return false;
  }
}
