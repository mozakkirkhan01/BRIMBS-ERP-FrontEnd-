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

@Component({
  selector: 'app-pupil-subject',
  templateUrl: './pupil-subject.component.html',
  styleUrls: ['./pupil-subject.component.css']
})
export class PupilSubjectComponent {
  FilterModel: any = {
    isChangeAll: true
  };
  dataLoading: boolean = false;
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
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
    this.getSectionList();
    this.getSubjectNoList();
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

  @ViewChild('formPupilSubject') formClassExam: NgForm;

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
    this.getClassSubjectList();
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


  ClassSubjectList: any[] = [];
  getClassSubjectList() {
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FilterModel)).toString()
    }
    this.dataLoading = true
    this.service.getClassSubjectList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.ClassSubjectList = response.ClassSubjectList.filter((x: any) => x.IsGrade == false);
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  SubjectNoList: any[] = [];
  getSubjectNoList() {
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FilterModel)).toString()
    }
    this.dataLoading = true
    this.service.getSubjectNoList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.SubjectNoList = response.SubjectNoList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  changeSubject(i2: number, PupilSubject: any) {
    if (i2 == 0 && this.FilterModel.isChangeAll)
      this.PupilSubjectList.forEach(x1 => x1.ClassSubjectList.filter((x2: any) => x2.SubjectNo == PupilSubject.SubjectNo).forEach((x2: any) => x2.ClassSubjectId = PupilSubject.ClassSubjectId));
  }

  PupilSubjectList: any[] = [];
  getPupilSubjectList() {
    if (this.formClassExam.invalid) {
      this.toastr.error("Fill all required fields !!");
      this.PupilSubjectList = [];
      return;
    }
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FilterModel))
    }
    this.dataLoading = true
    this.service.getPupilSubjectList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.PupilSubjectList = response.PupilSubjectList;

        var PupilSubjectList: any[] = [];
        this.PupilSubjectList.forEach(x1 => x1.ClassSubjectList.filter((x2: any) => x2.PupilSubjectId > 0).forEach((x2: any) => PupilSubjectList.push(x2)));
        if (PupilSubjectList.length != 0)
          this.SubjectNoList.forEach(x => x.IsOptional = PupilSubjectList.filter(x2 => x2.SubjectNo == x.No && x2.IsOptional).length > 0 ? true : false)

      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  savePupilSubject() {
    var PupilSubjectList: any[] = [];
    this.PupilSubjectList.forEach(x1 => x1.ClassSubjectList.filter((x2: any) => x2.ClassSubjectId != 0).forEach((x2: any) => PupilSubjectList.push(x2)));
    PupilSubjectList.forEach(x1 => x1.IsOptional = this.SubjectNoList.filter(x2 => x2.No == x1.SubjectNo)[0].IsOptional);

    var obj = {
      PupilSubjectList: PupilSubjectList,
      StaffLoginId: this.staffLogin.StaffLoginId,
      ClassId: this.FilterModel.ClassId,
      SectionId: this.FilterModel.SectionId,
      SessionId: this.FilterModel.SessionId
    }
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true;
    this.service.savePupilSubject(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success("Pupil Subject update successfully.");
        this.PupilSubjectList = [];
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
