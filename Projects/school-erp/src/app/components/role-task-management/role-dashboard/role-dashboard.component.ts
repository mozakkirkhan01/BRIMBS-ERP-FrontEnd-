import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LocalService } from '../../../utils/local.service';
import { Status } from '../../../utils/enum';
import { LoadDataService } from '../../../utils/load-data.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';

@Component({
  selector: 'app-role-dashboard',
  templateUrl: './role-dashboard.component.html',
  styleUrls: ['./role-dashboard.component.css']
})
export class RoleDashboardComponent {

  dataLoading: boolean = false
  RoleDashboard: any = {}
  PageSizes = ConstantData.PageSizes;
  RoleList: any[] = []
  AllRoleDashboardList: any[] = []
  filterRole: any[] = []
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  Search: any = null;
  StatusList = this.loadData.GetEnumList(Status);

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private localService: LocalService,
    private loadData: LoadDataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getRoleList();
    this.route.paramMap.subscribe((params1: any) => {
      var id = params1.get('id');
      if (id) {
        this.RoleDashboard.RoleId = id;
        this.getRoleDashboardList({ id: id });
      }
    });
    // this.activatedRoute.queryParams.subscribe((x1) => {
    //   if (x1['id']) {
    //     this.RoleDashboard.RoleId = x1['id'];
    //     this.getRoleDashboardList(x1);
    //     //this.RoleDashboard.RoleTitle =this.RoleList.filter(x=>x.RoleId == this.RoleDashboard.RoleId)[0];
    //   }
    // })
  }

  validiateMenu() {
    var urls = this.router.url.split("/");
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: `/${urls[1]}` + `/${urls[2]}`, StaffLoginId: this.staffLogin.StaffLoginId })).toString()
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


  @ViewChild('formRoleDashboard') formRoleDashboard: NgForm;
  resetForm() {
    this.RoleDashboard = {};
    this.AllRoleDashboardList = [];
    if (this.formRoleDashboard) {
      this.formRoleDashboard.control.markAsPristine();
      this.formRoleDashboard.control.markAsUntouched();
    }
    this.filterRoleList(null);
  }


  filterRoleList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.filterRole = this.RoleList.filter((option: any) => option.RoleTitle.toLowerCase().includes(filterValue));
    } else {
      this.filterRole = this.RoleList;
    }
    this.AllRoleDashboardList = [];
  }

  changeSelectAll(){
    this.AllRoleDashboardList.forEach(x=>x.IsSelected = this.RoleDashboard.SelectAll);
  }

  getRoleList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getRoleList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.RoleList = response.RoleList;
        this.filterRoleList(null);
        if (this.RoleDashboard.RoleId)
          this.RoleDashboard.RoleTitle = this.RoleList.filter(x => x.RoleId == this.RoleDashboard.RoleId)[0].RoleTitle;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error whilte fetching Role list")
      this.dataLoading = false;
    }))
  }

  getRoleDashboardList(option: any) {
    this.RoleDashboard.RoleId = option.id;
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ RoleId: this.RoleDashboard.RoleId, Status: 1 })).toString()
    }
    this.dataLoading = true
    this.service.getRoleDashboardList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllRoleDashboardList = response.AllRoleDashboardList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveRoleDashboard() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({
        RoleId: this.RoleDashboard.RoleId,
        StaffLoginId: this.staffLogin.StaffLoginId,
        RoleDashboardList: this.AllRoleDashboardList
      })).toString()
    }
    this.dataLoading = true;
    this.service.saveRoleDashboard(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.RoleDashboard.RoleDashboardId > 0) {
          this.toastr.success(ConstantData.updateMessage)
        } else {
          this.toastr.success(ConstantData.submitMessage)
        }
        this.resetForm();
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
