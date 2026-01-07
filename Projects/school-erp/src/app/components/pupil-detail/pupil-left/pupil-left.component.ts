import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { LocalService } from '../../../utils/local.service';
import { AdmissionType, BloodGroup, Category, Gender, Nationality, PupilStatus, Religion } from '../../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pupil-left',
  templateUrl: './pupil-left.component.html',
  styleUrls: ['./pupil-left.component.css']
})
export class PupilLeftComponent {
  dataLoading: boolean = false
  PupilLeft: any = {}
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  AllNationalityList = Nationality;
  AllBloodGroupList = BloodGroup;
  AllReligionList = Religion;
  AllCategoryList = Category;
  AllPupilStatusList = PupilStatus;
  AllGenderList = Gender;
  AllAdmissionTypeList = AdmissionType;

  constructor(
    private service: AppService,
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
        this.PupilLeft = JSON.parse(this.localService.decrypt(this.loadDataService.restoreSpecialCharacter(id)));
        this.PupilLeft.SearchPupil = `${this.PupilLeft.AdmissionNo} - ${this.PupilLeft.PupilName} - ${this.PupilLeft.ClassName} - ${this.PupilLeft.SectionName}`;
        this.getPupilDetail(this.PupilLeft.PupilAdmissionId);
      } else {
        this.getSearchPupilList();
      }
    });
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: '/admin/pupil-left',StaffLoginId:this.staffLogin.StaffLoginId })).toString()
    }
    this.dataLoading = true
    this.service.validiateMenu(obj).subscribe((response: any) => {
      this.action = this.loadDataService.validiateMenu(response, this.toastr, this.router)
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  @ViewChild('formPupilLeft') formPupilLeft: NgForm;
  resetForm() {
    this.PupilLeft = { LeftDate: new Date() };
    if (this.formPupilLeft) {
      this.formPupilLeft.control.markAsPristine();
      this.formPupilLeft.control.markAsUntouched();
    }
  }


  savePupilLeft() {
    this.formPupilLeft.control.markAllAsTouched();
    if (this.formPupilLeft.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    this.PupilLeft.LeftDate = this.loadDataService.loadDateYMD(this.PupilLeft.LeftDate);
    if (this.PupilLeft.PupilLeftId > 0)
      this.PupilLeft.UpdatedBy = this.staffLogin.StaffLoginId;
    this.PupilLeft.CreatedBy = this.staffLogin.StaffLoginId;

    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.PupilLeft))
    }
    this.dataLoading = true;
    this.service.savePupilLeft(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.PupilLeft.PupilLeftId > 0) {
          this.toastr.success("Student Left Updated successfully")
          history.back();
        } else {
          this.toastr.success("Student Left added successfully");
          this.getSearchPupilList();
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


  AllPupilList: any[] = [];
  PupilList: any[] = [];
  getSearchPupilList() {
    this.dataLoading = true
    this.service.getSearchPupilList({ PupilStatus: PupilStatus.Active }).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllPupilList = response.PupilList;
        this.AllPupilList.map(x1 => x1.SearchPupil = `${x1.AdmissionNo} - ${x1.PupilName} - ${x1.ClassName} - ${x1.SectionName}`);
        this.PupilList = this.AllPupilList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false
    }))
  }

  filterPupilList(event:any) {
    if (event) {
      this.PupilList = this.AllPupilList.filter((option: any) => option.SearchPupil.toLowerCase().includes(event.toLowerCase()));
    } else {
      this.PupilList = this.AllPupilList;
    }
    this.PupilLeft.PupilId = null;
  }

  afterPupilSeleted(event: any) {
    this.PupilLeft.PupilAdmissionId = event.option.id;
    this.getPupilDetail(this.PupilLeft.PupilAdmissionId);
  }

  clearPupil() {
    this.PupilLeft = {};
    this.resetForm();
    this.PupilLeft.PupilId = null;
    this.PupilList = this.AllPupilList;
  }

  Pupil: any = {};
  DueDetail: any = {};
  getPupilDetail(pupilAdmissionId: any) {
    var obj: RequestModel = {
      request: this.localService.encrypt(pupilAdmissionId)
    }
    this.dataLoading = true
    this.service.getPupilDetail(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.Pupil = response.Pupil;
        this.DueDetail = response.DueDetail;
        this.PupilLeft.DueMonths = this.DueDetail.DuePeriod;
        this.PupilLeft.DueAmount = this.DueDetail.TotalAmount;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false
    }))
  }
}

