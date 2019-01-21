import { AuditlogService } from "./../services/auditlog.service";
import { CommunityAccessState } from "./../models/userModel";
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  EventEmitter,
  Output,
  NgZone
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../services/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-communitymanagermodal",
  templateUrl: "./communitymanagermodal.component.html",
  styleUrls: ["./communitymanagermodal.component.scss"]
})
export class CommunitymanagermodalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() name: string;
  @Input() accessState: CommunityAccessState;
  @Output() categoryAction = new EventEmitter();
  CommunityAccessState = CommunityAccessState;

  selectedAction = "";
  invitee = "";

  constructor(
    private modalService: NgbModal,
    public auth: AuthService,
    private db: AngularFirestore,
    private als: AuditlogService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}

  open(content) {
    this.selectedAction = "";
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(result => {
        if (result == "Confirm") {
          switch (this.selectedAction) {
            case "accept":
              this.acceptInvitation();
              break;
            case "reject":
            case "removeAsLeader":
            case "removeAsMember":
              this.removeCommunity();
              break;
            case "sendMemberInvitation":
              this.inviteToCommunity(CommunityAccessState.membershipInvited);
              break;
            case "sendLeaderInvitation":
              this.inviteToCommunity(CommunityAccessState.leadershipInvited);
              break;
            default:
              console.error("Unexpected selectedAction:", this.selectedAction);
              break;
          }
          this.categoryAction.emit();
        }
      });
  }

  acceptInvitation() {
    console.log("acceptInvitation");
    this.auth.user.acceptCommunityInvitation(this.id, this.db, this.als);
  }

  removeCommunity() {
    console.log("removeCommunity");
    this.auth.user.removeCommunity(this.id, this.db, this.als, this.toastr);
  }

  inviteToCommunity(accessState: CommunityAccessState) {
    console.log("inviteToCommunity");
    this.auth.user.inviteToCommunity(
      this.id,
      this.invitee,
      accessState,
      this.db,
      this.als,
      this.toastr
    );
  }

  ngOnDestroy() {}
}
