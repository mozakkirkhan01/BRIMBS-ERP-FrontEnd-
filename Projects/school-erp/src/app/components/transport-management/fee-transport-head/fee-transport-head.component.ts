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
  selector: 'app-fee-transport-head',
  templateUrl: './fee-transport-head.component.html',
  styleUrls: ['./fee-transport-head.component.css']
})

export class FeeTransportHeadComponent {
  dataLoading: boolean = false
  FeeTransportHeadList: any[] = []
  FeeTransportHead: any = {};
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
    this.getFeeTransportHeadList();
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
  }  resetForm() {
    this.FeeTransportHead = {}
    this.isSubmitted = false
  }

  getFeeTransportHeadList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FeeTransportHead)).toString()
    }
    this.dataLoading = true
    this.service.getFeeTransportHeadList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.FeeTransportHeadList = response.FeeTransportHeadList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching Fee Transport Head records")
      this.dataLoading = false

    }))
  }


  saveFeeTransportHead() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({
        FeeTransportHeadList: this.FeeTransportHeadList,
        CreatedBy: this.staffLogin.StaffLoginId
      })).toString()
    }

    this.dataLoading = true;
    this.service.saveFeeTransportHead(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success("Heads updated added successfully")
        this.resetForm()
        this.getFeeTransportHeadList()
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
