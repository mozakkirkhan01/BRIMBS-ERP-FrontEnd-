import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { Status } from '../../../utils/enum';
import { LocalService } from '../../../utils/local.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-transport-duration',
  templateUrl: './transport-duration.component.html',
  styleUrls: ['./transport-duration.component.css']
})
export class TransportDurationComponent {
  dataLoading: boolean = false
  TransportDurationList: any = []
  TransportDuration: any = {}
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  SchoolList: any[] = []
  StatusList = this.loadData.GetEnumList(Status);
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
    this.getTransportDurationList();
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

  @ViewChild('formTransportDuration') formTransportDuration: NgForm;
  resetForm() {
    this.TransportDuration = {};
    this.TransportDuration.Status = 1
    if (this.formTransportDuration) {
      this.formTransportDuration.control.markAsPristine();
      this.formTransportDuration.control.markAsUntouched();
    }
    this.isSubmitted = false
  }

  getTransportDurationList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getTransportDurationList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.TransportDurationList = response.TransportDurationList;

      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveTransportDuration() {
    this.isSubmitted = true;
    this.formTransportDuration.control.markAllAsTouched();
    if (this.formTransportDuration.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.TransportDuration.FromDate = this.loadData.loadDateYMD(this.TransportDuration.FromDate)
    this.TransportDuration.ToDate = this.loadData.loadDateYMD(this.TransportDuration.ToDate);
    this.TransportDuration.CreatedBy = this.staffLogin.StaffLoginId;
    this.TransportDuration.UpdatedBy = this.staffLogin.StaffLoginId;
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.TransportDuration)).toString()
    }
    this.dataLoading = true;
    this.service.saveTransportDuration(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.TransportDuration.TransportDurationId > 0) {
          this.toastr.success("Duration detail updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("New duration added successfully")
        }
        this.resetForm()
        this.getTransportDurationList()
      } else {
        this.toastr.error(response.Message);
        this.TransportDuration.FromDate = new Date(this.TransportDuration.FromDate);
        if (this.TransportDuration.ToDate)
          this.TransportDuration.ToDate = new Date(this.TransportDuration.ToDate);
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteTransportDuration(t1: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var obj: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(t1)).toString()
      }
      this.dataLoading = true;
      this.service.deleteTransportDuration(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getTransportDurationList()
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

  editTransportDuration(obj: any) {
    this.resetForm()
    this.TransportDuration = obj;
    this.TransportDuration.FromDate = new Date(this.TransportDuration.FromDate);
    if (this.TransportDuration.ToDate)
      this.TransportDuration.ToDate = new Date(this.TransportDuration.ToDate);
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
    }))
  }

}
