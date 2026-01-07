import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { Status } from '../../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { Router } from '@angular/router';
declare var $: any

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css']
})
export class HeadComponent {

  dataLoading: boolean = false
  HeadList: any[] = []
  Head: any = {}
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  StatusList = this.loadData.GetEnumList(Status);
  AllStatus = Status;
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
    private localService:LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getHeadList();
    this.getAccountList();
    this.resetForm();
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
      this.toastr.error(ConstantData.serverMessage)
      this.dataLoading = false;
    }))
  }

  @ViewChild('formHead') formHead: NgForm;
  resetForm() {
    this.Head = {};
    if (this.formHead) {
      this.formHead.control.markAsPristine();
      this.formHead.control.markAsUntouched();
    }
    this.isSubmitted = false
    this.Head.Status = 1
  }

  selectChange(obj: any) {
    if (obj.IsSelected) {
      obj.IsCompulsory = true
    } else {
      obj.IsCompulsory = false;
    }
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
  getHeadList() {
    var obj:RequestModel = {
      request:this.localService.encrypt(JSON.stringify({}))
    }
    this.dataLoading = true
    this.service.getHeadList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.HeadList = response.HeadList;

      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error(ConstantData.serverMessage)
      this.dataLoading = false
    }))
  }

  saveHead() {
    this.isSubmitted = true;
    this.formHead.control.markAllAsTouched();
    if (this.formHead.invalid) {
      this.toastr.error(ConstantData.formInvalidMessage)
      return
    }
    this.dataLoading = true;
    this.Head.CreatedBy = this.staffLogin.StaffLoginId;
    this.Head.UpdatedBy = this.staffLogin.StaffLoginId;
    var obj:RequestModel = {
      request:this.localService.encrypt(JSON.stringify(this.Head))
    }
    this.service.saveHead(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Head.HeadId > 0) {
          this.toastr.success(ConstantData.updateMessage)
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success(ConstantData.submitMessage)
        }
        this.resetForm();
        this.getHeadList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error(ConstantData.serverMessage)
      this.dataLoading = false;
    }))
  }

  deleteHead(obj: any) {
    if (confirm(ConstantData.deleteConfirmation)) {
      var request:RequestModel = {
        request:this.localService.encrypt(JSON.stringify(obj))
      }
      this.dataLoading = true;
      this.service.deleteHead(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success(ConstantData.deleteMessage)
          this.HeadList = this.HeadList.filter(x=>x.HeadId != obj.HeadId);
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

  editHead(obj: any) {
    this.resetForm()
    this.Head = obj
    $('#staticBackdrop').modal('show');
  }
}
