import { Component, ViewChild } from '@angular/core';
import { AppService } from '../../../utils/app.service';
import { ToastrService } from 'ngx-toastr';
import { LocalService } from '../../../utils/local.service';
import { LoadDataService } from '../../../utils/load-data.service';
import { Router } from '@angular/router';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { ConstantData } from '../../../utils/constant-data';
import { AdmissionType, BloodGroup, Category, Gender, Nationality, PupilStatus, Religion } from '../../../utils/enum';
import { NgForm } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-pupil-profile',
  templateUrl: './pupil-profile.component.html',
  styleUrls: ['./pupil-profile.component.css']
})
export class PupilProfileComponent {
  dataLoading: boolean = false;
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  filterModel: any = {};
  Pupil: any = {};
  isSubmitted: boolean = false;
  AllNationalityList = Nationality;
  AllBloodGroupList = BloodGroup;
  AllReligionList = Religion;
  AllCategoryList = Category;
  AllPupilStatusList = PupilStatus;
  AllGenderList = Gender;
  AllAdmissionTypeList = AdmissionType;
  imageUrl = ConstantData.getBaseUrl();

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private localService: LocalService,
    private loadDataService: LoadDataService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }


  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getSearchPupilList();
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: "/admin/pupil-profile",StaffLoginId:this.staffLogin.StaffLoginId })).toString()
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


  PupilList: any[] = [];
  AllPupilList: any[] = [];
  getSearchPupilList() {
    this.dataLoading = true
    this.service.getSearchPupilList(this.filterModel).subscribe(r1 => {
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


  filterPupilList(event:string) {
    if (event) {
      this.PupilList = this.AllPupilList.filter((option: any) => option.SearchPupil.toLowerCase().includes(event.toLowerCase()));
    } else {
      this.PupilList = this.AllPupilList;
    }
    this.filterModel.PupilAdmissionId = null;
  }

  afterPupilSeleted(event: any) {
    this.filterModel.PupilAdmissionId = event.option.id;
    this.getPupilDetail(event.option.id);
  }

  clearPupil() {
    this.filterModel = {};
    this.filterModel.PupilAdmissionId = null;
    this.PupilList = this.AllPupilList;
  }

  getPupilDetail(pupilAdmissionId: any) {
    var obj: RequestModel = {
      request: this.localService.encrypt(pupilAdmissionId)
    }
    this.dataLoading = true
    this.service.getPupilDetail(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.Pupil = response.Pupil;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false
    }))
  }

  @ViewChild('fromPupilPhoto') formPupil: NgForm;
  setStudentPhotoFile(event: any) {
    var file: File = event.target.files[0];
    if (file.size > 512000) {
      this.toastr.error("Photo size should be less than 500kb");
      this.Pupil.StudentPhoto2 = "";
      return;
    }

    this.Pupil.StudentPhotoFile = file;
  }

  imgChangeEvt: any = '';
  cropImgPreview: any = '';
  onFileChange(event: any): void {
    this.imgChangeEvt = event;
  }
  cropImg(e: ImageCroppedEvent) {
    if (e.objectUrl)
      this.cropImgPreview = this.sanitizer.bypassSecurityTrustUrl(e.objectUrl);
  }
  imgLoad() {
    // display cropper tool
  }
  initCropper() {
    // init cropper
  }

  imgFailed() {
    // error msg
  }

  savePupilPhoto() {
    this.isSubmitted = true;
    this.formPupil.control.markAllAsTouched();
    if (this.formPupil.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return;
    }
    var request = this.localService.encrypt(JSON.stringify({
      PupilId: this.Pupil.PupilId,
      CreatedBy: this.staffLogin.StaffLoginId
    }));
    var formData = new FormData();
    formData.append("request", JSON.stringify(request).toString());
    formData.append("StudentPhoto", this.Pupil.StudentPhotoFile);
    this.dataLoading = true;
    this.service.savePupilPhoto(formData).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success("Photo updated successfully.");
        this.getPupilDetail(this.Pupil.PupilAdmissionId);
        this.Pupil.StudentPhoto2 = "";
        this.isSubmitted = false;
        this.formPupil.control.markAsPristine();
        this.formPupil.control.markAsUntouched();
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data");
      this.dataLoading = true;
    }))
  }


}
