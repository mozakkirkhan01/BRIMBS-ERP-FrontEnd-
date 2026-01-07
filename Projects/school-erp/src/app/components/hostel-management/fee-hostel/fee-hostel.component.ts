import { Component } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LocalService } from '../../../utils/local.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LoadDataService } from '../../../utils/load-data.service';
import { Router } from '@angular/router';
import { Status } from '../../../utils/enum';
declare var $: any

@Component({
  selector: 'app-fee-hostel',
  templateUrl: './fee-hostel.component.html',
  styleUrls: ['./fee-hostel.component.css']
})
export class FeeHostelComponent {

  dataLoading: boolean = false
  FeeHostelList: any = []
  FeeHostel: any = {}
  isSubmitted = false
  StatusList: any[] = this.loadData.GetEnumList(Status);
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  HostelDurationList: any[] = []
  HostelDurationObj: any = {}
  HostelList: any[] = []
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
    this.getClassList();
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

  resetForm() {
    this.FeeHostel = {}
    this.FeeHostelList = [];
    this.isSubmitted = false;
  }

  ClassList: any[] = [];
  getClassList() {
    var obj = {}
    this.dataLoading = true
    this.service.getClassList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.ClassList = response.ClassList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  getFeeHostelList() {
    if (this.FeeHostel.ClassId == null || this.FeeHostel.HostelDurationId == null) {
      this.FeeHostelList = [];
      return;
    }
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FeeHostel)).toString()
    }
    this.dataLoading = true
    this.service.getFeeHostelList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.FeeHostelList = response.FeeHostelList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false
    }))
  }

  saveFeeHostel(form: NgModel) {
    this.isSubmitted = true

    var FeeHostelList: any[] = [];
    this.FeeHostelList.forEach((e1: any) => {
      e1.FeeHostelList.forEach((e2: any) => {
        e2.HostelId = e1.HostelId;
        FeeHostelList.push(e2);
      });
    });
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({
        StaffLoginId: this.staffLogin.StaffLoginId,
        FeeHostelList: FeeHostelList
      })).toString()
    }
    this.dataLoading = true
    this.service.saveFeeHostel(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.FeeHostel.FeeHostelId > 0) {
          this.toastr.success("FeeHostel Updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("FeeHostel added successfully")
        }
        this.FeeHostelList = [];
        // this.resetForm()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  editFeeHostel(obj: any) {
    this.resetForm()
    this.FeeHostel = obj
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
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

}
