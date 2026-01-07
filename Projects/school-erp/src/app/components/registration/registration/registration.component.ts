import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { LocalService } from '../../../utils/local.service';
import { BloodGroup, Category, Gender, Nationality, PaymentMode, Religion, SchoolNos, Status } from '../../../utils/enum';
import { ActionModel, FeePaymentDetailModel, FeePaymentModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  dataLoading: boolean = false
  Registration: any = {}
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  StateList: any[] = [];
  State: any = {}
  AllCityList: any[] = [];
  CorrespondenceCityList: any[] = [];
  PermanentCityList: any[] = [];
  SessionList: any[] = [];
  ClassList: any[] = [];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  AllRegistrationFormList: any[] = [];
  RegistrationFormList: any[] = [];
  StatusList = this.loadDataService.GetEnumList(Status);
  GenderList = this.loadDataService.GetEnumList(Gender);
  CategoryList = this.loadDataService.GetEnumList(Category);
  ReligionList = this.loadDataService.GetEnumList(Religion);
  BloodGroupList = this.loadDataService.GetEnumList(BloodGroup);
  NationalityList = this.loadDataService.GetEnumList(Nationality);
  PaymentModeList = this.loadDataService.GetEnumList(PaymentMode);
  FeePayment: any = {};
  FeePaymentDetailList: any[] = [];
  isAccount: boolean = ConstantData.getSchoolNo() == SchoolNos.RPS_Inter_College;

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
    private loadDataService: LoadDataService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getCityList();
    this.getStateList();
    this.getSessionList();
    this.getClassList();
    if (this.isAccount)
      this.getAccountList();
    this.route.paramMap.subscribe((params1: any) => {
      var id = params1.get('id');
      if (id) {
        this.Registration = JSON.parse(this.localService.decrypt(this.loadDataService.restoreSpecialCharacter(id)));
        this.onStateChange(2);
        if (this.Registration.StudentSingnature)
          this.StudentSingnature = this.imageUrl + this.Registration.StudentSingnature;
        if (this.Registration.StudentPhoto)
          this.StudentPhoto = this.imageUrl + this.Registration.StudentPhoto;
      } else {
        this.resetForm();
      }
    });
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: '/admin/registration', StaffLoginId: this.staffLogin.StaffLoginId })).toString()
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

  @ViewChild('formRegistration') formRegistration: NgForm;
  resetForm() {
    this.Registration = {
      RegistrationDate: new Date(),
      SessionId: this.CurrentSessionId
    };
    this.FeePayment = {
      PaymentDate: new Date(),
      PaymentMode: PaymentMode.Cash
    };
    this.StudentPhoto = null;
    this.StudentSingnature = null;
    this.FeePaymentDetailList = [];
    if (this.formRegistration) {
      this.formRegistration.control.markAsPristine();
      this.formRegistration.control.markAsUntouched();
    }
  }
  AccountList: any[] = [];
  getAccountList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({}))
    }
    this.dataLoading = true
    this.service.getAccountList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AccountList = response.AccountList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error(ConstantData.serverMessage)
      this.dataLoading = false
    }))
  }

  StudentPhoto: string | null = null;
  StudentSingnature: string | null = null;
  imageUrl = ConstantData.getBaseUrl();
  setStudentPhotoFile(event: any) {
    var file: File = event.target.files[0];
    if (file.type != 'image/jpeg' && file.type != 'image/jpg' && file.type != 'image/png') {
      this.toastr.error("Invalid file format !!");
      this.Registration.StudentPhotoFile = null;
      this.Registration.StudentPhoto = '';
      this.StudentPhoto = this.imageUrl + this.Registration.StudentPhoto;
      return;
    }
    if (file.size < 512000) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', (e1: any) => {
        var dataUrl = e1.target.result;
        var base64Data: string = dataUrl.substr(dataUrl.indexOf('base64,') + 'base64,'.length);
        this.Registration.StudentPhoto = base64Data;
        this.StudentPhoto = `data:image/png;base64,${base64Data}`;
      });

    } else {
      this.Registration.StudentPhoto = '';
      this.Registration.StudentPhotoFile = null;
      this.StudentPhoto = this.imageUrl + this.Registration.StudentPhoto;
      this.toastr.error("File size should be less than 500 KB.");
    }
  }

  setStudentSingnatureFile(event: any) {
    var file: File = event.target.files[0];
    if (file.type != 'image/jpeg' && file.type != 'image/jpg' && file.type != 'image/png') {
      this.toastr.error("Invalid file format !!");
      this.Registration.StudentSingnatureFile = null;
      this.Registration.StudentSingnature = '';
      this.StudentSingnature = this.imageUrl + this.Registration.StudentSingnature;
      return;
    }
    if (file.size < 512000) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener('load', (e1: any) => {
        var dataUrl = e1.target.result;
        var base64Data: string = dataUrl.substr(dataUrl.indexOf('base64,') + 'base64,'.length);
        this.Registration.StudentSingnature = base64Data;
        this.StudentSingnature = `data:image/jpeg;base64,${base64Data}`;
      });

    } else {
      this.Registration.StudentSingnature = '';
      this.Registration.StudentSingnatureFile = null;
      this.StudentSingnature = this.imageUrl + this.Registration.StudentSingnature;
      this.toastr.error("File size should be less than 500 KB.");
    }
  }

  getFeeRegistrationList() {
    if (this.Registration.SessionId == null || this.Registration.ClassId == null) {
      this.FeePaymentDetailList = []
      this.FeePayment = {} as FeePaymentModel;
      return;
    }
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ SessionId: this.Registration.SessionId, ClassId: this.Registration.ClassId }))
    }
    this.dataLoading = true
    this.service.getFeeRegistrationList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.FeePaymentDetailList = response.FeeRegistrationList;
        this.FeePaymentDetailList.forEach(x1 => {
          x1.IsSelected = true;
          x1.WaiveOffAmount = 0;
          x1.InitialAmount = x1.FeeAmount;
          x1.TotalAmount = x1.FeeAmount;
        });
        this.calculateTotal();
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  changeAmount(FeePaymentDetail: FeePaymentDetailModel, ChangeParam: number) {
    FeePaymentDetail.TotalAmount = FeePaymentDetail.FeeAmount - FeePaymentDetail.WaiveOffAmount;
    this.calculateTotal();
  }

  calculateTotal() {
    this.FeePayment.FeeAmount = 0;
    this.FeePayment.WaiveOffAmount = 0;
    this.FeePayment.PaidAmount = 0;
    this.FeePayment.TotalAmount = 0;
    this.FeePayment.InitialAmount = 0;

    this.FeePaymentDetailList.forEach((e1: FeePaymentDetailModel) => {
      if (e1.IsSelected || e1.IsCompulsory) {
        this.FeePayment.FeeAmount += e1.FeeAmount;
        this.FeePayment.WaiveOffAmount += e1.WaiveOffAmount;
        this.FeePayment.TotalAmount += e1.TotalAmount;
        this.FeePayment.InitialAmount += e1.InitialAmount;
      }
    });
    this.FeePayment.PaidAmount = this.FeePayment.TotalAmount;
    this.FeePayment.DueAmount = this.FeePayment.InitialAmount - this.FeePayment.PaidAmount - this.FeePayment.WaiveOffAmount;
  }

  saveRegistration() {
    this.isSubmitted = true;
    this.formRegistration.control.markAllAsTouched();
    if (this.formRegistration.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    this.Registration.DOB = this.loadDataService.loadDateYMD(this.Registration.DOB)
    this.Registration.RegistrationDate = this.loadDataService.loadDateYMD(this.Registration.RegistrationDate)
    if (this.Registration.RegistrationId == null) {
      if (this.FeePayment.ChequeDate)
        this.FeePayment.ChequeDate = this.loadDataService.loadDateYMD(this.FeePayment.ChequeDate);
      if (this.loadDataService.loadDateYMD(this.FeePayment.PaymentDate) == this.loadDataService.loadDateYMD(new Date()))
        this.FeePayment.PaymentDate = this.loadDataService.loadDateTime(new Date());
      else
        this.FeePayment.PaymentDate = this.loadDataService.loadDateYMD(this.FeePayment.PaymentDate);
    }

    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({
        Registration: this.Registration,
        FeePayment: this.Registration.RegistrationId == null ? this.FeePayment : {},
        FeePaymentDetailList: this.Registration.RegistrationId == null ? this.FeePaymentDetailList : [],
        StaffLoginId: this.staffLogin.StaffLoginId
      }))
    }
    this.dataLoading = true;
    this.service.saveRegistration(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Registration.RegistrationId > 0) {
          this.toastr.success("Registration Details Updated Successfully.");
          history.back();
        } else {
          this.toastr.success("Registration Successful.")
        }
        this.printFeeePaymentReceipt(1, true, response.FeePaymentId);
        //this.printRegistrationReceipt(1, true, response.RegistrationId);
        this.resetForm();
      } else {
        this.toastr.error(response.Message);
        this.Registration.DOB = this.loadDataService.loadDate(this.Registration.DOB)
        this.Registration.PreviousSchoolTCDate = this.loadDataService.loadDate(this.Registration.PreviousSchoolTCDate)
        this.Registration.AdmissinDate = this.loadDataService.loadDate(this.Registration.AdmissinDate)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  printFeeePaymentReceipt(docType: number, isPrint: boolean, Id: number) {
    var FilterObj = {
      IsPrint: isPrint,
      docType: docType,
      Id: Id
    }
    this.service.printFeeePaymentReceipt(this.loadDataService.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(FilterObj))));
  }

  printRegistrationReceipt(docType: number, isPrint: boolean, Id: number) {
    var FilterObj = {
      IsPrint: isPrint,
      docType: docType,
      Id: Id
    }
    this.service.printRegistrationReceipt(this.loadDataService.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(FilterObj))));
  }


  // getFeeRegistrationList() {
  //   this.FeePayment.InitialAmount = 0;
  //   this.FeePayment.FeeAmount = 0;
  //   this.FeePayment.WaiveOffAmount = 0;
  //   this.FeePayment.TotalAmount = 0;
  //   this.FeePayment.PaidAmount = 0;
  //   this.FeePayment.DueAmount = 0;

  //   if (this.Registration.SessionId == null || this.Registration.ClassId == null) {
  //     this.FeePaymentDetailList = []
  //     return;
  //   }
  //   var obj: RequestModel = {
  //     request: this.localService.encrypt(JSON.stringify({ SessionId: this.Registration.SessionId, ClassId: this.Registration.ClassId }))
  //   }
  //   this.dataLoading = true
  //   this.service.getFeeRegistrationList(obj).subscribe(r1 => {
  //     let response = r1 as any
  //     if (response.Message == ConstantData.SuccessMessage) {
  //       this.FeePaymentDetailList = response.FeeRegistrationList;
  //       this.FeePaymentDetailList.forEach(x1 => {
  //         x1.InitialAmount = x1.FeeAmount;
  //         this.FeePayment.FeeAmount += x1.FeeAmount;
  //       });
  //       this.FeePayment.WaiveOffAmount = 0;
  //       this.FeePayment.TotalAmount = this.FeePayment.FeeAmount;
  //       this.FeePayment.InitialAmount = this.FeePayment.FeeAmount;
  //       this.FeePayment.PaidAmount = this.FeePayment.TotalAmount;
  //       this.FeePayment.DueAmount = 0;
  //     } else {
  //       this.toastr.error(response.Message)
  //     }
  //     this.dataLoading = false
  //   }, (err => {
  //     this.toastr.error("Error while fetching records")
  //     this.dataLoading = false;
  //   }))
  // }

  getCityList() {
    var obj = {}
    this.dataLoading = true
    this.service.getCityList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllCityList = response.CityList;
        if (this.Registration.RegistrationId != null)
          this.onStateChange(2);
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  getStateList() {
    var obj = {}
    this.dataLoading = true
    this.service.getStateList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.StateList = response.StateList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  onStateChange(type: number) {
    if (type == 1) { // Correspondence
      this.CorrespondenceCityList = this.AllCityList.filter(x => x.StateId == this.Registration.CorrespondenceStateId);
    }
    if (type == 2) { // Permanent
      this.PermanentCityList = this.AllCityList.filter(x => x.StateId == this.Registration.PermanentStateId);
    }
  }

  sameAsCorrespondence(e1: any) {
    if (e1.target.checked) {
      this.Registration.PermanentAddress = this.Registration.CorrespondenceAddress;
      this.Registration.PermanentCityId = this.Registration.CorrespondenceCityId;
      this.Registration.PermanentStateId = this.Registration.CorrespondenceStateId;
      this.Registration.PermanentPinCode = this.Registration.CorrespondencePinCode;
    }
    else {
      this.Registration.PermanentAddress = null;
      this.Registration.PermanentCityId = null;
      this.Registration.PermanentStateId = null;
      this.Registration.PermanentPinCode = null;
    }
    this.onStateChange(2);
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
        this.Registration.SessionId = this.CurrentSessionId;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
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
      this.dataLoading = false;
    }))
  }
}
