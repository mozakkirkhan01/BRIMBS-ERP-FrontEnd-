import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { Router } from '@angular/router';
import { ExpenseService } from '../../../services/expense.service';
import { AppService } from '../../../utils/app.service';
import { PaymentMode } from '../../../utils/enum';

@Component({
  selector: 'app-expense-income-list',
  templateUrl: './expense-income-list.component.html',
  styleUrls: ['./expense-income-list.component.css']
})
export class ExpenseIncomeListComponent {
  dataLoading: boolean = false
  ExpenseIncomeList: any[] = []
  Expense: any = {
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
    private service: ExpenseService,
    private appService: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    // this.getExpenseCategoryList();
    this.getExpenseIncomeList();
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

  @ViewChild('formExpense') formExpense: NgForm;

  // ExpenseCategoryList:any[]=[];
  // getExpenseCategoryList() {
  //   var obj = {
  //     ExpenseCategoryId: 0
  //   }
  //   var request: RequestModel = {
  //     request: this.localService.encrypt(JSON.stringify(obj)).toString()
  //   }
  //   this.dataLoading = true
  //   this.service.getExpenseCategoryList(request).subscribe(r1 => {
  //     let response = r1 as any
  //     if (response.Message == ConstantData.SuccessMessage) {
  //       this.ExpenseCategoryList = response.ExpenseCategoryList;
  //     } else {
  //       this.toastr.error(response.Message)
  //     }
  //     this.dataLoading = false;
  //   }, (err => {
  //     this.toastr.error("Error while fetching records")
  //     this.dataLoading = false;
  //   }))
  // }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  getExpenseIncomeList() {
    this.Expense.FromDate = this.loadData.loadDateYMD(this.Expense.FromDateString);
    this.Expense.ToDate = this.loadData.loadDateYMD(this.Expense.ToDateString);
    this.Expense.Income = 0;
    this.Expense.Expense = 0;
    this.Expense.AvailableAmount = 0;
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Expense)).toString()
    }
    this.dataLoading = true
    this.service.getExpenseIncomeList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.ExpenseIncomeList = response.ExpenseIncomeList;
        this.ExpenseIncomeList.forEach(e1 => {
          this.Expense.Income += e1.Income;
          this.Expense.Expense += e1.Expense;
          this.Expense.AvailableAmount += e1.AvailableAmount;
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

  deleteExpense(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true;
      this.service.deleteExpense(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getExpenseIncomeList()
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

  editExpense(obj: any) {
    this.router.navigate(['/admin/expense/' + this.loadData.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(obj)))]);
  }

  printExpenseIncomeList(docType: number, isPrint: boolean) {
    this.service.printExpenseIncomeList(this.loadData.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify({
      FromDate: this.loadData.loadDateYMD(this.Expense.FromDateString),
      ToDate: this.loadData.loadDateYMD(this.Expense.ToDateString),
      IsPrint: isPrint,
      DocType: docType
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
    this.itemPerPage = this.ExpenseIncomeList.length;
    setTimeout(() => {
      this.loadData.exportToExcel(this.table_1, "Expense History " + this.loadData.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
      this.dataLoading = false;
    }, 1000);

  }
}
