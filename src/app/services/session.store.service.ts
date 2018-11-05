import { Injectable } from '@angular/core';

/* Used to store session data for the lifetime of the app

Usage: Inject service to */

@Injectable()
export class SessionStore {

    roles: String[] = [];

    public isInRole(roleName) {
        if (this.roles)
            return (this.roles.indexOf(roleName) >-1);
        return false;
    }


}