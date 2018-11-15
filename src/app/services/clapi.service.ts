import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';


// checklist rest api interface service , used for calling the rest based api services in the cloud

@Injectable({
  providedIn: 'root'
})
export class ClapiService {

  constructor(private http: HttpClient) { }

  getMyChecklists(userid: string) {
    // Get all checklists I have rights to access based on the userid
    // userid selection not yet implemented
    // Added the dummy option of view=summary
    // json-server does not support this but when I write the real service this will 
    // return a smaller, summarized version of the selected checklists for use in listings 
    console.log("ClapiService getMyCheckLists");
    return this.http.get(environment.clapiurl + "/checkLists?view=summary");
  }

  getChecklist(checklistid: number) {
    // Get all checklists I have rights to access based on the userid
    // userid selection not yet implemented
    console.log("ClapiService getChecklist");
    return this.http.get(environment.clapiurl + "/checkList/" + checklistid);
  }


}
