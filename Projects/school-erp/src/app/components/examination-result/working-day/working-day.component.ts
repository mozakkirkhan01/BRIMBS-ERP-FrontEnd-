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
  selector: 'app-working-day',
  templateUrl: './working-day.component.html',
  styleUrls: ['./working-day.component.css']
})
export class WorkingDayComponent {
  FilterModel: any = {
    isChangeAll: false,
    Term: 0,
    ClassId:0
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

  @ViewChild('formWorkingDay') formClassExam: NgForm;

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

  changeHyWorkingDays(index: number, WorkingDay: any) {
    if (index == 0 && this.FilterModel.isChangeAll) {
      this.WorkingDayList.forEach(x1 => x1.HyWorkingDays = WorkingDay.HyWorkingDays);
    }
  }

  changeAnWorkingDays(index: number, WorkingDay: any) {
    if (index == 0 && this.FilterModel.isChangeAll) {
      this.WorkingDayList.forEach(x1 => x1.AnWorkingDays = WorkingDay.AnWorkingDays);
    }
  }

  WorkingDayList: any[] = [];
  getWorkingDayList() {
    if (this.formClassExam.invalid) {
      this.toastr.error("Fill all required fields !!");
      this.WorkingDayList = [];
      return;
    }
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FilterModel))
    }
    this.dataLoading = true
    this.service.getEntryWorkingDayList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.WorkingDayList = response.WorkingDayList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveWorkingDay() {
    var obj = {
      WorkingDayList: this.WorkingDayList,
      StaffLoginId: this.staffLogin.StaffLoginId,
      SessionId: this.FilterModel.SessionId,
      Term: this.FilterModel.Term,
      ClassId: this.FilterModel.ClassId,
    }
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true;
    this.service.saveWorkingDay(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success("Grading scale updated successfully.");
        this.WorkingDayList = [];
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
