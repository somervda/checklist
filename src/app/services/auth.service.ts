import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

import { JwtHelperService } from "@auth0/angular-jwt";
import Auth0Lock from "auth0-lock";

@Injectable()
export class AuthService {
  auth0Options = {
    theme: {
      logo: "assets/images/mcl-big-58x60.png",
      primaryColor: "#DFA612"
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
    this.lock.on("authenticated", (authResult: any) => {
      console.log("Nice, it worked!");
      this.router.navigate(["/"]); // go to the home route
      // ...finish implementing authenticated
    });

    this.lock.on("authorization_error", error => {
      console.log("something went wrong", error);
    });
  }

  login() {
    this.lock.show();
  }

  logout() {
    // ...implement logout
  }

  isAuthenticated() {
    // ...implement logout
  }
}
