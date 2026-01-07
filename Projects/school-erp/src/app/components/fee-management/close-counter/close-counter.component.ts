import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { Router } from '@angular/router';
import { AppService } from '../../../utils/app.service';

@Component({
  selector: 'app-close-counter',
  templateUrl: './close-counter.component.html',
  styleUrls: ['./close-counter.component.css']
})
export class CloseCounterComponent {
  dataLoading: boolean = false
  CashbookList: any = []
  Cashbook: any = {}
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = true;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.resetForm();
    this.getCashbookList();
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
  resetForm() {
    this.Cashbook = {
      CashbookCategoryId: this.Cashbook.CashbookCategoryId,
      CashbookDateString: new Date(),
    };
    if (this.formCashbook) {
      this.formCashbook.control.markAsPristine();
      this.formCashbook.control.markAsUntouched();
    }
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }


  LastCashbookList: any[] = [];
  getCashbookForEntry() {
    var obj = {
      CashbookDate: this.loadData.loadDateYMD(this.Cashbook.CashbookDateString),
    }
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true
    this.service.getCashbookForEntry(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.CashbookList = response.CashbookList;
      } else {
        this.toastr.error(response.Message)
        this.CashbookList = [];
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  getCashbookList() {
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ NoOfRecord: 10 })).toString()
    }
    this.dataLoading = true
    this.service.getCashbookList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.LastCashbookList = response.CashbookList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  
  deleteCashbook(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true;
      this.service.deleteCashbook(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getCashbookList()
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


  saveCashbook() {
    this.isSubmitted = true;
    this.formCashbook.control.markAllAsTouched();
    if (this.formCashbook.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    var obj = {
      CashbookList: this.CashbookList,
      StaffLoginId: this.staffLogin.StaffLoginId
    }
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true;
    this.service.saveCashbook(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success(ConstantData.submitMessage)
        this.CashbookList = [];
        this.getCashbookList();
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }
}
