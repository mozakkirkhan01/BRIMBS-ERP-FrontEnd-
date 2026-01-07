import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { NgForm } from '@angular/forms';
import { LocalService } from '../../../utils/local.service';
import { LoadDataService } from '../../../utils/load-data.service';
import { Status } from '../../../utils/enum';
import { ActionModel, License, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.css']
})
export class LicenseComponent {

  dataLoading: boolean = false
  License: any = {}
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  action: ActionModel = {
    CanCreate: true, CanDelete: true, CanEdit: true,ResponseReceived:true
  } as ActionModel;

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private localService: LocalService,
    private loadData: LoadDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    //this.validiateMenu();
    this.checkLicense(false);
    this.resetForm();
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url, StaffLoginId: this.staffLogin.StaffLoginId })).toString()
    }
    this.dataLoading = true
    this.service.validiateMenu(obj).subscribe((response: any) => {
      if (response.Message == ConstantData.SuccessMessage) {
        this.action = response.Action;
      }
      this.action.ResponseReceived = true;
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }


  @ViewChild('formLicense') formLicense: NgForm;
  resetForm() {
    this.License = { Status: Status.Active };
    if (this.formLicense) {
      this.formLicense.control.markAsPristine();
      this.formLicense.control.markAsUntouched();
    }
  }
  LastLicense: License = {} as License;
  checkLicense(isLogin: boolean) {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.checkLicense(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.LastLicense = response.License;
        if (this.LastLicense.IsValid && isLogin) {
          this.router.navigate(['/admin/admin-dashboard']);
        }
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveLicense() {
    this.formLicense.control.markAllAsTouched();
    if (this.formLicense.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.License.CreatedBy = this.staffLogin.StaffLoginId;
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.License)).toString()
    }
    this.dataLoading = true;
    this.service.saveLicense(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.License.LicenseId > 0) {
          this.toastr.success(ConstantData.updateMessage)
        } else {
          this.toastr.success(ConstantData.submitMessage)
        }
        this.resetForm();
        this.checkLicense(true);
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