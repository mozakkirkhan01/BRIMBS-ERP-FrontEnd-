import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { AppService } from '../../../utils/app.service';
declare var $: any


@Component({
  selector: 'app-class-subject',
  templateUrl: './class-subject.component.html',
  styleUrls: ['./class-subject.component.css']
})
export class ClassSubjectComponent {
  FilterModel: any = {};
  dataLoading: boolean = false
  ClassSubjectList: any[] = []
  ClassSubject: any = {}
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = 'Position';
  itemPerPage: number = this.PageSize[0];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;

  constructor(
    private service: ExamService,
    private appService: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getClassList();
    this.getSessionList();
    this.getSubjectList();
    this.getGradeGroupList();
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
  @ViewChild('formClassSubject') formClassSubject: NgForm;
  resetForm(IsGrade: boolean) {
    this.ClassSubject = {
      IsTheory: true,
      ClassId: this.FilterModel.ClassId,
      SessionId: this.FilterModel.SessionId,
      IsGrade: IsGrade,
      GradeGroupId: this.ClassSubject.GradeGroupId
    };
    if (this.ClassSubject.IsGrade)
      this.ClassSubject.Position = this.ClassSubjectGradeList.length + 1;
    else {
      this.ClassSubject.Position = this.ClassSubjectList.length + 1;
      this.ClassSubject.GradeGroupId = null;
    }
    if (this.formClassSubject) {
      this.formClassSubject.control.markAsPristine();
      this.formClassSubject.control.markAsUntouched();
    }
    this.isSubmitted = false
    this.ClassSubject.Status = 1
  }

  newClassSubject() {
    this.resetForm(false);
    this.SubjectList = this.AllSubjectList.filter(x => !this.AllClassSubjectList.map(y => y.SubjectId).includes(x.SubjectId));
    $('#staticBackdrop').modal('show');
  }

  editClassSubject(obj: any) {
    this.resetForm(obj.IsGrade);
    this.SubjectList = this.AllSubjectList.filter(x=>x.IsGrade == obj.IsGrade && (!this.AllClassSubjectList.map(y => y.SubjectId).includes(x.SubjectId) || obj.SubjectId == x.SubjectId));
    this.ClassSubject = obj
    $('#staticBackdrop').modal('show');
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p
  }

  ClassSubjectGradeList: any[] = [];
  AllClassSubjectList: any[] = [];
  getClassSubjectList() {
    if (this.FilterModel.ClassId == null || this.FilterModel.SessionId == 0) {
      this.ClassSubjectList = [];
      return;
    }
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FilterModel)).toString()
    }
    this.dataLoading = true
    this.service.getClassSubjectList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllClassSubjectList = response.ClassSubjectList;
        this.ClassSubjectList = this.AllClassSubjectList.filter(x => x.IsGrade == false);
        this.ClassSubjectGradeList = this.AllClassSubjectList.filter(x => x.IsGrade);
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
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

  SubjectList: any[] = [];
  AllSubjectList: any[] = [];
  getSubjectList() {
    var obj = {};
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true
    this.service.getSubjectList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllSubjectList = response.SubjectList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  changeSubject() {
    var subjects = this.SubjectList.filter(x => x.SubjectId == this.ClassSubject.SubjectId);
    if (subjects.length > 0)
      this.ClassSubject.SubjectCode = subjects[0].SubjectCode;
  }

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


  saveClassSubject() {
    this.isSubmitted = true;
    this.formClassSubject.control.markAllAsTouched();
    if (this.formClassSubject.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.ClassSubject.CreatedBy = this.staffLogin.StaffLoginId;
    this.ClassSubject.UpdatedBy = this.staffLogin.StaffLoginId;

    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.ClassSubject)).toString()
    }
    this.dataLoading = true;
    this.service.saveClassSubject(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.ClassSubject.ClassSubjectId > 0) {
          this.toastr.success("Subject Updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("Subject added successfully")
        }
        this.resetForm(this.ClassSubject.IsGrade)
        this.getClassSubjectList()
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  saveClassSubjectList() {
    var classSubjects = this.SubjectList.filter(x => x.IsSelected);
    if (classSubjects.length == 0) {
      this.toastr.error("No subject is selected !!");
      return;
    }
    var obj = {
      ClassSubjectList: classSubjects,
      StaffLoginId: this.staffLogin.StaffLoginId,
      ClassId: this.FilterModel.ClassId,
      SessionId: this.FilterModel.SessionId
    }

    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true;
    this.service.saveClassSubjectList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        $('#staticBackdrop').modal('hide')
        this.toastr.success("Subject details submitted successfully.")
        this.resetForm(this.ClassSubject.IsGrade)
        this.getClassSubjectList();
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteClassSubject(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true;
      this.service.deleteClassSubject(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getClassSubjectList()
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
}