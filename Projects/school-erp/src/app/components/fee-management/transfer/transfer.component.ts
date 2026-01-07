import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { ActionModel, KeyValueModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../../utils/app.service';
import { PaymentMode, Status } from '../../../utils/enum';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent {
  dataLoading: boolean = false
  TransferList: any = []
  Transfer: any = {}
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = true;
  sortKey: string = 'TransferDate';
  itemPerPage: number = this.PageSize[0];
  //  StatusList = this.loadData.GetEnumList(Status);
  //  AllStatusList=Status;
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  PaymentModeList: KeyValueModel[] = this.loadData.GetEnumList(PaymentMode);
  AllPaymentModeList = PaymentMode;

  constructor(
    private service: AppService,
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
    this.getAccountList();
    this.route.paramMap.subscribe((params1: any) => {
      var id = params1.get('id');
      if (id) {
        this.Transfer = JSON.parse(this.localService.decrypt(this.loadData.restoreSpecialCharacter(id)));
        this.Transfer.TransferDateString = new Date(this.Transfer.TransferDate);
        this.Transfer.IsUpdate = true;
      } else {
        this.resetForm();
        this.getTransferList();
      }
    });
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: '/admin/transfer', StaffLoginId: this.staffLogin.StaffLoginId })).toString()
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

  @ViewChild('formTransfer') formTransfer: NgForm;
  resetForm() {
    this.Transfer = {
      TransferDateString: new Date(),
      FromAccountId: this.Transfer.FromAccountId,
      ToAccountId: this.Transfer.ToAccountId,
    };
    if (this.formTransfer) {
      this.formTransfer.control.markAsPristine();
      this.formTransfer.control.markAsUntouched();
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
    this.service.getAccountList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AccountList = response.AccountList;
        if (this.AccountList.length > 0)
          this.Transfer.FromAccountId = this.AccountList[0].AccountId;
        if (this.AccountList.length > 1)
          this.Transfer.ToAccountId = this.AccountList[1].AccountId;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }


  getTransferList() {
    var obj = {
      TransferId: 0,
      // NoOfRecord: 10,
      TransferHeadId: this.Transfer.TransferHeadId
    }
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true
    this.service.getTransferList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.TransferList = response.TransferList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }


  saveTransfer() {
    this.isSubmitted = true;
    this.formTransfer.control.markAllAsTouched();
    if (this.formTransfer.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    if (this.Transfer.TransferId > 0)
      this.Transfer.UpdatedBy = this.staffLogin.StaffLoginId;
    else
      this.Transfer.CreatedBy = this.staffLogin.StaffLoginId;
    if (this.loadData.loadDateYMD(this.Transfer.TransferDateString) == this.loadData.loadDateYMD(new Date()))
      this.Transfer.TransferDate = this.loadData.loadDateTime(new Date());
    else
      this.Transfer.TransferDate = this.loadData.loadDateYMD(this.Transfer.TransferDateString);

    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Transfer)).toString()
    }
    this.dataLoading = true;
    this.service.saveTransfer(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Transfer.TransferId > 0) {
          this.toastr.success("Record Updated successfully")
          if (this.Transfer.IsUpdate) {
            history.back();
          }
        } else {
          this.toastr.success("Record added successfully")
        }
        this.resetForm()
        this.getTransferList()
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteTransfer(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true;
      this.service.deleteTransfer(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getTransferList()
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

  editTransfer(obj: any) {
    this.resetForm()
    this.Transfer = obj;
    this.Transfer.TransferDateString = new Date(this.Transfer.TransferDate);
  }

}
