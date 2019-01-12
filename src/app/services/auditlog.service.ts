import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "./auth.service";
import { AuditLogModel } from "../models/auditLogModel";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class AuditlogService {
  constructor(
    private db: AngularFirestore,
    private auth: AuthService
    // , private auditLog: AuditLogModel
  ) {}

  logUpdate(docId, collection, fieldName, newValue) {
    // Write changes to an auditlogentry
    if (environment.auditLog && docId) {
      const auditLogEntry = new AuditLogModel({
        docId: docId,
        collection: collection,
        fieldName: fieldName,
        newValue: newValue,
        uid: this.auth.getUserUID
      });

      this.db
        .collection("log")
        .add(auditLogEntry.json)
        .then(docRef => console.log("Audit Written", docRef))
        .catch(error => console.error("Audit Log Write Error", error));
    }
  }
}
