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
  selector: 'app-transfer-list',
  templateUrl: './transfer-list.component.html',
  styleUrls: ['./transfer-list.component.css']
})
export class TransferListComponent {
  dataLoading: boolean = false
  TransferList: any[] = []
  Transfer: any = {
    FromDateString:new Date(),
    ToDateString:new Date(),
  }
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = true;
  sortKey: string = 'TransferDate';
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
    this.getTransferList();
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

  @ViewChild('formTransfer') formTransfer: NgForm;

  
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

  getTransferList() {
    this.Transfer.FromDate = this.loadData.loadDateYMD(this.Transfer.FromDateString);
    this.Transfer.ToDate = this.loadData.loadDateYMD(this.Transfer.ToDateString);
    this.Transfer.Amount = 0;
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Transfer)).toString()
    }
    this.dataLoading = true
    this.service.getTransferList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.TransferList = response.TransferList;
        this.TransferList.forEach(e1 => {
          this.Transfer.Amount += e1.Amount; 
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
    this.router.navigate(['/admin/transfer/' + this.loadData.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(obj)))]);
  }

  // printTransferHistory(docType: number, isPrint: boolean) {
  //   this.Transfer.FromDate = this.loadData.loadDateYMD(this.Transfer.FromDateString);
  //   this.Transfer.ToDate = this.loadData.loadDateYMD(this.Transfer.ToDateString);
  //   this.Transfer.IsPrint = isPrint;
  //   this.Transfer.DocType = docType;
  //   this.service.printTransferHistory(this.loadData.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(this.Transfer))));
  // }

  @ViewChild('table_1') table_1: ElementRef;
  isExporting: boolean = false;
  exportToExcel() {
    this.dataLoading = true;
    this.isExporting = true;
    var itemPerPage = this.itemPerPage;
    var p = this.p;
    this.p = 1;
    this.itemPerPage = this.TransferList.length;
    setTimeout(() => {
      this.loadData.exportToExcel(this.table_1, "Deposite History " + this.loadData.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
      this.dataLoading = false;
    }, 1000);

  }
}
