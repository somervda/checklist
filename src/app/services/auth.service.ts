import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

import { JwtHelperService } from "@auth0/angular-jwt";
import Auth0Lock from "auth0-lock";
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
      audience: `https://${environment.auth0.domain}/userinfo`,
      params: {
        scope: "openid profile"
      }
    },
    autoclose: true,
    oidcConformant: true
  };

  lock = new Auth0Lock(
    environment.auth0.clientId,
    environment.auth0.domain,
    this.auth0Options
  );

  constructor(private router: Router) {
    /*     this.lock.on("authenticated", (authResult: any) => {
          console.log("Nice, it worked!");
          this.router.navigate(["/"]); // go to the home route
          // ...finish implementing authenticated
        });
    
        this.lock.on("authorization_error", error => {
          console.log("something went wrong", error);
        }); */
    console.log("Auth constructor", localStorage.getItem("token"));
    this.lock.on("authenticated", (authResult: any) => {
      this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) {
          throw new Error(error);
        }

        localStorage.setItem("token", authResult.idToken);
        localStorage.setItem("profile", JSON.stringify(profile));
        console.log("Auth logged in", localStorage.getItem("token"));
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
    console.log("Auth logged out, local storage cleared");
  }

  isAuthenticated() {
    if (localStorage.getItem("token")) {
      // Manually checking expiry date using javascript
      // until helper function works. See https://github.com/auth0/angular2-jwt/issues/557
      //console.log("Auth isAuthenticated token", localStorage.getItem("token"));
      const isAuth = helper.isTokenExpired(localStorage.getItem("token"));
      const expDate = helper.getTokenExpirationDate(
        localStorage.getItem("token")
      );
      //console.log("Auth isAuthenticated isAuth", isAuth);
      //console.log("Auth isAuthenticated expDate", expDate);
      const dateNow = new Date();
      //console.log("Auth isAuthenticated dateTest", expDate > dateNow);
      return expDate > dateNow;
    }
    return false;
  }
}
