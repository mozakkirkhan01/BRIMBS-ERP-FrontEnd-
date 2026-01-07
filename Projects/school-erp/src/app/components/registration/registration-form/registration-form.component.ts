import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { LocalService } from '../../../utils/local.service';
import { FormFor, Status } from '../../../utils/enum';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent {

  dataLoading = false;
  isSubmitted = false;

  AllSectionList: any[] = []
  SessionList: any[] = []
  ClassList: any[] = []
  RegistrationForm: any = {}
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  StatusList = this.loadata.GetEnumList(Status);
  FormForList = this.loadata.GetEnumList(FormFor);

  editorConfig = {
    base_url: '/tinymce',
    suffix: '.min',
    plugins: 'lists link image table wordcount'
  };

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private localService: LocalService,
    private loadata: LoadDataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getClassList();
    this.getSessionList();
    this.resetForm();
    this.route.paramMap.subscribe((params1: any) => {
      var id = params1.get('id');
      if (id > 0) {
        this.RegistrationForm.RegistrationFormId = id;
        this.dataLoading = true;
        this.service.getRegistrationFormList(this.RegistrationForm).subscribe(r1 => {
          let response = r1 as any
          if (response.Message == ConstantData.SuccessMessage) {
            this.RegistrationForm = response.RegistrationFormList[0];
            this.RegistrationForm.StartDateString = new Date(this.RegistrationForm.StartDate);
            if (this.RegistrationForm.EndDate) {
              this.RegistrationForm.EndDateString = this.loadata.loadDateYMD(this.RegistrationForm.EndDate);
            }
            if (this.RegistrationForm.FromDOB) {
              this.RegistrationForm.FromDOBString = this.loadata.loadDateYMD(this.RegistrationForm.FromDOB);
            }
            if (this.RegistrationForm.ToDOB) {
              this.RegistrationForm.ToDOBString = this.loadata.loadDateYMD(this.RegistrationForm.ToDOB);
            }
          } else {
            this.toastr.error(response.Message)
          }
          this.dataLoading = false
        }, (err => {
          this.toastr.error("Error while fetching records")
        }))
      }

    });

    // this.route.queryParams
    //   .subscribe((params: any) => {
    //     if (params.p1 > 0) {
    //       this.RegistrationForm.RegistrationFormId = params.p1;
    //       this.dataLoading = true;
    //       this.service.getRegistrationFormList(this.RegistrationForm).subscribe(r1 => {
    //         let response = r1 as any
    //         if (response.Message == ConstantData.SuccessMessage) {
    //           this.RegistrationForm = response.RegistrationFormList[0];
    //           this.RegistrationForm.StartDateString = new Date(this.RegistrationForm.StartDate);
    //           if (this.RegistrationForm.EndDate) {
    //             this.RegistrationForm.EndDateString = this.loadata.loadDateYMD(this.RegistrationForm.EndDate);
    //           }
    //           if (this.RegistrationForm.FromDOB) {
    //             this.RegistrationForm.FromDOBString = this.loadata.loadDateYMD(this.RegistrationForm.FromDOB);
    //           }
    //           if (this.RegistrationForm.ToDOB) {
    //             this.RegistrationForm.ToDOBString = this.loadata.loadDateYMD(this.RegistrationForm.ToDOB);
    //           }
    //         } else {
    //           this.toastr.error(response.Message)
    //         }
    //         this.dataLoading = false
    //       }, (err => {
    //         this.toastr.error("Error while fetching records")
    //       }))
    //     }
    //     this.getFeeRegistrationList();
    //   });
  }

  validiateMenu() {
    var urls = this.router.url.split("/");
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: `/${urls[1]}`+`/${urls[2]}`,StaffLoginId:this.staffLogin.StaffLoginId })).toString()
    }
    this.dataLoading = true
    this.service.validiateMenu(obj).subscribe((response: any) => {
      this.action = this.loadata.validiateMenu(response, this.toastr, this.router)
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  @ViewChild('formRegistrationForm') formRegistrationForm: NgForm;
  resetForm() {
    this.RegistrationForm = {};
    this.RegistrationForm.Status = 1;
    this.RegistrationForm.FormFor = FormFor.AllSchool;
    this.RegistrationForm.SessionId = this.CurrentSessionId;
    this.RegistrationForm.StartDateString = new Date();
    if (this.formRegistrationForm) {
      this.formRegistrationForm.control.markAsPristine();
      this.formRegistrationForm.control.markAsUntouched();
    }
    this.isSubmitted = false
  }

  FeeRegistrationList: any[] = [];
  getFeeRegistrationList() {
    this.dataLoading = true
    this.service.getFeeRegistrationList(this.RegistrationForm).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.FeeRegistrationList = response.FeeRegistrationList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false
    }))
  }

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
      this.dataLoading = false
    }))
  }

  setThumbnailPhotoFile(event: any) {
    var file: File = event.target.files[0];
    if (file.type != 'image/jpg' && file.type != 'image/png' && file.type != 'image/jpeg') {
      this.toastr.error("Invalid file format !!");
      this.RegistrationForm.ThumbnailPhotoFile = null;
      this.RegistrationForm.ThumbnailPhoto = '';
      this.RegistrationForm.ThumbnailPhotoName = null;
      return;
    }
    if (file.size < 512000) {
      this.RegistrationForm.ThumbnailPhotoName = file.name;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', (e1: any) => {
        var dataUrl = e1.target.result;
        var base64Data: string = dataUrl.substr(dataUrl.indexOf('base64,') + 'base64,'.length);
        this.RegistrationForm.ThumbnailPhoto = base64Data;
      });

    } else {
      this.RegistrationForm.ThumbnailPhoto = '';
      this.RegistrationForm.ThumbnailPhotoFile = null;
      this.RegistrationForm.ThumbnailPhotoName = null;
      this.toastr.error("File size should be less than 500 KB.");
    }

  }

  saveRegistrationForm() {
    this.formRegistrationForm.control.markAllAsTouched();
    if (this.formRegistrationForm.invalid) {
      this.toastr.warning("Fill all the required fields")
      return
    }
    this.RegistrationForm.StartDate = this.loadata.loadDateYMD(this.RegistrationForm.StartDateString);
    if (this.RegistrationForm.EndDateString) {
      this.RegistrationForm.EndDate = this.loadata.loadDateYMD(this.RegistrationForm.EndDateString);
    }
    if (this.RegistrationForm.FromDOBString) {
      this.RegistrationForm.FromDOB = this.loadata.loadDateYMD(this.RegistrationForm.FromDOBString);
    }
    if (this.RegistrationForm.ToDOBString) {
      this.RegistrationForm.ToDOB = this.loadata.loadDateYMD(this.RegistrationForm.ToDOBString);
    }
    var obj = {
      RegistrationFrom: this.RegistrationForm,
      FeeRegistrationList: this.FeeRegistrationList.filter(x1 => x1.FeeAmount > 0 || x1.SameSchoolFeeAmount > 0),
      StaffLoginId: this.staffLogin.StaffLoginId,
    }
    this.dataLoading = true;
    this.service.saveRegistrationForm(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.RegistrationForm.RegistrationFormId > 0) {
          this.toastr.success("Registration form detail updated successfull");
          history.back();
          // this.router.navigate(["/admin/registration-form-list"]);
        } else {
          this.toastr.success("Registration form created successfull");
          this.resetForm();
        }
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while Submitting data")
      this.dataLoading = false;
    }))
  }

  CurrentSessionId: any = "";
  getSessionList() {
    var obj = {}
    this.dataLoading = true
    this.service.getSessionList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.SessionList = response.SessionList;
        this.CurrentSessionId = response.CurrentSessionId;
        this.RegistrationForm.SessionId = response.CurrentSessionId;

      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }
}
