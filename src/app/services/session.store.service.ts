import { Injectable } from '@angular/core';

/* Used to store session data for the lifetime of the app

Usage: Inject service to */

@Injectable()
export class SessionStore {

    private roles: String[] = [];

    public isInRole(roleName) {
        return (this.roles.indexOf(roleName) > -1);
    }

    public clearRoles() {
        this.roles = [];
    }

    public setRoles(roles: string[]) {
        this.roles = roles;
    }


}