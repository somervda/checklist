import { Component, OnInit } from "@angular/core";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {


  constructor(private toastr: ToastrService) { }


  ngOnInit() {
    //this.toastr.success('This is a test of using the toastr service in the oninit function of the home page', 'Test Notification');
  }
}
