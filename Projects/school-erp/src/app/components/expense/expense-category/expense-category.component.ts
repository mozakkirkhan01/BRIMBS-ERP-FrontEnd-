import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { Router } from '@angular/router';
import { ExpenseService } from '../../../services/expense.service';
import { AppService } from '../../../utils/app.service';
import { Status } from '../../../utils/enum';
declare var $: any

@Component({
  selector: 'app-expense-category',
  templateUrl: './expense-category.component.html',
  styleUrls: ['./expense-category.component.css']
})
export class ExpenseCategoryComponent {

  dataLoading: boolean = false
  ExpenseCategoryList: any = []
  ExpenseCategory: any = {}
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
   StatusList = this.loadData.GetEnumList(Status);
   AllStatusList=Status;
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;

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
    this.resetForm();
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
  @ViewChild('formExpenseCategory') formExpenseCategory: NgForm;
  resetForm() {
    this.ExpenseCategory = {};
    if (this.formExpenseCategory) {
      this.formExpenseCategory.control.markAsPristine();
      this.formExpenseCategory.control.markAsUntouched();
    }
    this.isSubmitted = false
    this.ExpenseCategory.Status = 1
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p
  }

  

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


  saveExpenseCategory() {
    this.isSubmitted = true;
    this.formExpenseCategory.control.markAllAsTouched();
    if (this.formExpenseCategory.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.ExpenseCategory.CreatedBy = this.staffLogin.StaffLoginId;
    this.ExpenseCategory.UpdatedBy = this.staffLogin.StaffLoginId;

    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.ExpenseCategory)).toString()
    }
    this.dataLoading = true;
    this.service.saveExpenseCategory(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.ExpenseCategory.ExpenseCategoryId > 0) {
          this.toastr.success("Record Updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("Record added successfully")
        }
        this.resetForm()
        this.getExpenseCategoryList()
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteExpenseCategory(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true;
      this.service.deleteExpenseCategory(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getExpenseCategoryList()
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

  editExpenseCategory(obj: any) {
    this.resetForm()
    this.ExpenseCategory = obj
  }

}
