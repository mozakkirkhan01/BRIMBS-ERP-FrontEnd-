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
  selector: 'app-grade-group',
  templateUrl: './grade-group.component.html',
  styleUrls: ['./grade-group.component.css']
})
export class GradeGroupComponent {

  dataLoading: boolean = false
  GradeGroupList: any = []
  GradeGroup: any = {}
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
    this.getGradeGroupList();
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

  @ViewChild('formGradeGroup') formGradeGroup: NgForm;
  resetForm() {
    this.GradeGroup = {};
    if (this.formGradeGroup) {
      this.formGradeGroup.control.markAsPristine();
      this.formGradeGroup.control.markAsUntouched();
    }
    this.isSubmitted = false
    this.GradeGroup.Status = 1
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p
  }


  getGradeGroupList() {
    var obj = {
      GradeGroupId:0
    }
    var request:RequestModel={
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true
    this.service.getGradeGroupList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.GradeGroupList = response.GradeGroupList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveGradeGroup() {
    this.isSubmitted = true;
    this.formGradeGroup.control.markAllAsTouched();
    if (this.formGradeGroup.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.GradeGroup.CreatedBy = this.staffLogin.StaffLoginId;
    this.GradeGroup.UpdatedBy = this.staffLogin.StaffLoginId;

    var request:RequestModel={
      request: this.localService.encrypt(JSON.stringify(this.GradeGroup)).toString()
    }
    this.dataLoading = true;
    this.service.saveGradeGroup(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.GradeGroup.GradeGroupId > 0) {
          this.toastr.success("GradeGroup Updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("GradeGroup added successfully")
        }
        this.resetForm()
        this.getGradeGroupList()
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteGradeGroup(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var request:RequestModel={
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true;
      this.service.deleteGradeGroup(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getGradeGroupList()
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

  editGradeGroup(obj: any) {
    this.resetForm()
    this.GradeGroup = obj
  }

}
