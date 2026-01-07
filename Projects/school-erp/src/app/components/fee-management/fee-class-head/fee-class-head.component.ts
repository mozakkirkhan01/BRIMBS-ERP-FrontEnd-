import { Component,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LocalService } from '../../../utils/local.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LoadDataService } from '../../../utils/load-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fee-class-head',
  templateUrl: './fee-class-head.component.html',
  styleUrls: ['./fee-class-head.component.css']
})
export class FeeClassHeadComponent {

  dataLoading: boolean = false
  MonthList: any[] = []
  FeeClassHead: any = {}
  isSubmitted = false
  StatusList: any[] = []
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  ClassList: any[] = []
  PupilTypeList: any[] = [];
  ClassTypeList: any[] = [];
  SessionList: any[] = [];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  FilterModel: any = {};
  RowChangesMessage = ConstantData.RowChangesMessage;

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
    private localService:LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getClassList();
    this.getPupilTypeList();
    this.getSessionList();
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

  @ViewChild('formFeeClassHead') formFeeClassHead: NgForm;
  resetForm() {
    this.FeeClassHead = {};
    if (this.formFeeClassHead) {
      this.formFeeClassHead.control.markAsPristine();
      this.formFeeClassHead.control.markAsUntouched();
    }
  }

  changeSelection(index: number, head: any) {
    if (index == 0 && this.FilterModel.isChangeAll) {
      this.MonthList.forEach(x1 => x1.FeeClassHeadList.forEach((x2: any) => {
        if (x2.HeadId == head.HeadId) {
          x2.IsSelected = head.IsSelected;
        }
      }));
    }
  }

  getClassList() {
    var obj = {}
    this.dataLoading = true
    this.service.getClassList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.ClassList = response.ClassList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  getSessionList() {
    var obj = {}
    this.dataLoading = true
    this.service.getSessionList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.SessionList = response.SessionList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  getPupilTypeList() {
    var obj = {}
    this.dataLoading = true
    this.service.getPupilTypeList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.PupilTypeList = response.PupilTypeList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  getAllFeeClassHeadList() {
    this.isSubmitted = true;
    this.formFeeClassHead.control.markAllAsTouched();
    if (this.formFeeClassHead.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    var request:RequestModel = {
      request:this.localService.encrypt(JSON.stringify(this.FeeClassHead))
    }
    this.dataLoading = true
    this.service.getAllFeeClassHeadList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.MonthList = response.MonthList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  saveFeeClassHead() {
    this.isSubmitted = true;
    this.formFeeClassHead.control.markAllAsTouched();
    if (this.formFeeClassHead.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    var FeeClassHeadList: any[] = [];
    this.MonthList.forEach((e1: any) => {
      e1.FeeClassHeadList.forEach((e2: any) => {
        FeeClassHeadList.push(e2);
      });
    });
    var request:RequestModel = {
      request:this.localService.encrypt(JSON.stringify({
        FeeClassHeadList: FeeClassHeadList,
        StaffLoginId: this.staffLogin.StaffLoginId
      }))
    }
    this.dataLoading = true;
    this.service.saveFeeClassHead(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success("Record Updated Successfully")
        this.isSubmitted = false;
        this.MonthList = [];
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

