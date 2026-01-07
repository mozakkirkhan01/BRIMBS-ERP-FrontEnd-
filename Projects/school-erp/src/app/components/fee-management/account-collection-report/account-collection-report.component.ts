import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { Router } from '@angular/router';
import { AppService } from '../../../utils/app.service';
import { PaymentMode } from '../../../utils/enum';

@Component({
  selector: 'app-account-collection-report',
  templateUrl: './account-collection-report.component.html',
  styleUrls: ['./account-collection-report.component.css']
})
export class AccountCollectionReportComponent {
  dataLoading: boolean = false
  AccountCollectionList: any[] = []
  FilterModel: any = {
    FromDateString: new Date(),
    ToDateString: new Date()
  }
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = 'Date';
  itemPerPage: number = this.PageSize[0];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  AllPaymentModeList = PaymentMode;

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getAccountList();
    // this.getFilterModelCategoryList();
    this.getAccountCollectionList();
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

  @ViewChild('formFilterModel') formFilterModel: NgForm;

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  
  AccountList:any[]=[];
  getAccountList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({}))
    }
    this.dataLoading = true
    this.service.getAccountList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AccountList = response.AccountList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error(ConstantData.serverMessage)
      this.dataLoading = false
    }))
  }

  getAccountCollectionList() {
    this.FilterModel.FromDate = this.loadData.loadDateYMD(this.FilterModel.FromDateString);
    this.FilterModel.ToDate = this.loadData.loadDateYMD(this.FilterModel.ToDateString);
    this.FilterModel.Income = 0;
    this.FilterModel.FeeAmount = 0;
    this.FilterModel.WaiveOffAmount = 0;
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FilterModel)).toString()
    }
    this.dataLoading = true
    this.service.getAccountCollectionList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AccountCollectionList = response.AccountCollectionList;
        this.AccountCollectionList.forEach(e1 => {
          this.FilterModel.Income += e1.Income;
          this.FilterModel.FeeAmount += e1.FeeAmount;
          this.FilterModel.WaiveOffAmount += e1.WaiveOffAmount;
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



  printAccountCollectionReport(docType: number, isPrint: boolean) {
    this.service.printAccountCollectionReport(this.loadData.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify({
      FromDate: this.loadData.loadDateYMD(this.FilterModel.FromDateString),
      ToDate: this.loadData.loadDateYMD(this.FilterModel.ToDateString),
      IsPrint: isPrint,
      DocType: docType,
      AccountId:this.FilterModel.AccountId
    }))));
  }

  @ViewChild('table_1') table_1: ElementRef;
  isExporting: boolean = false;
  exportToExcel() {
    this.dataLoading = true;
    this.isExporting = true;
    var itemPerPage = this.itemPerPage;
    var p = this.p;
    this.p = 1;
    this.itemPerPage = this.AccountCollectionList.length;
    setTimeout(() => {
      this.loadData.exportToExcel(this.table_1, "Account Collection Report " + this.loadData.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
      this.dataLoading = false;
    }, 1000);

  }
}
