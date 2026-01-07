import { Component,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { Status } from '../../../utils/enum';
import { LoadDataService } from '../../../utils/load-data.service';
import { LocalService } from '../../../utils/local.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { Router } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-hostel',
  templateUrl: './hostel.component.html',
  styleUrls: ['./hostel.component.css']
})
export class HostelComponent {

  dataLoading: boolean = false
  HostelList: any = []
  Hostel: any = {}
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  HostelTypeList: any[] = []
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
    private loadData:LoadDataService,
    private localService:LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getHostelList();
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

  @ViewChild('formHostel') formHostel: NgForm;
  resetForm() {
    this.Hostel = {};
    this.Hostel.Status = 1
    if (this.formHostel) {
      this.formHostel.control.markAsPristine();
      this.formHostel.control.markAsUntouched();
    }
    this.isSubmitted = false
  }


  getHostelList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getHostelList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.HostelList = response.HostelList;

      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveHostel() {
    this.isSubmitted = true;
    this.formHostel.control.markAllAsTouched();
    if (this.formHostel.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.Hostel.CreatedBy = this.staffLogin.StaffLoginId;
    this.Hostel.UpdatedBy = this.staffLogin.StaffLoginId;
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Hostel)).toString()
    }
    this.dataLoading = true;
    this.service.saveHostel(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Hostel.HostelId > 0) {
          this.toastr.success("Hostel detail updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("New hostel added successfully")
        }
        this.resetForm()
        this.getHostelList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteHostel(t1: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var obj: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(t1)).toString()
      }
      this.dataLoading = true;
      this.service.deleteHostel(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getHostelList()
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

  editHostel(obj: any) {
    this.resetForm()
    this.Hostel = obj
  }
}
