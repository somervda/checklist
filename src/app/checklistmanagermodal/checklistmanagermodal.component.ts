import { ChecklistStatus } from "./../models/checklistModel";
import { CommunityAccessState } from "./../models/userModel";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../services/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuditlogService } from "../services/auditlog.service";
import { ToastrService } from "ngx-toastr";
import { ChecklistModel } from "../models/checklistModel";
import { defineBase } from "@angular/core/src/render3";
import { promise } from 'protractor';

@Component({
  selector: "app-checklistmanagermodal",
  templateUrl: "./checklistmanagermodal.component.html",
  styleUrls: ["./checklistmanagermodal.component.scss"]
})
export class ChecklistmanagermodalComponent implements OnInit {
  @Input() checklistId: string;
  @Output() categoryAction = new EventEmitter();

  checklist: ChecklistModel;

  selectedAction: string;
  title: string;
  copyAsTemplate = false;

  ChecklistStatus = ChecklistStatus;

  constructor(
    private modalService: NgbModal,
    public auth: AuthService,
    private db: AngularFirestore,
    private als: AuditlogService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // console.log("checklistmanagermodal onInit");
    // this.db
    //   .doc("checklists/" + this.checklistId)
    //   .get()
    //   .toPromise()
    //   .then(doc => {
    //     this.checklist = new ChecklistModel(doc);
    //     console.log("checklistmanagermodal onInit",this.checklistId ,  this.checklist);
    //   })
    //   .catch(error => console.error("checklistmanagermodal oninit", error));
  }



  open(content) {
    this.selectedAction = "";
    this.db
    .doc("checklists/" + this.checklistId)
    .get()
    .toPromise()
    .then(doc => {
      this.checklist = new ChecklistModel(doc);
      console.log("checklistmanagermodal open",this.checklistId ,  this.checklist);
      this.title = this.checklist.title;
      console.log("open checklist", this.checklist);

      this.modalService
        .open(content, { ariaLabelledBy: "modal-basic-title" })
        .result.then(result => {
          if (result == "Confirm") {
            switch (this.selectedAction) {
              case "copy":
                this.copy();
                break;
              case "publish":
                this.publish();
                break;
              case "complete":
                this.complete();
                break;
              case "active":
                this.active();
                break;
              case "delete":
                this.delete();
                break;
              default:
                console.error("Unexpected Action:", this.selectedAction);
                break;
            }
            this.categoryAction.emit();
        }
      });
    })
    .catch(error => console.error("checklistmanagermodal getChecklist", error));
  }

  copy() {
    console.log("copy");
    const newChecklistsId = this.checklist.copy(
      this.title,
      { id: "", name: "" },
      this.copyAsTemplate,
      { uid: this.auth.user.id, displayName: this.auth.user.displayName },
      this.db,
      this.als
    );
  }

  isInCommunity() {
    // Checks to see if user is a; community member, leader or leader invitee
    if (this.checklist.community && this.checklist.community.id != "") {
      const userCommunity = this.auth.user.getCommunityDetails(
        this.checklist.community.id
      );
      if (
        userCommunity.accessState == CommunityAccessState.leader ||
        userCommunity.accessState == CommunityAccessState.member ||
        userCommunity.accessState == CommunityAccessState.leadershipInvited
      )
        return true;
    }

    return false;
  }

  isCommunityLeader() {
    // Checks to see if user is a; community leader
    if (this.checklist.community && this.checklist.community.id != "") {
      const userCommunity = this.auth.user.getCommunityDetails(
        this.checklist.community.id
      );
      if (userCommunity.accessState == CommunityAccessState.leader) return true;
    }

    return false;
  }

  publish() {
    console.log("publish");
    // Restricted version of copy, always copies as a template 
    // to the Public Community
    const newChecklistsId = this.checklist.copy(
      this.title,
      { id: "PUBLIC", name: "Public Templates" },
      true,
      { uid: this.auth.user.id, displayName: this.auth.user.displayName },
      this.db,
      this.als
    );
  }

  complete() {
    console.log("status complete");
    this.checklist.dbFieldUpdate(this.checklistId,"status",ChecklistStatus.Complete,this.db,this.als);
  }

  active() {
    console.log("active");
    this.checklist.dbFieldUpdate(this.checklistId,"status",ChecklistStatus.Active,this.db,this.als);
  }

  delete() {
    console.log("delete");
    if (!confirm("Confirm that this checklist should be deleted.")) return;
    console.log("delete confirmed");
    this.checklist.dbFieldUpdate(this.checklistId,"status",ChecklistStatus.Deleted,this.db,this.als);
  }

  ngOnDestroy() {}
}
