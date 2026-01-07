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
  selector: 'app-cashbook',
  templateUrl: './cashbook.component.html',
  styleUrls: ['./cashbook.component.css']
})
export class CashbookComponent {
  dataLoading: boolean = false
  BankbookList: any[] = []
  Cashbook: any = {
    FromDateString: this.loadData.loadFirstDate(),
    ToDateString: new Date(),
  }
  PageSize = ConstantData.PageSizes;
  recordIncome = ConstantData.recordIncome;
  recordExpense = ConstantData.recordExpense;
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
  }
  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url, StaffLoginId: this.staffLogin.StaffLoginId })).toString()
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
        if (this.AccountList.length > 0) {
          this.Cashbook.AccountId = this.AccountList[0].AccountId;
          this.getCashbookBankbookList();
        }
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

  BankBookMaster: any = {};
  getCashbookBankbookList() {
    if (this.formCashbook) {
      this.formCashbook.control.markAllAsTouched();
      if (this.formCashbook.invalid) {
        this.toastr.error(ConstantData.formInvalidMessage);
        return;
      }
    }
    this.Cashbook.FromDate = this.loadData.loadDateYMD(this.Cashbook.FromDateString);
    this.Cashbook.ToDate = this.loadData.loadDateYMD(this.Cashbook.ToDateString);
    this.Cashbook.Income = 0;
    this.Cashbook.Expense = 0;
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Cashbook)).toString()
    }
    this.dataLoading = true
    this.service.getCashbookBankbookList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.BankBookMaster = response.BankBookMaster;
        this.BankbookList = this.BankBookMaster.BankbookList;
        this.BankbookList.forEach(e1 => {
          this.Cashbook.Income += e1.Income;
          this.Cashbook.Expense += e1.Expense;
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


  printCashbookBankbook(docType: number, isPrint: boolean) {
    this.Cashbook.FromDate = this.loadData.loadDateYMD(this.Cashbook.FromDateString);
    this.Cashbook.ToDate = this.loadData.loadDateYMD(this.Cashbook.ToDateString);
    this.Cashbook.IsPrint = isPrint;
    this.Cashbook.DocType = docType;
    this.service.printCashbookBankbook(this.loadData.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(this.Cashbook))));
  }

  @ViewChild('table_1') table_1: ElementRef;
  isExporting: boolean = false;
  exportToExcel() {
    this.dataLoading = true;
    this.isExporting = true;
    var itemPerPage = this.itemPerPage;
    var p = this.p;
    this.p = 1;
    this.itemPerPage = this.BankbookList.length;
    setTimeout(() => {
      this.loadData.exportToExcel(this.table_1, "Deposite History " + this.loadData.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
      this.dataLoading = false;
    }, 1000);

  }
}
