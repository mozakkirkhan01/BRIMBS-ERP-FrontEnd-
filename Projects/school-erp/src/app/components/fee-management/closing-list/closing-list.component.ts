import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { Router } from '@angular/router';
import { AppService } from '../../../utils/app.service';
import { PaymentMode, Status } from '../../../utils/enum';

@Component({
  selector: 'app-closing-list',
  templateUrl: './closing-list.component.html',
  styleUrls: ['./closing-list.component.css']
})
export class ClosingListComponent {
  dataLoading: boolean = false
  CashbookList: any[] = []
  Cashbook: any = {
    // FromDateString:new Date(),
    // ToDateString:new Date(),
  }
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = true;
  sortKey: string = 'CashbookDate';
  itemPerPage: number = this.PageSize[0];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  AllPaymentModeList=PaymentMode;

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
    // this.getCashbookList();
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

  @ViewChild('formCashbook') formCashbook: NgForm;
  AccountList: any[] = [];
  getAccountList() {
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Status: Status.Active })).toString()
    }
    this.dataLoading = true
    this.service.getAccountList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AccountList = response.AccountList;
      } else {
        this.toastr.error(response.Message)
      }
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

  getCashbookList() {
    this.Cashbook.FromDate = this.loadData.loadDateYMD(this.Cashbook.FromDateString);
    this.Cashbook.ToDate = this.loadData.loadDateYMD(this.Cashbook.ToDateString);
    this.Cashbook.Income = 0;
    this.Cashbook.Expenese = 0;
    this.Cashbook.ReceiveAmount = 0;
    this.Cashbook.DepositeAmount = 0;
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Cashbook)).toString()
    }
    this.dataLoading = true
    this.service.getCashbookList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.CashbookList = response.CashbookList;
        this.CashbookList.forEach(e1 => {
          this.Cashbook.Income += e1.Income; 
          this.Cashbook.Expenese += e1.Expenese; 
          this.Cashbook.ReceiveAmount += e1.ReceiveAmount; 
          this.Cashbook.DepositeAmount += e1.DepositeAmount; 
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

  deleteCashbook(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true;
      this.service.deleteCashbook(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getCashbookList()
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

  editCashbook(obj: any) {
    this.router.navigate(['/admin/cashbook/' + this.loadData.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(obj)))]);
  }

  // printCashbookHistory(docType: number, isPrint: boolean) {
  //   this.Cashbook.FromDate = this.loadData.loadDateYMD(this.Cashbook.FromDateString);
  //   this.Cashbook.ToDate = this.loadData.loadDateYMD(this.Cashbook.ToDateString);
  //   this.Cashbook.IsPrint = isPrint;
  //   this.Cashbook.DocType = docType;
  //   this.service.printCashbookHistory(this.loadData.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(this.Cashbook))));
  // }

  @ViewChild('table_1') table_1: ElementRef;
  isExporting: boolean = false;
  exportToExcel() {
    this.dataLoading = true;
    this.isExporting = true;
    var itemPerPage = this.itemPerPage;
    var p = this.p;
    this.p = 1;
    this.itemPerPage = this.CashbookList.length;
    setTimeout(() => {
      this.loadData.exportToExcel(this.table_1, "Deposite History " + this.loadData.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
      this.dataLoading = false;
    }, 1000);

  }
}
