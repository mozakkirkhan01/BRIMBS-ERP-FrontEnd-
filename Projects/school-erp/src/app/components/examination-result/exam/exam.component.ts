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
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent {

  dataLoading: boolean = false
  ExamList: any = []
  Exam: any = {}
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
    private appService: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getExamList();
    this.getExamTypeList();
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
  @ViewChild('formExam') formExam: NgForm;
  resetForm() {
    this.Exam = {};
    if (this.formExam) {
      this.formExam.control.markAsPristine();
      this.formExam.control.markAsUntouched();
    }
    this.isSubmitted = false
    this.Exam.Status = 1
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p
  }

  ExamTypeList: any[] = [];
  getExamTypeList() {
    var obj = {
      ExamTypeId: 0
    }
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true
    this.service.getExamTypeList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.ExamTypeList = response.ExamTypeList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  getExamList() {
    var obj = {
      ExamId: 0
    }
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true
    this.service.getExamList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.ExamList = response.ExamList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  changeExamType() {
    if (this.Exam.ExamId == null) {
      this.Exam.ExamName = this.ExamTypeList.filter(x => x.ExamTypeId == this.Exam.ExamTypeId)[0].ExamTypeName;
    }
  }

  saveExam() {
    this.isSubmitted = true;
    this.formExam.control.markAllAsTouched();
    if (this.formExam.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.Exam.CreatedBy = this.staffLogin.StaffLoginId;
    this.Exam.UpdatedBy = this.staffLogin.StaffLoginId;

    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Exam)).toString()
    }
    this.dataLoading = true;
    this.service.saveExam(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Exam.ExamId > 0) {
          this.toastr.success("Exam Updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("Exam added successfully")
        }
        this.resetForm()
        this.getExamList()
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteExam(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true;
      this.service.deleteExam(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getExamList()
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

  editExam(obj: any) {
    this.resetForm()
    this.Exam = obj
  }

}
