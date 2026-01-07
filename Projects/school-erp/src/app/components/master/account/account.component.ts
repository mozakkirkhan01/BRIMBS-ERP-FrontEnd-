import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { AccountType, Status } from '../../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { Router } from '@angular/router';
declare var $: any

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  dataLoading: boolean = false
  AccountList: any[] = []
  Account: any = {}
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  StatusList = this.loadData.GetEnumList(Status);
  AccountTypeList = this.loadData.GetEnumList(AccountType);
  AllStatus = Status;
  AllAccountType = AccountType;
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p
  }

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
    this.resetForm();
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
      this.toastr.error(ConstantData.serverMessage)
      this.dataLoading = false;
    }))
  }

  @ViewChild('formAccount') formAccount: NgForm;
  resetForm() {
    this.Account = {};
    if (this.formAccount) {
      this.formAccount.control.markAsPristine();
      this.formAccount.control.markAsUntouched();
    }
    this.isSubmitted = false
    this.Account.Status = 1
  }

  selectChange(obj: any) {
    if (obj.IsSelected) {
      obj.IsCompulsory = true
    } else {
      obj.IsCompulsory = false;
    }
  }

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

  saveAccount() {
    this.isSubmitted = true;
    this.formAccount.control.markAllAsTouched();
    if (this.formAccount.invalid) {
      this.toastr.error(ConstantData.formInvalidMessage)
      return
    }
    this.dataLoading = true;
    if (this.Account.AccountId)
      this.Account.UpdatedBy = this.staffLogin.StaffLoginId;
    else
      this.Account.CreatedBy = this.staffLogin.StaffLoginId;
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Account))
    }
    this.service.saveAccount(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Account.AccountId > 0) {
          this.toastr.success(ConstantData.updateMessage)
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success(ConstantData.submitMessage)
        }
        this.resetForm();
        this.getAccountList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error(ConstantData.serverMessage)
      this.dataLoading = false;
    }))
  }

  deleteAccount(obj: any) {
    if (confirm(ConstantData.deleteConfirmation)) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj))
      }
      this.dataLoading = true;
      this.service.deleteAccount(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success(ConstantData.deleteMessage)
          this.AccountList = this.AccountList.filter(x => x.AccountId != obj.AccountId);
        } else {
          this.toastr.error(response.Message)
        }
        this.dataLoading = false;
      }, (err => {
        this.toastr.error(ConstantData.serverMessage)
        this.dataLoading = false;
      }))
    }
  }

  editAccount(obj: any) {
    this.resetForm()
    this.Account = obj
    $('#staticBackdrop').modal('show');
  }
}
