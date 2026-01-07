import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LocalService } from '../../../utils/local.service';
import { LoadDataService } from '../../../utils/load-data.service';
import { AdmissionType } from '../../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-class-promotion',
  templateUrl: './class-promotion.component.html',
  styleUrls: ['./class-promotion.component.css']
})
export class ClassPromotionComponent {

  dataLoading: boolean = false
  PupilList: any[] = []
  Pupil: any = {}
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  ClassList: any[] = [];
  SectionList: any[] = [];
  AllSectionList: any[] = [];
  SessionList: any[] = [];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  AdmissionTypeList = this.loadData.GetEnumList(AdmissionType).filter(x => x.Key != 1);

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p
  }

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private localService: LocalService,
    private loadData: LoadDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getClassList();
    this.getSessionList();
    this.getSectionList();
    this.resetForm();
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url,StaffLoginId:this.staffLogin.StaffLoginId })).toString()
    }
    this.dataLoading = true
    this.service.validiateMenu(obj).subscribe((response: any) => {
      this.action = this.loadData.validiateMenu(response, this.toastr, this.router)
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  @ViewChild('formPupil') formPupil: NgForm;
  resetForm() {
    this.Pupil = {};
    if (this.formPupil) {
      this.formPupil.control.markAsPristine();
      this.formPupil.control.markAsUntouched();
    }
  }


  getClassList() {
    var obj = {}
    this.dataLoading = true
    this.service.getClassList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.ClassList = response.ClassList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  getSectionList() {
    var obj = {}
    this.dataLoading = true
    this.service.getSectionList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllSectionList = response.SectionList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  changeClass() {
    this.SectionList = [];
    this.AllSectionList.forEach((e1: any) => {
      if (e1.ClassId == this.Pupil.ClassId) {
        this.SectionList.push(e1);
      }
    });
  }

  PromotionSectionList: any[] = [];
  changePromotedClass() {
    this.PromotionSectionList = [];
    this.AllSectionList.forEach((e1: any) => {
      if (e1.ClassId == this.Pupil.PromotedClassId) {
        this.PromotionSectionList.push(e1);
      }
    })
  }

  selectAll() {
    this.PupilList.map(x => x.IsSelected = this.Pupil.SelectAll);
  }

  getSessionList() {
    var obj = {}
    this.dataLoading = true
    this.service.getSessionList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.SessionList = response.SessionList;
        this.Pupil.SessionId = response.CurrentSessionId;
        this.Pupil.PromotedSessionId = response.CurrentSessionId;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  getPupilListForPromotion() {
    this.formPupil.control.markAllAsTouched();
    if (this.formPupil.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    var obj:RequestModel = {
      request:this.localService.encrypt(JSON.stringify(this.Pupil))
    }
    this.dataLoading = true
    this.service.getPupilListForPromotion(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.PupilList = response.PupilList;
        this.PupilList.map(x1 => {
          x1.IsSelected = true;
          x1.SectionId = this.Pupil.PromotedSectionId;
          x1.AdmissionType = AdmissionType.Promoted;
          x1.OldRollNo = x1.RollNo;
        });
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  changePromotedSection() {
    this.PupilList.map(x1 => x1.SectionId = this.Pupil.PromotedSectionId);
  }

  pupilPromotion() {
    this.formPupil.control.markAllAsTouched();
    if (this.formPupil.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    var obj:RequestModel = {
      request:this.localService.encrypt(JSON.stringify({
        PupilAdmissionList: this.PupilList.filter(x => x.IsSelected),
        StaffLoginId: this.staffLogin.StaffLoginId,
        SessionId: this.Pupil.PromotedSessionId,
      }))
    }
    this.dataLoading = true;
    this.service.pupilPromotion(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success("Promoted successfully")
        //this.resetForm()
        this.PupilList = [];
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