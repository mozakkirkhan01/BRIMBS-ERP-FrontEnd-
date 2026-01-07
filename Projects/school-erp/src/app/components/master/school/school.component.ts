import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LocalService } from '../../../utils/local.service';
import { LoadDataService } from '../../../utils/load-data.service';
import { Status } from '../../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { Router } from '@angular/router';
declare var $: any

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent {
  dataLoading: boolean = false
  SchoolList: any[] = []
  School: any = {}
  isSubmitted = false
  StatusList = this.loadData.GetEnumList(Status);
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  imageUrl = this.service.getImageUrl();
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  AllStatusList = Status;
  recordSchool = "School";

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
    this.getSchoolList();
    this.resetForm();
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

  @ViewChild('formSchool') formSchool: NgForm;
  resetForm() {
    this.School = {}
    if (this.formSchool) {
      this.formSchool.control.markAsPristine();
      this.formSchool.control.markAsUntouched();
    }
    this.isSubmitted = false
    this.School.Status = 1
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p
  }

  getSchoolList() {
    var obj = {}
    this.dataLoading = true
    this.service.getSchoolList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.SchoolList = response.SchoolList;
        if (this.SchoolList.length > 0) {
          this.School = this.SchoolList[0];
          if (this.School.LogoPng)
            this.LogoPngPhoto = this.imageUrl + this.School.LogoPng;

          if (this.School.LogoJpg)
            this.LogoJpgPhoto = this.imageUrl + this.School.LogoJpg;

          if (this.School.ReportBackgroud)
            this.ReportBackgroudPhoto = this.imageUrl + this.School.ReportBackgroud;

          if (this.School.AffiliationLogo)
            this.AffiliationLogoPhoto = this.imageUrl + this.School.AffiliationLogo;

          if (this.School.HeaderPhoto)
            this.HeaderPhotoUrl = this.imageUrl + this.School.HeaderPhoto;

          if (this.School.FooterPhoto)
            this.FooterPhotoUrl = this.imageUrl + this.School.FooterPhoto;
        }
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  ReportBackgroudPhoto:string;
  setReportBackgroudFile(event: any) {
    var file: File = event.target.files[0];
    if (file.type != 'image/png' && file.type != 'image/jpeg' && file.type != 'image/jpg') {
      this.toastr.error("Invalid file format !!");
      this.School.ReportBackgroudFile = null;
      this.School.ReportBackgroud = '';
      this.School.ReportBackgroudName = null;
      if (this.School.ReportBackgroud)
        this.ReportBackgroudPhoto = this.imageUrl + this.School.ReportBackgroud;
      return;
    }
    if (file.size < 512000) {
      this.School.ReportBackgroudName = file.name;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', (e1: any) => {
        var dataUrl = e1.target.result;
        var base64Data: string = dataUrl.substr(dataUrl.indexOf('base64,') + 'base64,'.length);
        this.School.ReportBackgroud = base64Data;
        this.ReportBackgroudPhoto = `data:image/png;base64,${base64Data}`;
      });

    } else {
      if (this.School.ReportBackgroud)
        this.ReportBackgroudPhoto = this.imageUrl + this.School.ReportBackgroud;
      this.School.ReportBackgroud = '';
      this.School.ReportBackgroudFile = null;
      this.School.ReportBackgroudName = null;
      this.toastr.error("File size should be less than 500 KB.");
    }
  }

  AffiliationLogoPhoto:string;
  setAffiliationLogoFile(event: any) {
    var file: File = event.target.files[0];
    if (file.type != 'image/png' && file.type != 'image/jpeg' && file.type != 'image/jpg') {
      this.toastr.error("Invalid file format !!");
      this.School.AffiliationLogoFile = null;
      this.School.AffiliationLogo = '';
      this.School.AffiliationLogoName = null;
      if (this.School.AffiliationLogo)
        this.AffiliationLogoPhoto = this.imageUrl + this.School.AffiliationLogo;
      return;
    }
    if (file.size < 512000) {
      this.School.AffiliationLogoName = file.name;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', (e1: any) => {
        var dataUrl = e1.target.result;
        var base64Data: string = dataUrl.substr(dataUrl.indexOf('base64,') + 'base64,'.length);
        this.School.AffiliationLogo = base64Data;
        this.AffiliationLogoPhoto = `data:image/png;base64,${base64Data}`;
      });

    } else {
      if (this.School.AffiliationLogo)
        this.AffiliationLogoPhoto = this.imageUrl + this.School.AffiliationLogo;
      this.School.AffiliationLogo = '';
      this.School.AffiliationLogoFile = null;
      this.School.AffiliationLogoName = null;
      this.toastr.error("File size should be less than 500 KB.");
    }
  }

  HeaderPhotoUrl:string;
  setHeaderPhotoFile(event: any) {
    var file: File = event.target.files[0];
    if (file.type != 'image/png' && file.type != 'image/jpeg' && file.type != 'image/jpg') {
      this.toastr.error("Invalid file format !!");
      this.School.HeaderPhotoFile = null;
      this.School.HeaderPhoto = '';
      this.School.HeaderPhotoName = null;
      if (this.School.HeaderPhoto)
        this.HeaderPhotoUrl = this.imageUrl + this.School.HeaderPhoto;
      return;
    }
    if (file.size < 512000) {
      this.School.HeaderPhotoName = file.name;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', (e1: any) => {
        var dataUrl = e1.target.result;
        var base64Data: string = dataUrl.substr(dataUrl.indexOf('base64,') + 'base64,'.length);
        this.School.HeaderPhoto = base64Data;
        this.HeaderPhotoUrl = `data:image/png;base64,${base64Data}`;
      });

    } else {
      if (this.School.HeaderPhoto)
        this.HeaderPhotoUrl = this.imageUrl + this.School.HeaderPhoto;
      this.School.HeaderPhoto = '';
      this.School.HeaderPhotoFile = null;
      this.School.HeaderPhotoName = null;
      this.toastr.error("File size should be less than 500 KB.");
    }
  }

  FooterPhotoUrl:string;
  setFooterPhotoFile(event: any) {
    var file: File = event.target.files[0];
    if (file.type != 'image/png' && file.type != 'image/jpeg' && file.type != 'image/jpg') {
      this.toastr.error("Invalid file format !!");
      this.School.FooterPhotoFile = null;
      this.School.FooterPhoto = '';
      this.School.FooterPhotoName = null;
      if (this.School.FooterPhoto)
        this.FooterPhotoUrl = this.imageUrl + this.School.FooterPhoto;
      return;
    }
    if (file.size < 512000) {
      this.School.FooterPhotoName = file.name;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', (e1: any) => {
        var dataUrl = e1.target.result;
        var base64Data: string = dataUrl.substr(dataUrl.indexOf('base64,') + 'base64,'.length);
        this.School.FooterPhoto = base64Data;
        this.FooterPhotoUrl = `data:image/png;base64,${base64Data}`;
      });

    } else {
      if (this.School.FooterPhoto)
        this.FooterPhotoUrl = this.imageUrl + this.School.FooterPhoto;
      this.School.FooterPhoto = '';
      this.School.FooterPhotoFile = null;
      this.School.FooterPhotoName = null;
      this.toastr.error("File size should be less than 500 KB.");
    }
  }

  LogoPngPhoto: string;
  setLogoPngFile(event: any) {
    var file: File = event.target.files[0];
    if (file.type != 'image/png') {
      this.toastr.error("Invalid file format !!");
      this.School.LogoPngFile = null;
      this.School.LogoPng = '';
      this.School.LogoPngName = null;
      this.LogoPngPhoto = this.imageUrl + this.School.LogoPng;
      return;
    }
    if (file.size < 512000) {
      this.School.LogoPngName = file.name;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', (e1: any) => {
        var dataUrl = e1.target.result;
        var base64Data: string = dataUrl.substr(dataUrl.indexOf('base64,') + 'base64,'.length);
        this.School.LogoPng = base64Data;
        this.LogoPngPhoto = `data:image/png;base64,${base64Data}`;
      });

    } else {
      this.School.LogoPng = '';
      this.School.LogoPngFile = null;
      this.School.LogoPngName = null;
      this.LogoPngPhoto = this.imageUrl + this.School.LogoPng;
      this.toastr.error("File size should be less than 500 KB.");
    }

  }

  LogoJpgPhoto:string;
  setLogoJpgFile(event: any) {
    var file: File = event.target.files[0];
    if (file.type != 'image/jpeg' && file.type != 'image/jpg') {
      this.toastr.error("Invalid file format !!");
      this.School.LogoJpgFile = null;
      this.School.LogoJpg = '';
      this.School.LogoJpgName = null;
      if (this.School.LogoJpg)
        this.LogoJpgPhoto = this.imageUrl + this.School.LogoJpg;
      return;
    }
    if (file.size < 512000) {
      this.School.LogoJpgName = file.name;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', (e1: any) => {
        var dataUrl = e1.target.result;
        var base64Data: string = dataUrl.substr(dataUrl.indexOf('base64,') + 'base64,'.length);
        this.School.LogoJpg = base64Data;
        this.LogoJpgPhoto = `data:image/png;base64,${base64Data}`;
      });

    } else {
      if (this.School.LogoJpg)
        this.LogoJpgPhoto = this.imageUrl + this.School.LogoJpg;
      this.School.LogoJpgName = null;
      this.School.LogoJpg = '';
      this.School.LogoJpgFile = null;
      this.toastr.error("File size should be less than 500 KB.");
    }

  }

  saveSchool() {
    this.formSchool.control.markAllAsTouched();
    if (this.formSchool.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    this.School.UpdatedBy = this.staffLogin.StaffLoginId
    this.School.CreatedBy = this.staffLogin.StaffLoginId

    this.dataLoading = true;
    this.service.saveSchool(this.School).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.School.SchoolId > 0) {
          this.toastr.success("School Updated successfully")
        } else {
          this.toastr.success("School added successfully")
        }
        this.resetForm()
        this.getSchoolList()
        $('#staticBackdrop').modal('hide')
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteSchool(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {

      this.dataLoading = true;
      this.service.deleteSchool(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getSchoolList()
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

  editSchool(obj: any) {
    this.resetForm()
    this.School = obj

  }
}
