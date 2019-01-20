import { CommunityAccessState } from "./../models/userModel";
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  EventEmitter,
  Output
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../services/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";

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

  constructor(
    private modalService: NgbModal,
    public auth: AuthService,
    private db: AngularFirestore
  ) {}

  ngOnInit() {}

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(result => {
        if (result == "Confirm") {
          this.categoryAction.emit();
        }
      });
  }

  ngOnDestroy() {}
}
