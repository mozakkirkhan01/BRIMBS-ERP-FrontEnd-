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

@Component({
  selector: 'app-training-certificate-list',
  templateUrl: './training-certificate-list.component.html',
  styleUrls: ['./training-certificate-list.component.css']
})
export class TrainingCertificateListComponent {
  dataLoading: boolean = false
  TrainingCertificateList: any = []
  FilterObj: any = {
    FromDateString: new Date(),
    ToDateString: new Date()
  }
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = true;
  sortKey: string = 'IssueDate';
  itemPerPage: number = this.PageSize[0];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;

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
    this.getTrainingCertificateList();
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
  @ViewChild('formTrainingCertificate') formTrainingCertificate: NgForm;

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }
  getTrainingCertificateList() {
    this.FilterObj.FromDate = this.loadData.loadDateYMD(this.FilterObj.FromDateString);
    this.FilterObj.ToDate = this.loadData.loadDateYMD(this.FilterObj.ToDateString);
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FilterObj)).toString()
    }
    this.dataLoading = true
    this.service.getTrainingCertificateList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.TrainingCertificateList = response.TrainingCertificateList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  deleteTrainingCertificate(obj: any) {
    if (confirm("Are your sure you want to delete this recored ?")) {
      obj.CreatedBy = this.staffLogin.StaffLoginId;
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true;
      this.service.deleteTrainingCertificate(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getTrainingCertificateList()
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


  editTrainingCertificate(obj: any) {
    this.router.navigate(['/admin/training-certificate/' + this.loadData.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(obj)))]);
  }

  printTrainingCertificate(docType: number, isPrint: boolean, id: number) {
    this.service.printTrainingCertificate(this.loadData.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify({
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
    this.itemPerPage = this.TrainingCertificateList.length;
    setTimeout(() => {
      this.loadData.exportToExcel(this.table_1, "Training Certificate List " + this.loadData.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
    }, 1000);
  }
}
