import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LocalService } from '../../../utils/local.service';
import { LoadDataService } from '../../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { Router } from '@angular/router';
declare var $: any

@Component({
  selector: 'app-fee-registration',
  templateUrl: './fee-registration.component.html',
  styleUrls: ['./fee-registration.component.css']
})
export class FeeRegistrationComponent {

  dataLoading: boolean = false
  FeeRegistrationList: any[] = []
  FeeRegistration: any = {}
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  ClassList: any[] = []
  PupilTypeList: any[] = [];
  SessionList: any[] = [];
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
    private localService: LocalService,
    private loadData: LoadDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getClassList();
    this.getPupilTypeList();
    this.getSessionList();
    this.resetForm();
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url, StaffLoginId: this.staffLogin.StaffLoginId })).toString()
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

  @ViewChild('formFeeRegistration') formFeeRegistration: NgForm;
  resetForm() {
    this.FeeRegistration = {};
    if (this.formFeeRegistration) {
      this.formFeeRegistration.control.markAsPristine();
      this.formFeeRegistration.control.markAsUntouched();
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
      this.dataLoading = false;
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
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
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
      this.dataLoading = false;
    }))
  }


  getFeeRegistrationList() {
    this.formFeeRegistration.control.markAllAsTouched();
    if (this.formFeeRegistration.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FeeRegistration)).toString()
    }
    this.dataLoading = true
    this.service.getFeeRegistrationList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.FeeRegistrationList = response.FeeRegistrationList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveFeeRegistration() {
    this.formFeeRegistration.control.markAllAsTouched();
    if (this.formFeeRegistration.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.FeeRegistrationList.forEach(x => { x.SessionId = this.FeeRegistration.SessionId; x.ClassId = this.FeeRegistration.ClassId; });
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({
        FeeRegistrationList: this.FeeRegistrationList,
        StaffLoginId: this.staffLogin.StaffLoginId
      })).toString()
    }

    this.dataLoading = true;
    this.service.saveFeeRegistration(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.FeeRegistration.FeeRegistrationId > 0) {
          this.toastr.success("Registration Fee Updated successfully")
        } else {
          this.toastr.success("Registration Fee added successfully")
        }
        //this.resetForm()
        this.FeeRegistrationList = [];
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
