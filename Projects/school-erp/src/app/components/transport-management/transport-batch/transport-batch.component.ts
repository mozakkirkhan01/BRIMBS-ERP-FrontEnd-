import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { Status } from '../../../utils/enum';
import { LoadDataService } from '../../../utils/load-data.service';
import { LocalService } from '../../../utils/local.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-transport-batch',
  templateUrl: './transport-batch.component.html',
  styleUrls: ['./transport-batch.component.css']
})
export class TransportBatchComponent {

  dataLoading: boolean = false
  TransportBatchList: any = []
  TransportBatch: any = {}
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  SchoolList: any[] = [];
  StatusList = this.loadData.GetEnumList(Status);
  AllStatusList = Status;
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
    private localService: LocalService,
    private loadData: LoadDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getTransportBatchList();
    this.getSchoolList();
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

  @ViewChild('formTransportBatch') formTransportBatch: NgForm;
  resetForm() {
    this.TransportBatch = {};
    this.TransportBatch.Status = 1
    if (this.formTransportBatch) {
      this.formTransportBatch.control.markAsPristine();
      this.formTransportBatch.control.markAsUntouched();
    }
    this.isSubmitted = false
  }

  getTransportBatchList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getTransportBatchList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.TransportBatchList = response.TransportBatchList;

      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveTransportBatch() {
    this.isSubmitted = true;
    this.formTransportBatch.control.markAllAsTouched();
    if (this.formTransportBatch.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.TransportBatch.UpdatedBy = this.staffLogin.StaffLoginId;
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.TransportBatch)).toString()
    }
    this.dataLoading = true;
    this.service.saveTransportBatch(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.TransportBatch.TransportBatchId > 0) {
          this.toastr.success("Batch detail updated successfully.")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("New batch added successfully.")
        }
        this.resetForm()
        this.getTransportBatchList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteTransportBatch(t1: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var obj: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(t1)).toString()
      }
      this.dataLoading = true;
      this.service.deleteTransportBatch(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getTransportBatchList()
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

  editTransportBatch(obj: any) {
    this.resetForm()
    this.TransportBatch = obj
  }

  getSchoolList() {
    var obj = {}
    this.dataLoading = true
    this.service.getSchoolList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.SchoolList = response.SchoolList
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

}
