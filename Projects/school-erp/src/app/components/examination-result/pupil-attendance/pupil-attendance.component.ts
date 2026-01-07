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
  selector: 'app-pupil-attendance',
  templateUrl: './pupil-attendance.component.html',
  styleUrls: ['./pupil-attendance.component.css']
})
export class PupilAttendanceComponent {
  FilterModel: any = {
    isChangeAll: false,
    Term: 0
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

  @ViewChild('formMarksheet') formSubjectGradingScale: NgForm;

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

  MarksheetList: any[] = [];
  WorkingDay:any={};
  getEntryPupilAttendanceList() {
    if (this.formSubjectGradingScale.invalid) {
      this.toastr.error("Fill all required fields !!");
      this.MarksheetList = [];
      return;
    }
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FilterModel))
    }
    this.dataLoading = true
    this.service.getEntryPupilAttendanceList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.MarksheetList = response.MarksheetList;
        this.WorkingDay = response.WorkingDay;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  changeHyPresentDays(index: number, Marksheet: any) {
    if(Marksheet.HyPresentDays > this.WorkingDay.HyWorkingDays){
      this.toastr.error("Attendance should not be more than working days !!");
      Marksheet.HyPresentDays = this.WorkingDay.HyWorkingDays;
    }
    if (index == 0 && this.FilterModel.isChangeAll) {
      this.MarksheetList.forEach(x1 => x1.HyPresentDays = Marksheet.HyPresentDays);
    }
  }

  changeAnPresentDays(index: number, Marksheet: any) {
    if(Marksheet.AnPresentDays > this.WorkingDay.AnWorkingDays){
      this.toastr.error("Attendance should not be more than working days !!");
      Marksheet.AnPresentDays = this.WorkingDay.AnWorkingDays;
    }
    if (index == 0 && this.FilterModel.isChangeAll) {
      this.MarksheetList.forEach(x1 => x1.AnPresentDays = Marksheet.AnPresentDays);
    }
  }


  savePupilAttendance() {
    var MarksheetList: any[] = [];
    this.MarksheetList.forEach(x1 => MarksheetList.push({
      MarksheetId: x1.MarksheetId,
      PupilAdmissionId:x1.PupilAdmissionId,
      HyPresentDays:x1.HyPresentDays,
      AnPresentDays:x1.AnPresentDays,
    }))
    var obj = {
      MarksheetList: MarksheetList,
      StaffLoginId: this.staffLogin.StaffLoginId,
      WorkingDayId: this.WorkingDay.WorkingDayId,
    }
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true;
    this.service.savePupilAttendance(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success("Attendance details submitted successfully.");
        this.MarksheetList = [];
        this.WorkingDay = {};
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
