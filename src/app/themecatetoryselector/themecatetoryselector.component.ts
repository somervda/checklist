import { Component, OnInit, Input } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-themecatetoryselector",
  templateUrl: "./themecatetoryselector.component.html",
  styleUrls: ["./themecatetoryselector.component.scss"]
})
export class ThemecatetoryselectorComponent implements OnInit {
  @Input() theme: { themeId: string; name: string };
  @Input() category: { categoryId: string; name: string };

  closeResult: string;

  constructor(private modalService: NgbModal) {}

  ngOnInit() {}

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        result => {
          this.closeResult = `Closed with: ${result}`;
        },
        reason => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
}
