import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { Router } from '@angular/router';
import { AppService } from '../../../utils/app.service';
import { CertificateService } from '../../../services/certificate.service';
import { Gender } from '../../../utils/enum';

@Component({
  selector: 'app-character-certificate-list',
  templateUrl: './character-certificate-list.component.html',
  styleUrls: ['./character-certificate-list.component.css']
})
export class CharacterCertificateListComponent {
  dataLoading: boolean = false
  CharacterCertificateList: any = []
  FilterObj: any = {}
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = true;
  sortKey: string = 'IssueDate';
  itemPerPage: number = this.PageSize[0];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  Genders = Gender;

  constructor(
    private service: CertificateService,
    private appService: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getCharacterCertificateList();
    // this.getClassList();
    // this.getSectionList();
    // this.getSessionList();
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
  }
  @ViewChild('formCharacterCertificate') formCharacterCertificate: NgForm;

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

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
      this.dataLoading = false
    }))
  }

  SessionList: any[] = [];
  getSessionList() {
    var obj = {}
    this.dataLoading = true
    this.appService.getSessionList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.SessionList = response.SessionList;
        // this.FilterObj.SessionId = this.SessionList[0].SessionId;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = true
    }))
  }

  ClassList: any[] = [];
  getClassList() {
    var obj = {}
    this.dataLoading = true
    this.appService.getClassList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.ClassList = response.ClassList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false
    }))
  }

  changeClass() {
    this.SectionList = this.AllSectionList.filter(x => x.ClassId == this.FilterObj.ClassId);
  }

  getCharacterCertificateList() {
    this.FilterObj.FromDate = this.loadData.loadDateYMD(this.FilterObj.FromDateString);
    this.FilterObj.ToDate = this.loadData.loadDateYMD(this.FilterObj.ToDateString);
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FilterObj)).toString()
    }
    this.dataLoading = true
    this.service.getCharacterCertificateList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.CharacterCertificateList = response.CharacterCertificateList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  deleteCharacterCertificate(obj: any) {
    if (confirm("Are your sure you want to delete this recored ?")) {
      obj.CreatedBy = this.staffLogin.StaffLoginId;
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true;
      this.service.deleteCharacterCertificate(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getCharacterCertificateList()
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


  editCharacterCertificate(obj: any) {
    this.router.navigate(['/admin/character-certificate/' + this.loadData.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(obj)))]);
  }

  printCharacterCertificate(docType: number, isPrint: boolean, id: number) {
    this.service.printCharacterCertificate(this.loadData.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify({
      Id: id,
      IsPrint: isPrint,
      DocType: docType
    }))));
  }

  @ViewChild('table_1') table_1: ElementRef;
  isExporting: boolean = false;
  exportToExcel() {
    this.isExporting = true;
    var itemPerPage = this.itemPerPage;
    var p = this.p;
    this.p = 1;
    this.itemPerPage = this.CharacterCertificateList.length;
    setTimeout(() => {
      this.loadData.exportToExcel(this.table_1, "Character Certificate List " + this.loadData.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
    }, 1000);
  }
}
