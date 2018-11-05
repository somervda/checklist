import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";


import Auth0Lock from "auth0-lock";
import { SessionStore } from "./session.store.service";
import { JwtHelperService } from "@auth0/angular-jwt";
const helper = new JwtHelperService();

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
        localStorage.setItem("token", authResult.idToken);
        localStorage.setItem("profile", JSON.stringify(profile));
        console.log("Auth logged in", localStorage.getItem("token"));

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
    localStorage.removeItem("profile");
    localStorage.removeItem("token");
    this.sessionStore.clearRoles();
    console.log("Auth logged out, local storage cleared");
  }

  isAuthenticated() {
    if (localStorage.getItem("token")) {
      // Manually checking expiry date using javascript
      // until helper function works. See https://github.com/auth0/angular2-jwt/issues/557
      //console.log("Auth isAuthenticated token", localStorage.getItem("token"));
      const isAuth = helper.isTokenExpired(localStorage.getItem("token"));

      //console.log("Auth isAuthenticated decodedToken", decodedToken["name"]);
      const expDate = helper.getTokenExpirationDate(
        localStorage.getItem("token")
      );
      //console.log("Auth isAuthenticated isAuth", isAuth);
      //console.log("Auth isAuthenticated expDate", expDate);
      const dateNow = new Date();
      //console.log("Auth isAuthenticated dateTest", expDate > dateNow);

      // Store users picture to show on navigationBar when signed in
      if (expDate > dateNow) {
        const decodedToken = helper.decodeToken(localStorage.getItem("token"));
        if (decodedToken["picture"]) this.picture = decodedToken["picture"];
      }

      return expDate > dateNow;
    }
    return false;
  }
}
