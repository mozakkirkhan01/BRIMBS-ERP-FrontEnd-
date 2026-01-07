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
  selector: 'app-expense-head',
  templateUrl: './expense-head.component.html',
  styleUrls: ['./expense-head.component.css']
})
export class ExpenseHeadComponent {

  dataLoading: boolean = false
  ExpenseHeadList: any = []
  ExpenseHead: any = {}
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  //  StatusList = this.loadData.GetEnumList(Status);
  //  AllStatusList=Status;
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
    this.getExpenseHeadList();
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
  @ViewChild('formExpenseHead') formExpenseHead: NgForm;
  resetForm() {
    this.ExpenseHead = {
      ExpenseCategoryId : this.ExpenseHead.ExpenseCategoryId
    };
    if (this.formExpenseHead) {
      this.formExpenseHead.control.markAsPristine();
      this.formExpenseHead.control.markAsUntouched();
    }
    this.isSubmitted = false
    this.ExpenseHead.Status = 1
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p
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
        this.ExpenseHeadList = response.ExpenseHeadList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }


  saveExpenseHead() {
    this.isSubmitted = true;
    this.formExpenseHead.control.markAllAsTouched();
    if (this.formExpenseHead.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.ExpenseHead.CreatedBy = this.staffLogin.StaffLoginId;
    this.ExpenseHead.UpdatedBy = this.staffLogin.StaffLoginId;

    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.ExpenseHead)).toString()
    }
    this.dataLoading = true;
    this.service.saveExpenseHead(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.ExpenseHead.ExpenseHeadId > 0) {
          this.toastr.success("Record Updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("Record added successfully")
        }
        this.resetForm()
        this.getExpenseHeadList()
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteExpenseHead(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true;
      this.service.deleteExpenseHead(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getExpenseHeadList()
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

  editExpenseHead(obj: any) {
    this.resetForm()
    this.ExpenseHead = obj
  }

}
