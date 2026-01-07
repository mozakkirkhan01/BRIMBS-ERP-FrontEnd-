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
declare var $: any

@Component({
  selector: 'app-class-exam',
  templateUrl: './class-exam.component.html',
  styleUrls: ['./class-exam.component.css']
})
export class ClassExamComponent {
  FilterModel: any = {};
  dataLoading: boolean = false
  ClassExamList: any[] = []
  ClassExam: any = {}
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = 'ExamNo';
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
    this.getExamList();
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
  @ViewChild('formClassExam') formClassExam: NgForm;
  resetForm() {
    this.ClassExam = {
      IsTheory: true,
      ClassId: this.FilterModel.ClassId,
      SessionId: this.FilterModel.SessionId,
      ExamNo: this.ClassExamList.length + 1
    };

    if (this.formClassExam) {
      this.formClassExam.control.markAsPristine();
      this.formClassExam.control.markAsUntouched();
    }
    this.isSubmitted = false
    this.ClassExam.Status = 1
  }

  newClassExam() {
    this.resetForm();
    this.TermOneExamList = this.AllExamList.filter(x => !this.ClassExamList.map(y => y.ExamId).includes(x.ExamId));
    this.TermTwoExamList = this.AllExamListTwo.filter(x => !this.ClassExamListTwo.map(y => y.ExamId).includes(x.ExamId));
    $('#staticBackdrop').modal('show');
  }

  editClassExam(obj: any) {
    this.resetForm()
    // this.ExamList = this.AllExamList.filter(x => !this.ClassExamList.map(y => y.ExamId).includes(x.ExamId) || x.ExamId == obj.ExamId);
    this.ClassExam = obj
    $('#staticBackdrop').modal('show');
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p
  }

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

  TermOneExamList: any[] = [];
  TermTwoExamList: any[] = [];
  AllExamList: any[] = [];
  AllExamListTwo: any[] = [];
  getExamList() {
    var obj = {};
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true
    this.service.getExamList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllExamList = response.ExamList;
        this.AllExamList.map(x => x.Term = Term.TermOne);
        this.AllExamList.forEach(x => this.AllExamListTwo.push({
          ExamId: x.ExamId,
          ExamName: x.ExamName,
          ExamShortName: x.ExamShortName,
          ExamTypeId: x.ExamTypeId,
          ExamTypeName: x.ExamTypeName,
          Term: Term.TermTwo
        }));
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


  saveClassExam() {
    this.isSubmitted = true;
    this.formClassExam.control.markAllAsTouched();
    if (this.formClassExam.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.ClassExam.CreatedBy = this.staffLogin.StaffLoginId;
    this.ClassExam.UpdatedBy = this.staffLogin.StaffLoginId;

    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.ClassExam)).toString()
    }
    this.dataLoading = true;
    this.service.saveClassExam(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.ClassExam.ClassExamId > 0) {
          this.toastr.success("Exam Updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("Exam added successfully")
        }
        this.resetForm()
        this.getClassExamList()
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  saveClassExamList() {

    var classExamList = this.TermOneExamList.filter(x => x.IsSelected);
    this.TermTwoExamList.filter(x => x.IsSelected).forEach(x => classExamList.push(x));
    if (classExamList.length == 0) {
      this.toastr.warning("No exam is selected !!");
      return;
    }
    var obj = {
      ClassExamList: classExamList,
      StaffLoginId: this.staffLogin.StaffLoginId,
      ClassId: this.FilterModel.ClassId,
      SessionId: this.FilterModel.SessionId
    }
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true;
    this.service.saveClassExamList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success("All exams added successfully.");
        $('#staticBackdrop').modal('hide');
        this.getClassExamList()
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteClassExam(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true;
      this.service.deleteClassExam(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getClassExamList()
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
