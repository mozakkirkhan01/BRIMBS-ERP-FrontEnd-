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
  selector: 'app-fee-registration-head',
  templateUrl: './fee-registration-head.component.html',
  styleUrls: ['./fee-registration-head.component.css']
})
export class FeeRegistrationHeadComponent {
  dataLoading: boolean = false
  FeeRegistrationHeadList: any[] = []
  FeeRegistrationHead: any = {};
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  isSubmitted = false;

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService:LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getFeeRegistrationHeadList();
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
    this.FeeRegistrationHead = {}
    this.isSubmitted = false
  }

  getFeeRegistrationHeadList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FeeRegistrationHead)).toString()
    }
    this.dataLoading = true
    this.service.getFeeRegistrationHeadList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.FeeRegistrationHeadList = response.FeeRegistrationHeadList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching Fee Registration Head records")
      this.dataLoading = false

    }))
  }

  saveFeeRegistrationHead() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({
        FeeRegistrationHeadList: this.FeeRegistrationHeadList,
        CreatedBy: this.staffLogin.StaffLoginId
      })).toString()
    }
    this.dataLoading = true;
    this.service.saveFeeRegistrationHead(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success("Heads added successfully")
        this.resetForm()
        this.getFeeRegistrationHeadList()
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
