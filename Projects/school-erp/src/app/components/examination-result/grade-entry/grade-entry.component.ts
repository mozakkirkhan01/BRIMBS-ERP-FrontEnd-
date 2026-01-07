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
import { ExamAttendance, Term } from '../../../utils/enum';

@Component({
  selector: 'app-grade-entry',
  templateUrl: './grade-entry.component.html',
  styleUrls: ['./grade-entry.component.css']
})
export class GradeEntryComponent {
  FilterModel: any = {
    isChangeAll: false,
    AllowAttendance: true
  };
  dataLoading: boolean = false;
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = 'RollNo';
  itemPerPage: number = this.PageSize[2];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  TermList = this.loadData.GetEnumList(Term);
  ExamAttendanceList = this.loadData.GetEnumList(ExamAttendance);
  RowChangesMessage = ConstantData.RowChangesMessage;

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
    this.getSectionList();
    this.getGradeList();
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
  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  @ViewChild('formPupilGrade') formSubjectGradingScale: NgForm;

  AllSectionList: any[] = [];
  SectionList: any[] = [];
  getSectionList() {
    var obj = {}
    this.dataLoading = true
    this.appService.getSectionList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllSectionList = response.SectionList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  AllGradeList: any[] = [];
  GradeList: any[] = [];
  getGradeList() {
    var obj = {}
    this.dataLoading = true
    this.service.getGradeList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllGradeList = response.GradeList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }


  changeClass() {
    this.SectionList = this.AllSectionList.filter(x1 => x1.ClassId == this.FilterModel.ClassId);
    this.getSubjectGradingScaleList();
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

  SubjectGradingScaleList: any[] = [];
  getSubjectGradingScaleList() {
    if (this.FilterModel.SessionId == null || this.FilterModel.ClassId == null || this.FilterModel.Term == null) {
      this.SubjectGradingScaleList = [];
      return;
    }
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FilterModel))
    }
    this.dataLoading = true
    this.service.getSubjectGradingScaleList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.SubjectGradingScaleList = response.SubjectGradingScaleList;
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

  changeHyGrade(index: number, PupilGrade: any) {
    if (index == 0 && this.FilterModel.isChangeAll) {
      this.PupilGradeList.forEach(x1 => x1.HyGradeId = PupilGrade.HyGradeId);
    }
  }

  changeAnGrade(index: number, PupilGrade: any) {
    if (index == 0 && this.FilterModel.isChangeAll) {
      this.PupilGradeList.forEach(x1 => x1.AnGradeId = PupilGrade.AnGradeId);
    }
  }

  changeHyAttendance(index: number, PupilGrade: any) {
    if (index == 0 && this.FilterModel.isChangeAll) {
      this.PupilGradeList.forEach(x1 => x1.HyAttendance = PupilGrade.HyAttendance);
    }
  }
  changeAnAttendance(index: number, PupilGrade: any) {
    if (index == 0 && this.FilterModel.isChangeAll) {
      this.PupilGradeList.forEach(x1 => x1.AnAttendance = PupilGrade.AnAttendance);
    }
  }

  SubjectGradingScale: any = {};
  PupilGradeList: any[] = [];
  getPupilGradeList() {
    if (this.formSubjectGradingScale.invalid) {
      this.toastr.error("Fill all required fields !!");
      this.PupilGradeList = [];
      return;
    }
    this.SubjectGradingScale = this.SubjectGradingScaleList.filter(x1 => x1.SubjectGradingScaleId == this.FilterModel.SubjectGradingScaleId)[0];
    this.GradeList = this.AllGradeList.filter(x1 => x1.GradeNo <= this.SubjectGradingScale.UpToGradeNo);
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FilterModel))
    }
    this.dataLoading = true
    this.service.getEntryPupilGradeList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.PupilGradeList = response.PupilGradeList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  savePupilGrade() {
    var PupilGradeList: any[] = [];
    this.PupilGradeList.forEach(x1 => PupilGradeList.push({
      PupilGradeId: x1.PupilGradeId,
      PupilAdmissionId:x1.PupilAdmissionId,
      AnGradeId:x1.AnGradeId,
      AnAttendance:x1.AnAttendance,
      HyGradeId:x1.HyGradeId,
      HyAttendance:x1.HyAttendance,
    }))
    var obj = {
      PupilGradeList: PupilGradeList,
      StaffLoginId: this.staffLogin.StaffLoginId,
      SectionId: this.FilterModel.SectionId,
      SubjectGradingScaleId: this.FilterModel.SubjectGradingScaleId,
    }
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true;
    this.service.savePupilGrade(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success("Grade submitted successfully.");
        this.PupilGradeList = [];
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
