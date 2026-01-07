import { Component,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LocalService } from '../../../utils/local.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LoadDataService } from '../../../utils/load-data.service';
import { Router } from '@angular/router';
import { FeeFor } from '../../../utils/enum';


@Component({
  selector: 'app-fee-class',
  templateUrl: './fee-class.component.html',
  styleUrls: ['./fee-class.component.css']
})
export class FeeClassComponent  {

  dataLoading: boolean = false
  MonthList: any[] = []
  FeeClass: any = {}
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
  FeeForList = this.loadData.GetEnumList(FeeFor);
  AllFeeFor=FeeFor;

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

  @ViewChild('formFeeClass') formFeeClass: NgForm;
  resetForm() {
    this.FeeClass = {};
    if (this.formFeeClass) {
      this.formFeeClass.control.markAsPristine();
      this.formFeeClass.control.markAsUntouched();
    }
  }

  changeSelection(index: number, head: any) {
    if (index == 0 && this.FilterModel.isChangeAll) {
      this.MonthList.forEach(x1 => x1.FeeClassList.forEach((x2: any) => {
        if (x2.HeadId == head.HeadId) {
          x2.FeeAmount = head.FeeAmount;
          x2.IsActive = head.IsActive;
          x2.IsRefundable = head.IsRefundable;
          x2.IsCompulsory = head.IsCompulsory;
          x2.FeeFor = head.FeeFor;
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

  getAllFeeClassList() { 
    this.isSubmitted = true;
    this.formFeeClass.control.markAllAsTouched();
    if (this.formFeeClass.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    var request:RequestModel = {
      request:this.localService.encrypt(JSON.stringify(this.FeeClass))
    }
    this.dataLoading = true
    this.service.getAllFeeClassList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.MonthList = response.MonthList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveFeeClass() {
    this.isSubmitted = true;
    this.formFeeClass.control.markAllAsTouched();
    if (this.formFeeClass.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    var FeeClassList: any[] = [];
    this.MonthList.forEach((e1: any) => {
      e1.FeeClassList.forEach((e2: any) => {
        FeeClassList.push(e2);
      });
    });
    var request:RequestModel = {
      request:this.localService.encrypt(JSON.stringify({
        FeeClassList: FeeClassList,
        StaffLoginId: this.staffLogin.StaffLoginId
      }))
    }
    this.dataLoading = true;
    this.service.saveFeeClass(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success("Fees Updated Successfully")
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


