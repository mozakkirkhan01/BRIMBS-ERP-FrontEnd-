import { Component,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { Status } from '../../../utils/enum';
import { LoadDataService } from '../../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { Router } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-pupil-type',
  templateUrl: './pupil-type.component.html',
  styleUrls: ['./pupil-type.component.css']
})
export class PupilTypeComponent {
  dataLoading: boolean = false
  PupilTypeList: any = []
  PupilType: any = {}
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
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
    private loadData:LoadDataService,
    private localService:LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getPupilTypeList();
    this.resetForm();
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

  @ViewChild('formPupilType') formPupilType: NgForm;
  resetForm() {
    this.PupilType = {};
    if (this.formPupilType) {
      this.formPupilType.control.markAsPristine();
      this.formPupilType.control.markAsUntouched();
    }
    this.isSubmitted = false
    this.PupilType.Status = 1
  }

  getPupilTypeList() {
    var obj = {}
    this.dataLoading = true
    this.service.getPupilTypeList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.PupilTypeList = response.PupilTypeList;

      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  savePupilType() {
    this.isSubmitted = true;
    this.formPupilType.control.markAllAsTouched();
    if (this.formPupilType.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.PupilType.CreatedBy = this.staffLogin.StaffLoginId;
    this.PupilType.UpdatedBy = this.staffLogin.StaffLoginId;
    this.dataLoading = true;
    this.service.savePupilType(this.PupilType).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.PupilType.PupilTypeId > 0) {
          this.toastr.success("Pupil Type Updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("New pupil type added successfully")
        }
        this.resetForm()
        this.getPupilTypeList()
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deletePupilType(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {

      this.dataLoading = true;
      this.service.deletePupilType(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getPupilTypeList()
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

  editPupilType(obj: any) {
    this.resetForm()
    this.PupilType = obj
  }

}
