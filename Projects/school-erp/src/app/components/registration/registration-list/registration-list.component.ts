import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { LocalService } from '../../../utils/local.service';
import { ActionModel, RequestModel } from '../../../utils/interface';
import { Router } from '@angular/router';
import {  BloodGroup, Category, Gender, Nationality, PupilStatus, RegistrationStatus, Religion } from '../../../utils/enum';

@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.css']
})
export class RegistrationListComponent {
  dataLoading: boolean = false
  RegistrationList: any[] = []
  Pupil: any = {}
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  AllNationalityList = Nationality;
  AllBloodGroupList = BloodGroup;
  AllReligionList = Religion;
  AllCategoryList = Category;
  AllGenderList = Gender;
  AllRegistrationStatusList= RegistrationStatus
  RegistrationStatusList = this.loadDataService.GetEnumList(RegistrationStatus);
  SessionList: any[] = [];
  ClassList: any[] = [];
  staffLogin: any = {};
  FilterObj: any = {
    ClassId: 0,
    SectionId: 0,
    SessionId: 0,
  };
  action: ActionModel = {} as ActionModel;
  imageUrl = ConstantData.getBaseUrl();

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private localService: LocalService,
    private loadDataService: LoadDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getSessionList();
    this.getClassList();
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url,StaffLoginId:this.staffLogin.StaffLoginId })).toString()
    }
    this.dataLoading = true
    this.service.validiateMenu(obj).subscribe((response: any) => {
      this.action = this.loadDataService.validiateMenu(response, this.toastr, this.router)
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  getRegistrationList() {
    this.FilterObj.FromDate = this.loadDataService.loadDateYMD(this.FilterObj.FromDateString);
    this.FilterObj.ToDate = this.loadDataService.loadDateYMD(this.FilterObj.ToDateString);
    var obj:RequestModel={
      request:this.localService.encrypt(JSON.stringify(this.FilterObj))
    }
    this.dataLoading = true
    this.service.getRegistrationList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.RegistrationList = response.RegistrationList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  deleteRegistration(registration: any, index: number) {
    if (confirm("Are your sure you want to delete this recored")) {
      var obj: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(registration))
      }
      this.dataLoading = true;
      this.service.deleteRegistration(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully");
          this.RegistrationList.splice(index,1);
        } else {
          this.toastr.error(response.Message)
        }
        this.dataLoading = false;
      }, (err => {
        this.toastr.error("Error occured while deleteing the recored")
        this.dataLoading = false;
      }))
    }
  }

  editRecord(obj: any) {
    this.router.navigate(['/admin/registration/' + this.loadDataService.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(obj)))]);
  }

  getSessionList() {
    var obj = {}
    this.dataLoading = true
    this.service.getSessionList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.SessionList = response.SessionList;
        this.FilterObj.SessionId = this.SessionList[0].SessionId;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = true
    }))
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
    }))
  }
  
  printFeeePaymentReceipt(docType: number, isPrint: boolean, item: any) {
    var FilterObj = {
      IsPrint: isPrint,
      docType: docType,
      Id: item.FeePaymentId
    }
    this.service.printFeeePaymentReceipt(this.loadDataService.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(FilterObj))));
  }

  printRegistrationReceipt(docType: number, isPrint: boolean,item:any) {
    this.FilterObj.IsPrint = isPrint;
    this.FilterObj.docType = docType;
    this.FilterObj.Id = item.RegistrationId;
    this.service.printRegistrationReceipt(this.loadDataService.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(this.FilterObj))));
  }

  printRegistrationList(docType: number, isPrint: boolean) {
    this.FilterObj.IsPrint = isPrint;
    this.FilterObj.docType = docType;
    this.FilterObj.FromDate = this.loadDataService.loadDateYMD(this.FilterObj.FromDateString);
    this.FilterObj.ToDate = this.loadDataService.loadDateYMD(this.FilterObj.ToDateString);
    this.service.printRegistrationList(this.loadDataService.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(this.FilterObj))));
  }
  
  @ViewChild('table_1') table_1: ElementRef;
  isExporting: boolean = false;
  exportToExcel() {
    this.isExporting = true;
    var itemPerPage = this.itemPerPage;
    var p = this.p;
    this.p = 1;
    this.itemPerPage = this.RegistrationList.length;
    setTimeout(() => {
      this.loadDataService.exportToExcel(this.table_1, "Pupil List " + this.loadDataService.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
    }, 1000);

  }
}
