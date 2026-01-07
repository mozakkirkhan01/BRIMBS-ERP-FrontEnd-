import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { ActionModel, KeyValueModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../../../services/expense.service';
import { AppService } from '../../../utils/app.service';
import { AccountType, PaymentMode, Status } from '../../../utils/enum';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent {
  dataLoading: boolean = false
  ExpenseList: any = []
  Expense: any = {}
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = true;
  sortKey: string = 'ExpenseDate';
  itemPerPage: number = this.PageSize[0];
  //  StatusList = this.loadData.GetEnumList(Status);
  //  AllStatusList=Status;
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  PaymentModeList: KeyValueModel[] = this.loadData.GetEnumList(PaymentMode);
  AllPaymentModeList = PaymentMode;

  constructor(
    private service: ExpenseService,
    private appService: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.resetForm();
    this.getExpenseCategoryList();
    this.getAccountList();
    this.route.paramMap.subscribe((params1: any) => {
      var id = params1.get('id');
      if (id) {
        this.Expense = JSON.parse(this.localService.decrypt(this.loadData.restoreSpecialCharacter(id)));
        this.Expense.IsUpdate = true;
        this.getExpenseHeadList();
      } else {
        // this.getExpenseList();
        this.getExpenseHeadList();
      }
    });
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: '/admin/expense', StaffLoginId: this.staffLogin.StaffLoginId })).toString()
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
  resetForm() {
    this.Expense = {
      ExpenseCategoryId: this.Expense.ExpenseCategoryId,
      ExpenseDateString: new Date(),
      AccountId: this.Expense.AccountId,
      PaymentMode: PaymentMode.Cash
    };
    if (this.formExpense) {
      this.formExpense.control.markAsPristine();
      this.formExpense.control.markAsUntouched();
    }
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }


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
        var cashAccounts = this.AccountList.filter(x => x.AccountType == AccountType.CashAccount);
        if (cashAccounts.length > 0)
          this.Expense.AccountId = cashAccounts[0].AccountId;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  ExpenseCategoryList: any[] = [];
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
  changeExpenseCategory() {
    this.ExpenseHeadList = this.AllExpenseHeadList.filter(x => x.ExpenseCategoryId == this.Expense.ExpenseCategoryId);
    this.Expense.ExpenseHeadId = "";
    this.Expense.SearchExpenseHead = null;
  }


  ExpenseHeadList: any[] = [];
  AllExpenseHeadList: any[] = [];
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
        this.AllExpenseHeadList.map(x => x.SearchExpenseHead = `${x.ExpenseHeadName}`)
        //this.ExpenseHeadList = response.ExpenseHeadList;
        if (this.Expense.ExpenseId > 0) {
          this.Expense.SearchExpenseHead = this.AllExpenseHeadList.find(x => x.ExpenseHeadId == this.Expense.ExpenseHeadId).SearchExpenseHead
          this.Expense.ExpenseDateString = new Date(this.Expense.ExpenseDate);
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


  filterExpenseHeadList(event: string) {
    if (event) {
      this.ExpenseHeadList = this.AllExpenseHeadList.filter((option: any) => option.ExpenseCategoryId == this.Expense.ExpenseCategoryId && option.SearchExpenseHead.toLowerCase().includes(event.toLowerCase()));
    } else {
      this.ExpenseHeadList = this.AllExpenseHeadList;
    }
  }

  afterExpenseHeadSeleted(event: any) {
    this.Expense.ExpenseHeadId = event.option.id;
    this.getExpenseList();
    this.Expense.Remarks = this.AllExpenseHeadList.find(x => x.ExpenseHeadId == this.Expense.ExpenseHeadId).Remarks;
  }

  clearExpenseHead() {
    this.Expense.ExpenseHeadId = "";
    this.Expense.SearchExpenseHead = null;
    this.changeExpenseCategory();
  }

  getExpenseList() {
    var obj = {
      ExpenseId: 0,
      // NoOfRecord: 10,
      ExpenseHeadId: this.Expense.ExpenseHeadId
    }
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true
    this.service.getExpenseList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.ExpenseList = response.ExpenseList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }


  saveExpense() {
    this.isSubmitted = true;
    this.formExpense.control.markAllAsTouched();
    if (this.formExpense.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    if (this.Expense.ExpenseId)
      this.Expense.UpdatedBy = this.staffLogin.StaffLoginId;
    else
      this.Expense.CreatedBy = this.staffLogin.StaffLoginId;

    if (this.loadData.loadDateYMD(this.Expense.ExpenseDateString) == this.loadData.loadDateYMD(new Date()))
      this.Expense.ExpenseDate = this.loadData.loadDateTime(new Date());
    else
      this.Expense.ExpenseDate = this.loadData.loadDateYMD(this.Expense.ExpenseDateString);

    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Expense)).toString()
    }
    this.dataLoading = true;
    this.service.saveExpense(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Expense.ExpenseId > 0) {
          this.toastr.success("Record Updated successfully")
          if (this.Expense.IsUpdate) {
            history.back();
          }
        } else {
          this.toastr.success("Record added successfully")
        }
        this.resetForm()
        this.getExpenseList()
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
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
    this.resetForm()
    this.Expense = obj;
    this.Expense.ExpenseDateString = new Date(this.Expense.ExpenseDate);
    this.Expense.SearchExpenseHead = this.AllExpenseHeadList.find(x => x.ExpenseHeadId == this.Expense.ExpenseHeadId).SearchExpenseHead;
  }

}
