import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LocalService } from '../../../utils/local.service';
import { DashboardItem, Status } from '../../../utils/enum';
import { LoadDataService } from '../../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  dataLoading: boolean = false
  DashboardList: any = []
  Dashboard: any = {}
  PageSizes = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSizes[0];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  StatusList = this.loadData.GetEnumList(Status);
  DashboardItems = this.loadData.GetEnumList(DashboardItem);
  AllDashboardItems = DashboardItem;
  AllStatusList = Status;

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
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
    this.getDashboardList();
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


  @ViewChild('formDashboard') formDashboard: NgForm;
  resetForm() {
    this.Dashboard = {
      Status: Status.Active
    };
    if (this.formDashboard) {
      this.formDashboard.control.markAsPristine();
      this.formDashboard.control.markAsUntouched();
    }
  }
  getDashboardList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getDashboardList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.DashboardList = response.DashboardList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error(ConstantData.serverMessage)
      this.dataLoading = false;
    }))
  }

  saveDashboard() {
    this.formDashboard.control.markAllAsTouched();
    if (this.formDashboard.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    this.Dashboard.UpdatedBy = this.staffLogin.StaffLoginId;
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Dashboard)).toString()
    }
    this.dataLoading = true;
    this.service.saveDashboard(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Dashboard.DashboardId > 0) {
          this.toastr.success(ConstantData.updateMessage)
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success(ConstantData.submitMessage)
        }
        this.resetForm();
        this.getDashboardList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error(ConstantData.serverMessage)
      this.dataLoading = false;
    }))
  }

  deleteDashboard(obj: any) {
    if (confirm(ConstantData.deleteConfirmation)) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true;
      this.service.deleteDashboard(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success(ConstantData.deleteMessage)
          this.getDashboardList()
        } else {
          this.toastr.error(response.Message)
          this.dataLoading = false;
        }
      }, (err => {
        this.toastr.error(ConstantData.serverMessage)
        this.dataLoading = false;
      }))
    }
  }

  editDashboard(obj: any) {
    this.resetForm()
    this.Dashboard = obj;
    $('#staticBackdrop').modal('show');
  }
}

