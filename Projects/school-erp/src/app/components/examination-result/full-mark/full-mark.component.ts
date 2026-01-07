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
import { Term } from '../../../utils/enum';


@Component({
  selector: 'app-full-mark',
  templateUrl: './full-mark.component.html',
  styleUrls: ['./full-mark.component.css']
})
export class FullMarkComponent {
  FilterModel: any = {};
  dataLoading: boolean = false
  ClassExamList: any[] = [];
  TermList = this.loadData.GetEnumList(Term);
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
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url, StaffLoginId: this.staffLogin.StaffLoginId })).toString()
    }
    this.dataLoading = true
    this.appService.validiateMenu(obj).subscribe((response: any) => {
      this.action = this.loadData.validiateMenu(response, this.toastr, this.router)
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  } @ViewChild('formFullMark') formClassExam: NgForm;

  ClassExamListTwo: any[] = [];
  getClassExamList() {
    if (this.FilterModel.ClassId == null || this.FilterModel.SessionId == 0) {
      this.ClassExamList = [];
      return;
    }
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FilterModel)).toString()
    }
    this.dataLoading = true
    this.service.getClassExamList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        var list: any[] = response.ClassExamList;
        this.ClassExamListTwo = list.filter(x => x.Term == Term.TermTwo);
        this.ClassExamList = list.filter(x => x.Term == Term.TermOne);
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
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

  FullMarkList: any[] = [];
  getEntryFullMarkList() {
    if (this.formClassExam.invalid) {
      this.FullMarkList = [];
      return;
    }
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FilterModel))
    }
    this.dataLoading = true
    this.service.getEntryFullMarkList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.FullMarkList = response.FullMarkList;
        if (this.FullMarkList.filter(x => x.IsPractical).length > 0)
          this.FilterModel.IsPractical = true;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  changeTheoryFM(examObj: any, subjectIndex: number) {
    if (subjectIndex == 0) {
      this.FullMarkList
        .forEach(x1 => x1.FullMarkList
          .filter((x2: any) => x2.ExamId == examObj.ExamId)
          .forEach((x2: any) => {
            if (x1.IsTheory && x2.IsTheory)
              x2.TheoryFullMarks = examObj.TheoryFullMarks;
            else
              x2.TheoryFullMarks = 0;
          }));
    }
  }

  changeTheoryPM(examObj: any, subjectIndex: number) {
    if (subjectIndex == 0) {
      this.FullMarkList
        .forEach(x1 => x1.FullMarkList
          .filter((x2: any) => x2.ExamId == examObj.ExamId)
          .forEach((x2: any) => {
            if (x1.IsTheory && x2.IsTheory)
              x2.TheoryPassingMarks = examObj.TheoryPassingMarks;
            else
              x2.TheoryPassingMarks = 0;
          }));
    }
  }

  changePracticalFM(examObj: any, subjectIndex: number) {
    if (subjectIndex == 0) {
      this.FullMarkList
        .forEach(x1 => x1.FullMarkList
          .filter((x2: any) => x2.ExamId == examObj.ExamId)
          .forEach((x2: any) => {
            if (x1.IsPractical && x2.IsPractical)
              x2.PracticalFullMarks = examObj.PracticalFullMarks;
            else
              x2.PracticalFullMarks = 0;
          }));
    }
  }

  changePracticalPM(examObj: any, subjectIndex: number) {
    if (subjectIndex == 0) {
      this.FullMarkList
        .forEach(x1 => x1.FullMarkList
          .filter((x2: any) => x2.ExamId == examObj.ExamId)
          .forEach((x2: any) => {
            if (x1.IsPractical && x2.IsPractical)
              x2.PracticalPassingMarks = examObj.PracticalPassingMarks;
            else
              x2.PracticalPassingMarks = 0;
          }));
    }
  }


  saveFullMark() {
    var FullMarkList: any[] = [];
    this.FullMarkList.forEach(x1 => x1.FullMarkList.forEach((x2: any) => FullMarkList.push(x2)));
    var obj = {
      FullMarkList: FullMarkList,
      StaffLoginId: this.staffLogin.StaffLoginId,
      ClassId: this.FilterModel.ClassId,
      SessionId: this.FilterModel.SessionId
    }
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true;
    this.service.saveFullMark(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success("Full marks update successfully.");
        this.FullMarkList = [];
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
