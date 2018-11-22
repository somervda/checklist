import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

import { SessionStore } from "./session.store.service";
import { ToastrService } from "ngx-toastr";

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';



@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private sessionStore: SessionStore,
    private toastr: ToastrService,
    private afAuth : AngularFireAuth
  ) {}

  login() {
    
  }

  logout() {
    sessionStorage.removeItem("profile");
    sessionStorage.removeItem("token");
    this.sessionStore.clearRoles();
    console.log("Auth logged out, local storage cleared");
    this.router.navigate(["/"]);
    this.toastr.success("Signed out");
  }

  isAuthenticated() {
    return this.afAuth.auth.currentUser;
  }
}
