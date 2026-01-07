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
  selector: 'app-pupil-promotion',
  templateUrl: './pupil-promotion.component.html',
  styleUrls: ['./pupil-promotion.component.css']
})
export class PupilPromotionComponent {

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
    this.getSearchPupilList();
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
    this.AllPupilList = [];
    this.PupilList = [];
    this.getSearchPupilList();
    if (this.formPupil) {
      this.formPupil.control.markAsPristine();
      this.formPupil.control.markAsUntouched();
    }
  }

  AllPupilList: any[] = [];
  getSearchPupilList() {
    this.dataLoading = true
    this.service.getSearchPupilList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllPupilList = response.PupilList;
        this.AllPupilList.map(x1 => x1.SearchPupil = `${x1.AdmissionNo} - ${x1.PupilName} - ${x1.FatherName} - ${x1.ClassName} - ${x1.SectionName}`);
        this.PupilList = this.AllPupilList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false
    }))
  }


  filterPupilList(searchFiled: string) {
    if (searchFiled) {
      this.PupilList = this.AllPupilList.filter((option: any) => option.SearchPupil.toLowerCase().includes(searchFiled.toLowerCase()));
    } else {
      this.PupilList = this.AllPupilList;
    }
    this.Pupil.PupilAdmissionId = null;
  }

  afterPupilSeleted(event: any) {
    this.Pupil.PupilAdmissionId = event.option.id;
    this.Pupil = this.AllPupilList.find(x => x.PupilAdmissionId == this.Pupil.PupilAdmissionId);
    this.Pupil.OldRollNo = this.Pupil.RollNo;
  }

  clearPupil() {
    this.resetForm();
    this.PupilList = this.AllPupilList;
    this.Pupil = {};
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

  pupilPromotion() {
    this.formPupil.control.markAllAsTouched();
    if (this.formPupil.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({
        PupilAdmissionList: [this.Pupil],
        StaffLoginId: this.staffLogin.StaffLoginId,
        SessionId: this.Pupil.SessionId,
      }))
    }
    this.dataLoading = true;
    this.service.pupilPromotion(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success("Promoted successfully")
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
