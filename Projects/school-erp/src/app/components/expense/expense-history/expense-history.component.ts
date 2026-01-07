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
import { PaymentMode, Status } from '../../../utils/enum';

@Component({
  selector: 'app-expense-history',
  templateUrl: './expense-history.component.html',
  styleUrls: ['./expense-history.component.css']
})
export class ExpenseHistoryComponent {
  dataLoading: boolean = false
  ExpenseList: any[] = []
  Expense: any = {
    // FromDateString:new Date(),
    // ToDateString:new Date(),
    ExpenseHeadId :0,
    ExpenseCategoryId : 0
  }
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = true;
  sortKey: string = 'ExpenseDate';
  itemPerPage: number = this.PageSize[0];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  AllPaymentModeList=PaymentMode;

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
    this.getExpenseCategoryList();
    this.getAccountList();
    // this.getExpenseList();
    this.getExpenseHeadList();
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

  
  AccountList: any[] = [];
  getAccountList() {
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Status: Status.Active })).toString()
    }
    this.dataLoading = true
    this.appService.getAccountList(request).subscribe(r1 => {
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

  ExpenseCategoryList:any[]=[];
  getExpenseCategoryList() {
    var obj = {
      ExpenseCategoryId: 0
    }
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true
    this.service.getExpenseCategoryList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.ExpenseCategoryList = response.ExpenseCategoryList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }
  changeExpenseCategory(){
    this.ExpenseHeadList = this.AllExpenseHeadList.filter(x=>x.ExpenseCategoryId == this.Expense.ExpenseCategoryId);
    this.Expense.ExpenseHeadId = 0;
  }

  ExpenseHeadList:any[]=[];
  AllExpenseHeadList:any[]=[];
  getExpenseHeadList() {
    var obj = {
      ExpenseHeadId: 0
    }
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true
    this.service.getExpenseHeadList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllExpenseHeadList = response.ExpenseHeadList;
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

  getExpenseList() {
    this.Expense.FromDate = this.loadData.loadDateYMD(this.Expense.FromDateString);
    this.Expense.ToDate = this.loadData.loadDateYMD(this.Expense.ToDateString);
    this.Expense.Amount = 0;
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Expense)).toString()
    }
    this.dataLoading = true
    this.service.getExpenseList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.ExpenseList = response.ExpenseList;
        this.ExpenseList.forEach(e1 => {
          this.Expense.Amount += e1.Amount; 
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
          this.getExpenseList()
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

  printExpenseHistory(docType: number, isPrint: boolean) {
    this.Expense.FromDate = this.loadData.loadDateYMD(this.Expense.FromDateString);
    this.Expense.ToDate = this.loadData.loadDateYMD(this.Expense.ToDateString);
    this.Expense.IsPrint = isPrint;
    this.Expense.DocType = docType;
    this.service.printExpenseHistory(this.loadData.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(this.Expense))));
  }

  @ViewChild('table_1') table_1: ElementRef;
  isExporting: boolean = false;
  exportToExcel() {
    this.dataLoading = true;
    this.isExporting = true;
    var itemPerPage = this.itemPerPage;
    var p = this.p;
    this.p = 1;
    this.itemPerPage = this.ExpenseList.length;
    setTimeout(() => {
      this.loadData.exportToExcel(this.table_1, "Expense History " + this.loadData.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
      this.dataLoading = false;
    }, 1000);

  }
}
