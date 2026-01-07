
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LocalService } from '../../../utils/local.service';
import { Status } from '../../../utils/enum';
import { LoadDataService } from '../../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-staff-login',
  templateUrl: './staff-login.component.html',
  styleUrls: ['./staff-login.component.css']
})
export class StaffLoginComponent {

  dataLoading: boolean = false
  StaffLoginList: any = []
  StaffLogin: any = {}
  isSubmitted = false
  StaffList: any[] = []
  SchoolList: any[] = []
  filterStaff: any[] = []
  hide = true
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  StatusList = this.loadData.GetEnumList(Status);
  AllStatusList = Status;
  StaffLoginRoleList: any[] = [];
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
    this.getStaffLoginList();
    this.getStaffList();
    this.getSchoolList();
    this.getRoleList();
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

  @ViewChild('formStaffLogin') formStaffLogin: NgForm;
  resetForm() {
    this.StaffLogin = {};
    this.StaffLogin.Status = 1
    if (this.formStaffLogin) {
      this.formStaffLogin.control.markAsPristine();
      this.formStaffLogin.control.markAsUntouched();
    }
    this.isSubmitted = false
  }

  newStaffLogin() {
    if (this.ClassSectionList.length == 0)
      this.getClassSectionList();
    else {
      this.ClassSectionList.forEach(x1 => {
        x1.IsSelectAll = false;
        x1.SectionList.forEach((x2: any) => {
          x2.StaffClassId = 0;
          x2.IsSelected = false;
        })
      })
    }

    this.resetForm();
    this.StaffLoginRoleList.forEach(e1 => {
      e1.IsSelected = false;
      e1.StaffLoginRoleId = 0;
    });
    $('#staticBackdrop').modal('show');
  }

  editStaffLogin(obj: any) {
    if (this.ClassSectionList.length == 0)
      this.getClassSectionList();
    else {
      this.ClassSectionList.forEach(x1 => {
        x1.IsSelectAll = false;
        x1.SectionList.forEach((x2: any) => {
          var staffClasses = obj.StaffClassList.filter((y1: any) => y1.ClassId == x1.ClassId && y1.SectionId == x2.SectionId && y1.StaffClassId > 0);
          if (staffClasses.length == 0) {
            x2.StaffClassId = 0;
            x2.IsSelected = false;
          } else {
            x2.StaffClassId = staffClasses[0].StaffClassId;
            x2.IsSelected = true;
          }
        })
      });
    }
    this.resetForm()
    this.StaffLogin = obj;
    this.StaffLoginRoleList.forEach(e1 => {
      var staffloginRole: any = obj.StaffLoginRoleList.filter((x1: any) => x1.RoleId == e1.RoleId);
      if (staffloginRole.length > 0) {
        e1.IsSelected = true;
        e1.StaffLoginRoleId = staffloginRole[0].StaffLoginRoleId;
      }
      else {
        e1.IsSelected = false;
        e1.StaffLoginRoleId = 0;
      }
    });
    $('#staticBackdrop').modal('show');
  }

  ClassSectionList: any[] = [];
  getClassSectionList() {
    this.dataLoading = true
    this.service.getClassSectionList({}).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.ClassSectionList = response.ClassSectionList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }


  selectAllSection(_class: any) {
    _class.SectionList.forEach((e1: any) => {
      if (_class.IsSelectAll) {
        e1.IsSelected = true;
      }
      else {
        e1.IsSelected = false;
      }
    });
  }

  selectAllClass() {
    this.ClassSectionList.forEach(x1 => {
      if (this.StaffLogin.IsSelectAllClass) {
        x1.IsSelectAll = true;
        x1.SectionList.forEach((x2: any) => x2.IsSelected = true);
      } else {
        x1.IsSelectAll = false;
        x1.SectionList.forEach((x2: any) => x2.IsSelected = false);
      }
    });
  }



  filterStaffList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.filterStaff = this.StaffList.filter((option: any) => option.StaffName.toLowerCase().includes(filterValue));
    } else {
      this.filterStaff = this.StaffList;
    }
  }

  getSchoolList() {
    var obj = {}
    this.dataLoading = true
    this.service.getSchoolList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.SchoolList = response.SchoolList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  getRoleList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getRoleList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.StaffLoginRoleList = response.RoleList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  getStaffList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getStaffList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.StaffList = response.StaffList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  getStaffLoginList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getStaffLoginList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.StaffLoginList = response.StaffLoginList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveStaffLogin() {
    this.isSubmitted = true;
    this.formStaffLogin.control.markAllAsTouched();
    if (this.formStaffLogin.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    var staffClassList: any[] = [];
    this.ClassSectionList.forEach(x1 => x1.SectionList.forEach((x2: any) => staffClassList.push(x2)));
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({
        StaffLogin: this.StaffLogin,
        StaffLoginRoleList: this.StaffLoginRoleList.filter((x1: any) => x1.IsSelected),
        StaffClassList: staffClassList,
        StaffLoginId: this.staffLogin.StaffLoginId
      })).toString()
    }
    this.dataLoading = true;
    this.service.saveStaffLogin(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.StaffLogin.StaffLoginId > 0) {
          this.toastr.success("Staff Login Updated successfully")
        } else {
          this.toastr.success("Staff Login added successfully")
        }
        $('#staticBackdrop').modal('hide')
        this.resetForm()
        this.getStaffLoginList()
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteStaffLogin(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var obj2: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true;
      this.service.deleteStaffLogin(obj2).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getStaffLoginList()
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


}
