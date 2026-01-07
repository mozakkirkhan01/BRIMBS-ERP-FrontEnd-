import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LocalService } from '../../../utils/local.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LoadDataService } from '../../../utils/load-data.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-fee-hostel-head',
  templateUrl: './fee-hostel-head.component.html',
  styleUrls: ['./fee-hostel-head.component.css']
})

export class FeeHostelHeadComponent {
  dataLoading: boolean = false
  FeeHostelHeadList: any[] = []
  FeeHostelHead: any = {};
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  isSubmitted = false;

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getFeeHostelHeadList();
  }
  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url,StaffLoginId:this.staffLogin.StaffLoginId })).toString()
    }
    this.dataLoading = true
    this.service.validiateMenu(obj).subscribe((response: any) => {
      this.action = this.loadData.validiateMenu(response, this.toastr, this.router)
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }
  resetForm() {
    this.FeeHostelHead = {}
    this.isSubmitted = false
  }

  getFeeHostelHeadList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FeeHostelHead)).toString()
    }
    this.dataLoading = true
    this.service.getFeeHostelHeadList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.FeeHostelHeadList = response.FeeHostelHeadList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching Fee Hostel Head records")
      this.dataLoading = false

    }))
  }


  saveFeeHostelHead() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({
        FeeHostelHeadList: this.FeeHostelHeadList,
        CreatedBy: this.staffLogin.StaffLoginId
      })).toString()
    }

    this.dataLoading = true;
    this.service.saveFeeHostelHead(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success("Heads updated added successfully")
        this.resetForm()
        this.getFeeHostelHeadList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }


}
