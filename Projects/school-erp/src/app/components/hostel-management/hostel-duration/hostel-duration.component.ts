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
  selector: 'app-hostel-duration',
  templateUrl: './hostel-duration.component.html',
  styleUrls: ['./hostel-duration.component.css']
})
export class HostelDurationComponent {
  dataLoading: boolean = false
  HostelDurationList: any = []
  HostelDuration: any = {}
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
    this.getHostelDurationList();
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

  @ViewChild('formHostelDuration') formHostelDuration: NgForm;
  resetForm() {
    this.HostelDuration = {};
    this.HostelDuration.Status = 1
    if (this.formHostelDuration) {
      this.formHostelDuration.control.markAsPristine();
      this.formHostelDuration.control.markAsUntouched();
    }
    this.isSubmitted = false
  }

  getHostelDurationList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getHostelDurationList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.HostelDurationList = response.HostelDurationList;

      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveHostelDuration() {
    this.isSubmitted = true;
    this.formHostelDuration.control.markAllAsTouched();
    if (this.formHostelDuration.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.HostelDuration.FromDate = this.loadData.loadDateYMD(this.HostelDuration.FromDate)
    this.HostelDuration.ToDate = this.loadData.loadDateYMD(this.HostelDuration.ToDate);
    this.HostelDuration.CreatedBy = this.staffLogin.StaffLoginId;
    this.HostelDuration.UpdatedBy = this.staffLogin.StaffLoginId;
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.HostelDuration)).toString()
    }
    this.dataLoading = true;
    this.service.saveHostelDuration(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.HostelDuration.HostelDurationId > 0) {
          this.toastr.success("Duration detail updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("New duration added successfully")
        }
        this.resetForm()
        this.getHostelDurationList()
      } else {
        this.toastr.error(response.Message);
        this.HostelDuration.FromDate = new Date(this.HostelDuration.FromDate);
        if (this.HostelDuration.ToDate)
          this.HostelDuration.ToDate = new Date(this.HostelDuration.ToDate);
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteHostelDuration(t1: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var obj: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(t1)).toString()
      }
      this.dataLoading = true;
      this.service.deleteHostelDuration(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getHostelDurationList()
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

  editHostelDuration(obj: any) {
    this.resetForm()
    this.HostelDuration = obj;
    this.HostelDuration.FromDate = new Date(this.HostelDuration.FromDate);
    if (this.HostelDuration.ToDate)
      this.HostelDuration.ToDate = new Date(this.HostelDuration.ToDate);
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
