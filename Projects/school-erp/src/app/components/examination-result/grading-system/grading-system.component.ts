import { Component,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { Router } from '@angular/router';
import { AppService } from '../../../utils/app.service';
import { ExamService } from '../../../services/exam.service';
declare var $:any

@Component({
  selector: 'app-grading-system',
  templateUrl: './grading-system.component.html',
  styleUrls: ['./grading-system.component.css']
})
export class GradingSystemComponent {

  dataLoading: boolean = false
  GradingSystemList: any = []
  GradingSystem: any = {}
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  // StatusList = this.loadData.GetEnumList(Status);
  // AllStatusList=Status;
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;

  constructor(
    private service: ExamService,
    private appService:AppService,
    private toastr: ToastrService,
    private loadData:LoadDataService,
    private localService:LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getClassList();
    this.getSessionList();
    this.resetForm();
  }
  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url,StaffLoginId:this.staffLogin.StaffLoginId })).toString()
    }
    this.dataLoading = true
    this.appService.validiateMenu(obj).subscribe((response: any) => {
      this.action = this.loadData.validiateMenu(response, this.toastr, this.router)
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  @ViewChild('formGradingSystem') formGradingSystem: NgForm;
  @ViewChild('formFilter') formFilter: NgForm;
  resetForm() {
    this.GradingSystem = {};
    if (this.formGradingSystem) {
      this.formGradingSystem.control.markAsPristine();
      this.formGradingSystem.control.markAsUntouched();
    }
    this.isSubmitted = false
    this.GradingSystem.Status = 1
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p
  }

  FilterModel:any={};
  SessionList: any = [];
  getSessionList() {
    var obj = {
    }
    this.dataLoading = true
    this.appService.getSessionList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.SessionList = response.SessionList;
        this.FilterModel.SessionId = this.SessionList[0].SessionId;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  ClassList: any = [];
  getClassList() {
    var obj = {
    }
    this.dataLoading = true
    this.appService.getClassList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.ClassList = response.ClassList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  getGradingSystemList() {
    if(this.FilterModel.ClassId == null || this.FilterModel.SessionId == null){
      this.GradingSystemList = [];
      return;
    }
    var request:RequestModel={
      request: this.localService.encrypt(JSON.stringify(this.FilterModel)).toString()
    }
    this.dataLoading = true
    this.service.getGradingSystemList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.GradingSystemList = response.GradingSystemList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveGradingSystem() {
    this.isSubmitted = true;
    this.formGradingSystem.control.markAllAsTouched();
    if (this.formGradingSystem.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.GradingSystem.CreatedBy = this.staffLogin.StaffLoginId;
    this.GradingSystem.UpdatedBy = this.staffLogin.StaffLoginId;
    this.GradingSystem.SessionId = this.FilterModel.SessionId;
    this.GradingSystem.ClassId = this.FilterModel.ClassId;

    var request:RequestModel={
      request: this.localService.encrypt(JSON.stringify(this.GradingSystem)).toString()
    }
    this.dataLoading = true;
    this.service.saveGradingSystem(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.GradingSystem.GradingSystemId > 0) {
          this.toastr.success("Grade details updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("Grade details submitted successfully")
        }
        this.resetForm()
        this.getGradingSystemList()
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteGradingSystem(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var request:RequestModel={
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true;
      this.service.deleteGradingSystem(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getGradingSystemList()
        } else {
          this.toastr.error(response.Message)
          this.dataLoading = false;
        }
      }, (err => {
        this.toastr.error("Error occured while deleteing the recored")
        this.dataLoading = false;
      }))
    }
  }

  editGradingSystem(obj: any) {
    this.resetForm()
    this.GradingSystem = obj
  }

}