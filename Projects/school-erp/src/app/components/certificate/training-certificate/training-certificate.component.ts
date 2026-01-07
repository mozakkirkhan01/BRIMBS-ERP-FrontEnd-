import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { LocalService } from '../../../utils/local.service';
import { Status } from '../../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../../../services/certificate.service';
import { AppService } from '../../../utils/app.service';

@Component({
  selector: 'app-Training-certificate',
  templateUrl: './Training-certificate.component.html',
  styleUrls: ['./Training-certificate.component.css']
})
export class TrainingCertificateComponent {
  dataLoading: boolean = false
  TrainingCertificate: any = {}
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;

  constructor(
    private service: CertificateService,
    private appService: AppService,
    private toastr: ToastrService,
    private loadDataService: LoadDataService,
    private localService: LocalService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.resetForm();
    this.route.paramMap.subscribe((params1: any) => {
      var id = params1.get('id');
      if (id) {
        this.TrainingCertificate = JSON.parse(this.localService.decrypt(this.loadDataService.restoreSpecialCharacter(id)));
        this.TrainingCertificate.TrainingDateDT = new Date(this.TrainingCertificate.TrainingDate);
      } else {
        this.getStaffList();
      }
    });
  }
  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: '/admin/Training-certificate', StaffLoginId: this.staffLogin.StaffLoginId })).toString()
    }
    this.dataLoading = true
    this.appService.validiateMenu(obj).subscribe((response: any) => {
      this.action = this.loadDataService.validiateMenu(response, this.toastr, this.router)
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }


  @ViewChild('formTrainingCertificate') formTrainingCertificate: NgForm;
  resetForm() {
    this.TrainingCertificate = { TrainingDateDT: new Date() };
    if (this.formTrainingCertificate) {
      this.formTrainingCertificate.control.markAsPristine();
      this.formTrainingCertificate.control.markAsUntouched();
    }
  }


  saveTrainingCertificate() {
    this.formTrainingCertificate.control.markAllAsTouched();
    if (this.formTrainingCertificate.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    if (this.TrainingCertificate.StaffId == 0 || this.TrainingCertificate.StaffId == null) {
      this.toastr.error("Invalid Teacher !!");
      this.clearStaff();
      return;
    }
    this.TrainingCertificate.TrainingDate = this.loadDataService.loadDateYMD(this.TrainingCertificate.TrainingDateDT);
    if (this.TrainingCertificate.TrainingCertificateId > 0)
      this.TrainingCertificate.UpdatedBy = this.staffLogin.StaffLoginId;
    else
      this.TrainingCertificate.CreatedBy = this.staffLogin.StaffLoginId;

    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.TrainingCertificate))
    }
    this.dataLoading = true;
    this.service.saveTrainingCertificate(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.TrainingCertificate.TrainingCertificateId > 0) {
          this.toastr.success("Training Certificate Details Updated Successfully.")
          history.back();
        } else {
          this.toastr.success("Training Certificate Generated Successfully.");
          this.printTrainingCertificate(response.TrainingCertificateId);
        }
        this.resetForm()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  AllStaffList: any[] = [];
  StaffList: any[] = [];
  getStaffList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Status: Status.Active }))
    }
    this.dataLoading = true
    this.appService.getStaffList(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllStaffList = response.StaffList;
        this.AllStaffList.map(x1 => x1.StaffName = `${x1.StaffName}`);
        this.StaffList = this.AllStaffList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false
    }))
  }

  filterStaffList(event: any) {
    if (event) {
      this.StaffList = this.AllStaffList.filter((option: any) => option.StaffName.toLowerCase().includes(event.toLowerCase()));
    } else {
      this.StaffList = this.AllStaffList;
    }
    this.TrainingCertificate.StaffId = null;
  }

  afterStaffSeleted(event: any) {
    this.TrainingCertificate.StaffId = event.option.id;
  }

  clearStaff() {
    this.TrainingCertificate = {};
    this.resetForm();
    this.StaffList = this.AllStaffList;
  }

  printTrainingCertificate(Id: number) {
    this.service.printTrainingCertificate(this.loadDataService.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify({
      Id: Id,
      IsPrint: true,
    }))));
  }
}

