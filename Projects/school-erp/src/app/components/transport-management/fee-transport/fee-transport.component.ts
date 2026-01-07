import { Component } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LocalService } from '../../../utils/local.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LoadDataService } from '../../../utils/load-data.service';
import { Router } from '@angular/router';
import { Status } from '../../../utils/enum';
declare var $: any

@Component({
  selector: 'app-fee-transport',
  templateUrl: './fee-transport.component.html',
  styleUrls: ['./fee-transport.component.css']
})
export class FeeTransportComponent {

  dataLoading: boolean = false
  FeeTransportList: any = []
  FeeTransport: any = {}
  isSubmitted = false
  StatusList: any[] = this.loadData.GetEnumList(Status);
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  TransportDurationList: any[] = []
  TransportDurationObj: any = {}
  BatchList: any[] = []
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;


  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p
  }

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
    this.getTransportDurationList();
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
    this.FeeTransport = {
      Status:Status.Active
    }
    this.FeeTransportList = [];
    this.isSubmitted = false;
  }

  getFeeTransportList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FeeTransport)).toString()
    }
    this.dataLoading = true
    this.service.getFeeTransportList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.FeeTransportList = response.BatchList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false
    }))
  }

  saveFeeTransport(form: NgModel) {
    this.isSubmitted = true

    var FeeTransportList: any[] = [];
    this.FeeTransportList.forEach((e1: any) => {
      e1.FeeTransportList.forEach((e2: any) => {
        e2.TransportBatchId = e1.TransportBatchId;
        FeeTransportList.push(e2);
      });
    });
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({
        StaffLoginId: this.staffLogin.StaffLoginId,
        FeeTransportList: FeeTransportList
      })).toString()
    }
    this.dataLoading = true
    this.service.saveFeeTransport(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.FeeTransport.FeeTransportId > 0) {
          this.toastr.success("FeeTransport Updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("FeeTransport added successfully")
        }
        this.resetForm()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  editFeeTransport(obj: any) {
    this.resetForm()
    this.FeeTransport = obj
  }

  getTransportDurationList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getTransportDurationList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.TransportDurationList = response.TransportDurationList;

      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

}
