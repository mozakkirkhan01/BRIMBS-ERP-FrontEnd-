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
  selector: 'app-marks-entry',
  templateUrl: './marks-entry.component.html',
  styleUrls: ['./marks-entry.component.css']
})
export class MarksEntryComponent {
  FilterModel: any = {
    isChangeAll: false,
    AllowAttendance: false
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

  @ViewChild('formPupilMark') formClassExam: NgForm;

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

  changeClass() {
    this.SectionList = this.AllSectionList.filter(x1 => x1.ClassId == this.FilterModel.ClassId);
    this.getClassExamList();
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

  ClassExamList: any[] = [];
  getClassExamList() {
    if (this.FilterModel.SessionId == null || this.FilterModel.ClassId == null || this.FilterModel.Term == null) {
      this.FullMarkList = [];
      this.ClassExamList = [];
      return;
    }
    var obj={
      Term:this.FilterModel.Term,
      ClassId:this.FilterModel.ClassId,
      SessionId:this.FilterModel.SessionId,
    };
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(obj))
    }
    this.dataLoading = true
    this.service.getClassExamList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.ClassExamList = response.ClassExamList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  FullMarkList: any[] = [];
  getFullMarkList() {
    if (this.FilterModel.ClassExamId == null) {
      this.FullMarkList = [];
      return;
    }
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FilterModel))
    }
    this.dataLoading = true
    this.service.getFullMarkList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.FullMarkList = response.FullMarkList;

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

  changeSubject() {
    this.PupilMarkList = [];
  }

  changeTheoryMarks(index: number, pupilMark: any) {
    if (pupilMark.TheoryMO > this.FullMark.TheoryFullMarks) {
      this.toastr.error("Mark should not be more than " + this.FullMark.TheoryFullMarks + " (full marks) !!");
      pupilMark.TheoryMO = this.FullMark.TheoryFullMarks;
    }
    if (pupilMark.TheoryMO < 0) {
      this.toastr.error("Mark should not be negative !!");
      pupilMark.TheoryMO = 0;
    }
    if (index == 0 && this.FilterModel.isChangeAll) {
      this.PupilMarkList.forEach(x1 => x1.PupilMark.TheoryMO = pupilMark.TheoryMO);
    }
  }

  changePracticalMarks(index: number, pupilMark: any) {
    if (pupilMark.PracticalMO > this.FullMark.PracticalFullMarks) {
      this.toastr.error("Mark should not be more than " + this.FullMark.PracticalFullMarks + " (full marks) !!");
      pupilMark.PracticalMO = this.FullMark.PracticalFullMarks;
    }
    if (pupilMark.PracticalMO < 0) {
      this.toastr.error("Mark should not be negative !!");
      pupilMark.PracticalMO = 0;
    }

    if (index == 0 && this.FilterModel.isChangeAll) {
      this.PupilMarkList.forEach(x1 => x1.PupilMark.PracticalMO = pupilMark.PracticalMO);
    }
  }

  changeTheoryAttendance(pupilMark: any) {
    if (pupilMark.TheoryAttendance == 1) {
      pupilMark.TheoryMO = 0;
    }
  }

  changePracticalAttendance(pupilMark: any) {
    if (pupilMark.PracticalAttendance == 1) {
      pupilMark.PracticalMO = 0;
    }
  }

  // changeAllPresent() {
  //   if (this.FilterModel.AllowAttendance) {
  //     this.PupilMarkList.forEach(x1 => {
  //       x1.PupilMark.TheoryAttendance = ExamAttendance.Present;
  //       x1.PupilMark.PracticalAttendance = ExamAttendance.Present;
  //     });
  //   }
  // }

  FullMark: any = {};
  ClassExam: any = {};
  PupilMarkList: any[] = [];
  getPupilMarkList() {
    if (this.formClassExam.invalid) {
      this.toastr.error("Fill all required fields !!");
      this.PupilMarkList = [];
      return;
    }

    this.FullMark = this.FullMarkList.filter(x1 => x1.FullMarkId == this.FilterModel.FullMarkId)[0];
    this.ClassExam = this.ClassExamList.filter(x1 => x1.ClassExamId == this.FilterModel.ClassExamId)[0];

    this.FilterModel.ClassSubjectId = this.FullMark.ClassSubjectId;
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FilterModel))
    }
    this.dataLoading = true
    this.service.getEntryPupilMarkList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.PupilMarkList = response.PupilMarkList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  savePupilMark() {
    var PupilMarkList: any[] = [];
    this.PupilMarkList.forEach(x1=>{
      x1.PupilMark.PupilAdmissionId = x1.PupilAdmissionId;
      PupilMarkList.push(x1.PupilMark);
    })

    var obj = {
      PupilMarkList: PupilMarkList,
      StaffLoginId: this.staffLogin.StaffLoginId,
      FullMarkId: this.FilterModel.FullMarkId,
      SectionId: this.FilterModel.SectionId,
    }
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true;
    this.service.savePupilMark(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success("Marks detail submitted successfully.");
        this.PupilMarkList = [];
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

