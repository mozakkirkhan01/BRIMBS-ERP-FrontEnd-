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
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent {

  dataLoading: boolean = false
  SubjectList: any = []
  Subject: any = {}
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
    this.getSubjectList();
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

  @ViewChild('formSubject') formSubject: NgForm;
  resetForm() {
    this.Subject = {
      IsGrade:this.Subject.IsGrade,
      GradeGroupId:this.Subject.GradeGroupId
    };
    if (this.formSubject) {
      this.formSubject.control.markAsPristine();
      this.formSubject.control.markAsUntouched();
    }
    this.isSubmitted = false
    this.Subject.Status = 1
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p
  }

  GradeGroupList: any[] = [];
  getGradeGroupList() {
    var obj = {};
    var request: RequestModel = {
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

  GradeSubjectList:any[]=[];
  AllSubjectList:any[]=[];
  getSubjectList() {
    var obj = {
      SubjectId:0
    }
    var request:RequestModel={
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true
    this.service.getSubjectList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllSubjectList = response.SubjectList;
        this.SubjectList = this.AllSubjectList.filter(x=>x.IsGrade == false);
        this.GradeSubjectList = this.AllSubjectList.filter(x=>x.IsGrade);
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveSubject() {
    this.isSubmitted = true;
    this.formSubject.control.markAllAsTouched();
    if (this.formSubject.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.Subject.CreatedBy = this.staffLogin.StaffLoginId;
    this.Subject.UpdatedBy = this.staffLogin.StaffLoginId;

    var request:RequestModel={
      request: this.localService.encrypt(JSON.stringify(this.Subject)).toString()
    }
    this.dataLoading = true;
    this.service.saveSubject(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Subject.SubjectId > 0) {
          this.toastr.success("Subject Updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("Subject added successfully")
        }
        this.resetForm()
        this.getSubjectList()
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteSubject(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var request:RequestModel={
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true;
      this.service.deleteSubject(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getSubjectList()
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

  editSubject(obj: any) {
    this.resetForm()
    this.Subject = obj
  }

}
