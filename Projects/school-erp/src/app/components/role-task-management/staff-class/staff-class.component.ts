import { Component } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LocalService } from '../../../utils/local.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LoadDataService } from '../../../utils/load-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staff-class',
  templateUrl: './staff-class.component.html',
  styleUrls: ['./staff-class.component.css']
})

export class StaffClassComponent {
  dataLoading: boolean = false
  StaffClass: any = {}
  isSubmitted = false
  StatusList: any[] = []
  PageSizes = ConstantData.PageSizes;
  StaffList: any[] = []
  AllStaffClassList: any[] = []
  filterRole: any[] = []
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  StaffClassList: any[] = []
  Staffobj: any = {}
  AllStaffList: any[] = []


  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService:LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getStaffList();
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


  getStaffList() {
    var obj:RequestModel = {
      request:this.localService.encrypt(JSON.stringify({}))
    }
    this.dataLoading = true
    this.service.getStaffList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllStaffList = response.StaffList
        this.AllStaffList.map(x1 => x1.SearchStaff = `${x1.StaffName} - ${x1.StaffCode} - ${x1.DesignationName}`)
        this.StaffList = this.AllStaffList
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error whilte fetching Staff list")
      this.dataLoading = false;
    }))
  }

  filterStaffList() {
    if (this.Staffobj.SearchStaff) {
      this.StaffList = this.AllStaffList.filter((option: any) => option.SearchStaff.toLowerCase().includes(this.Staffobj.SearchStaff.toLowerCase()));
    } else {
      this.StaffList = this.AllStaffList;
    }
  }

  afterStaffSeleted(event: any) {
    this.StaffClass.StaffId = event.option.id;
    this.getStaffClassList();
    this.onStaffChange(event.option.id)
  }

  selectedStaff: any[] = []
  onStaffChange(StaffId?: number) {
    this.selectedStaff = []
    this.StaffClassList.forEach((e1: any) => {
      if (e1.StaffId == StaffId)
        this.selectedStaff.push(e1)
    })
  }

  getStaffClassList() {
    var obj:RequestModel = {
      request:this.localService.encrypt(JSON.stringify({
        StaffId: this.StaffClass.StaffId,
      }))
    }
    this.dataLoading = true
    this.service.getStaffClassList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllStaffClassList = response.AllStaffClassList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  saveStaffClass(form: NgForm) {
    this.StaffClassList = []
    this.AllStaffClassList.forEach((e1: any) => {
      e1.SectionList.forEach((e2: any) => {
        this.StaffClassList.push(e2)
      });
    })
    var obj:RequestModel = {
      request:this.localService.encrypt(JSON.stringify({
        StaffClassList: this.StaffClassList,
        StaffId: this.StaffClass.StaffId,
        StaffLoginId:this.staffLogin.StaffLoginId
      }))
    }
    this.dataLoading = true;
    this.service.saveStaffClass(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success("Secction Added Successfully")
        this.StaffClass = {};
        this.AllStaffClassList = []
        this.getStaffClassList();
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;

      }
    }, (err => {
      this.toastr.error("Error while adding sections")
      this.dataLoading = false;
    }))
    this.dataLoading = false;
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



}