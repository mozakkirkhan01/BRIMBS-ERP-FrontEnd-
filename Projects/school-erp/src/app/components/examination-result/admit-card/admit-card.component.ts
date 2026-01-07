import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { AppService } from '../../../utils/app.service';
import { Status } from '../../../utils/enum';
declare var $: any


@Component({
  selector: 'app-admit-card',
  templateUrl: './admit-card.component.html',
  styleUrls: ['./admit-card.component.css']
})
export class AdmitCardComponent {
  dataLoading: boolean = false
  AdmitCard: any = {};
  StatusList = this.loadData.GetEnumList(Status);
  AllStatusList = Status;
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  setting:any={};
  RowChangesMessage = ConstantData.RowChangesMessage;

  constructor(
    private service: ExamService,
    private appService: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getClassList();
    this.getSessionList();
    this.getExamList();
    this.resetForm();
    this.route.paramMap.subscribe((params1: any) => {
      var id = params1.get('id');
      if (id) {
        this.getAdmitCardDetail(this.loadData.restoreSpecialCharacter(id));
      }
    });
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: "/admin/admit-card",StaffLoginId:this.staffLogin.StaffLoginId })).toString()
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

  @ViewChild('formAdmitCard') formAdmitCard: NgForm;
  submitted: boolean = false;
  resetForm() {
    this.AdmitCard = {
      SessionId: this.AdmitCard.SessionId,
      Status: 1,
      PublishDate: this.loadData.loadDateYMD(this.AdmitCard.PublishDate ? this.AdmitCard.PublishDate : new Date()),
    };
    this.AdmitCardSubjectList = [];
    this.ClassSubjectList = [];
    this.submitted = false;
    if (this.formAdmitCard) {
      this.formAdmitCard.control.markAsPristine();
      this.formAdmitCard.control.markAsUntouched();
    }
  }

  getAdmitCardDetail(id:string) {
    var obj:RequestModel = {
      request:id
    }
    this.dataLoading = true
    this.service.getAdmitCardDetail(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AdmitCard = response.AdmitCard;
        this.AdmitCardSubjectList = response.AdmitCardSubjectList;
        this.AdmitCardSubjectList.forEach(x=>x.ExamDate= this.loadData.loadDateYMD(x.ExamDate));
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }


  ClassSubjectList: any[] = [];
  getClassSubjectList() {
    if (this.AdmitCard.SessionId == null || this.AdmitCard.ClassId == null) {
      this.AdmitCardSubjectList = [];
      return;
    }
    var obj = {
      SessionId: this.AdmitCard.SessionId,
      ClassId: this.AdmitCard.ClassId
    };
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true
    this.service.getClassSubjectList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.ClassSubjectList = response.ClassSubjectList;
        this.AdmitCardSubjectList = response.ClassSubjectList;
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
        this.AdmitCard.SessionId = this.SessionList[0].SessionId;
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

  ExamList: any[] = [];
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

  //Admit Card Subject
  AdmitCardSubjectList: any[] = [];
  AdmitCardSubject: any = {};
  removeAdmitCardSubject(index: number) {
    if (window.confirm("Are you sure want to remove this subject?")) {
      this.AdmitCardSubjectList.splice(index, 1);
    }
  }

  changeExamDate(index: number, sub: any) {
    if (index == 0 && this.setting.isChangeAll) {
      this.AdmitCardSubjectList.forEach(x => x.ExamDate = sub.ExamDate);
    }
  }

  changeStartTime(index: number, sub: any) {
    if (index == 0 && this.setting.isChangeAll) {
      this.AdmitCardSubjectList.forEach(x => x.StartTime = sub.StartTime);
    }
  }

  changeEndTime(index: number, sub: any) {
    if (index == 0 && this.setting.isChangeAll) {
      this.AdmitCardSubjectList.forEach(x => x.EndTime = sub.EndTime);
    }
  }

  saveAdmitCard() {
    this.formAdmitCard.control.markAllAsTouched();
    this.submitted = true;
    if (this.formAdmitCard.invalid || this.AdmitCardSubjectList.filter(x => x.ExamDate == null || x.StartTime == null || x.EndTime == null).length > 0) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    this.AdmitCardSubjectList.forEach(x => x.ExamDate = this.loadData.loadDateYMD(x.ExamDate));
    var obj = {
      AdmitCard: this.AdmitCard,
      AdmitCardSubjectList: this.AdmitCardSubjectList,
      StaffLoginId: this.staffLogin.StaffLoginId
    };

    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true;
    this.service.saveAdmitCard(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        var obj = {
          AdmitCardId: response.AdmitCardId,
          PupilAdmissionId: 0
        };
        this.service.printAdmitCard(this.localService.encrypt(JSON.stringify(obj)));
        if (this.AdmitCard.AdmitCardId > 0) {
          this.toastr.success("Admit card detail updated successfully.")
          history.back();
        } else {
          this.toastr.success("Admit card detail submitted successfully.")
        }
        this.resetForm()
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
