import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { LocalService } from '../../../utils/local.service';
import { AdmissionType, BloodGroup, Board, Category, FeeFor, Gender, Nationality, PaymentMode, RegistrationStatus, Religion, SchoolNos, Status } from '../../../utils/enum';
import { ActionModel, FeePaymentDetailModel, FeePaymentModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-new-admission',
  templateUrl: './new-admission.component.html',
  styleUrls: ['./new-admission.component.css']
})
export class NewAdmissionComponent {

  dataLoading: boolean = false
  Pupil: any = {}
  PupilTypeList: any[] = [];
  StateList: any[] = [];
  AllCityList: any[] = [];
  CrosspondanceCityList: any[] = [];
  PermanentCityList: any[] = [];
  AllSectionList: any[] = [];
  SectionList: any[] = [];
  SessionList: any[] = [];
  ClassList: any[] = [];
  PupilAdmission: any = {};
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;

  StatusList = this.loadDataService.GetEnumList(Status);
  BoardList = this.loadDataService.GetEnumList(Board);
  GenderList = this.loadDataService.GetEnumList(Gender);
  CategoryList = this.loadDataService.GetEnumList(Category);
  ReligionList = this.loadDataService.GetEnumList(Religion);;
  BloodGroupList = this.loadDataService.GetEnumList(BloodGroup);;
  NationalityList = this.loadDataService.GetEnumList(Nationality);;
  AdmissionTypeList = this.loadDataService.GetEnumList(AdmissionType);
  actionType: number = 0;
  menuUrl: string = '';
  isRPS: boolean = ConstantData.getSchoolNo() == SchoolNos.RPS_Inter_College;

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
    this.getPupilTypeList();
    this.getCityList();
    this.getStateList();
    this.getSectionList();
    this.getSessionList();
    this.getClassList();
   
    // this.resetForm();
    this.route.paramMap.subscribe((params1: any) => {
      this.menuUrl = this.router.url;
      var id = params1.get('id');
      if (id) {
        if (id == 1) {
          //edit by admission no
          this.actionType = 1;
          this.getSearchPupilList();
        } else if (id == 2) {
          //admission by registration
          this.actionType = 2;
          this.getSearchRegistrationList();
          this.getVehicleList();
          this.getTransportBatchList();
          this.getHostelList();
          this.getHostelRoomList();
        } else {
          this.menuUrl = '/admin/new-admission/1'
          this.actionType = 3;
          this.Pupil = JSON.parse(this.localService.decrypt(this.loadDataService.restoreSpecialCharacter(id)));
          this.PupilAdmission = this.Pupil.PupilAdmission;
          this.Pupil.PupilAdmission = {};
          // if (this.Registration.StudentSingnature)
          //   this.StudentSingnature = this.imageUrl + this.Registration.StudentSingnature;
          // if (this.Registration.StudentPhoto)
          //   this.StudentPhoto = this.imageUrl + this.Registration.StudentPhoto;
        }
      } else {
        if(this.isRPS)
          this.getAccountList();
        this.getVehicleList();
        this.getTransportBatchList();
        this.getHostelList();
        this.getHostelRoomList();
        this.resetForm();
      }
      this.validiateMenu();
    });
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.menuUrl, StaffLoginId: this.staffLogin.StaffLoginId })).toString()
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


  @ViewChild('formPupil') formPupil: NgForm;
  resetForm() {
    this.Pupil = {
      PreviousSchoolClass: this.isRPS ? '10' : null,
      PreviousBoard: Board.JAC,
      IsFeePayment: this.Pupil.IsFeePayment ?? true
    };

    this.PupilAdmission = {};
    this.PupilAdmission.AdmissionDate = new Date();
    this.FeePayment = {
      PaymentDate: new Date(),
      PaymentMode: PaymentMode.Cash
    } as FeePaymentModel;
    this.FeePaymentDetailList = [];
    if (this.formPupil) {
      this.formPupil.control.markAsPristine();
      this.formPupil.control.markAsUntouched();
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

  RegistrationList: any[] = [];
  AllRegistrationList: any[] = [];
  getSearchRegistrationList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Status: RegistrationStatus.Registred }))
    }
    this.dataLoading = true
    this.service.getSearchRegistrationList(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllRegistrationList = response.RegistrationList;
        this.AllRegistrationList.map(x1 => x1.SearchRegistration = `${x1.RegistrationNo ?? ''} - ${x1.PupilName ?? ''}  ${x1.FatherName ?? ''}`);
        this.RegistrationList = this.AllRegistrationList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false
    }))
  }


  filterRegistrationList(searchFiled: string) {
    if (searchFiled) {
      this.RegistrationList = this.AllRegistrationList.filter((option: any) => option.SearchRegistration.toLowerCase().includes(searchFiled.toLowerCase()));
    } else {
      this.RegistrationList = this.AllRegistrationList;
    }
    this.Pupil.RegistrationId = null;
  }

  afterRegistrationSeleted(event: any) {
    this.getRegistrationList(event.option.id);
  }

  clearRegistration() {
    this.resetForm();
    this.RegistrationList = this.AllRegistrationList;
  }
  getRegistrationList(registrationId: number) {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Id: registrationId }))
    }
    this.dataLoading = true
    this.service.getRegistrationList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.Pupil = response.RegistrationList[0];
        this.Pupil.PreviousSchoolClass = this.isRPS ? '10' : null;
        this.Pupil.PreviousBoard = Board.JAC;
        this.onStateChange(1, false);
        this.PupilAdmission.ClassId = this.Pupil.ClassId;
        this.PupilAdmission.SessionId = this.Pupil.SessionId;
        if (this.PupilTypeList.length > 0)
          this.Pupil.PupilTypeId = this.PupilTypeList[0].PupilTypeId;
        this.PupilAdmission.AdmissionDate = new Date();
        this.Pupil.SearchRegistration = this.AllRegistrationList.find(x => x.RegistrationId == this.Pupil.RegistrationId).SearchRegistration;
        this.onClassChange(true);
        this.getAdmissionRollNo();
      } else {
        this.toastr.error(response.Message)
      }
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
    this.service.getSearchPupilList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllPupilList = response.PupilList;
        this.AllPupilList.map(x1 => x1.SearchPupil = `${x1.AdmissionNo} - ${x1.PupilName} - ${x1.FatherName} - ${x1.ClassName} - ${x1.SectionName}`);
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

  filterPupilList(searchFiled: string) {
    if (searchFiled) {
      this.PupilList = this.AllPupilList.filter((option: any) => option.SearchPupil.toLowerCase().includes(searchFiled.toLowerCase()));
    } else {
      this.PupilList = this.AllPupilList;
    }
    this.PupilAdmission.PupilAdmissionId = null;
    this.Pupil.PupilId = null;
  }

  afterPupilSeleted(event: any) {
    this.getPupil(event.option.id);
  }

  clearPupil() {
    this.resetForm();
    this.PupilList = this.AllPupilList;
  }

  getPupil(pupilAdmissionId: number) {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ PupilAdmissionId: pupilAdmissionId }))
    };
    this.dataLoading = true
    this.service.getPupil(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.Pupil = response.Pupil;
        this.PupilAdmission = response.PupilAdmission;
        this.Pupil.SearchPupil = this.AllPupilList.find(x => x.PupilAdmissionId == this.PupilAdmission.PupilAdmissionId).SearchPupil;
        this.onClassChange(false);
        this.onStateChange(1, false);
        this.onStateChange(2, false);
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  changePreviousBoard() {
    if (this.Pupil.PrePreviousBoard != Board.Others)
      this.Pupil.PreviousSchoolBoard = this.BoardList.find(x => x.Key == this.Pupil.PrePreviousBoard)?.Value;
    else
      this.Pupil.PreviousSchoolBoard = null;
  }

  getAdmissionRollNo() {
    if (ConstantData.getSchoolNo() != SchoolNos.RPS_Inter_College || this.Pupil.PupilId != null || this.PupilAdmission.SessionId == null || this.PupilAdmission.ClassId == null) {
      return;
    }
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({
        SessionId: this.PupilAdmission.SessionId,
        ClassId: this.PupilAdmission.ClassId,
        // SectionId: this.PupilAdmission.SectionId
      }))
    }
    this.dataLoading = true
    this.service.getAdmissionRollNo(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.Pupil.AdmissionNo = response.AdmissionNo;
        this.PupilAdmission.RollNo = response.RollNo;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false
    }))
  }

  AllFeeForList = FeeFor;
  PaymentModeList = this.loadDataService.GetEnumList(PaymentMode);
  FeePayment: FeePaymentModel = {
    PaymentDate: new Date(),
    PaymentMode: PaymentMode.Cash
  } as FeePaymentModel;
  FeePaymentDetailList: FeePaymentDetailModel[] = [];
  getFeeAdmissionList() {
    if (this.PupilAdmission.SessionId == null || this.PupilAdmission.ClassId == null || this.Pupil.PupilTypeId == null) {
      this.FeePaymentDetailList = [];
      this.FeePayment = {
        PaymentDate: new Date(),
        PaymentMode: PaymentMode.Cash
      } as FeePaymentModel;
      return;
    }
    var obj = {
      SessionId: this.PupilAdmission.SessionId,
      ClassId: this.PupilAdmission.ClassId,
      AdmissionType: AdmissionType.NewAdmission,
      PupilTypeId: this.Pupil.PupilTypeId,
    }
    this.dataLoading = true
    this.service.getFeeAdmissionList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.FeePaymentDetailList = response.FeeAdmissionList;
        this.FeePaymentDetailList = this.FeePaymentDetailList.filter(x => x.FeeAmount > 0 && x.IsActive)
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
      // if (e1.IsSelected || e1.IsCompulsory) {
      this.FeePayment.FeeAmount += e1.FeeAmount;
      this.FeePayment.WaiveOffAmount += e1.WaiveOffAmount;
      this.FeePayment.TotalAmount += e1.TotalAmount;
      // }
      this.FeePayment.InitialAmount += e1.InitialAmount;
    });
    this.FeePayment.PaidAmount = this.FeePayment.TotalAmount;
    this.FeePayment.DueAmount = this.FeePayment.InitialAmount - this.FeePayment.PaidAmount - this.FeePayment.WaiveOffAmount;
  }

  savePupil() {
    this.formPupil.control.markAllAsTouched();
    if (this.formPupil.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    this.Pupil.DOB = this.loadDataService.loadDateYMD(this.Pupil.DOB)
    this.Pupil.PreviousSchoolTCDate = this.loadDataService.loadDateYMD(this.Pupil.PreviousSchoolTCDate)
    this.PupilAdmission.AdmissionDate = this.loadDataService.loadDateYMD(this.PupilAdmission.AdmissionDate)
    if (this.Pupil.IsTransport) {
      this.TransportPupil.StartDate = this.loadDataService.loadDateYMD(this.TransportPupil.StartDate);
      this.TransportPupil.EndDate = this.loadDataService.loadDateYMD(this.TransportPupil.EndDate);
    } else {
      this.TransportPupil = {};
    }

    if (this.Pupil.IsHostel) {
      this.HostelPupil.StartDate = this.loadDataService.loadDateYMD(this.HostelPupil.StartDate);
      this.HostelPupil.EndDate = this.loadDataService.loadDateYMD(this.HostelPupil.EndDate);
    } else {
      this.HostelPupil = {};
    }

    if (this.Pupil.PupilId == null && this.Pupil.IsFeePayment) {
      if (this.FeePayment.ChequeDate)
        this.FeePayment.ChequeDate = this.loadDataService.loadDateYMD(this.FeePayment.ChequeDate);
      if (this.loadDataService.loadDateYMD(this.FeePayment.PaymentDate) == this.loadDataService.loadDateYMD(new Date()))
        this.FeePayment.PaymentDate = this.loadDataService.loadDateTime(new Date());
      else
        this.FeePayment.PaymentDate = this.loadDataService.loadDateYMD(this.FeePayment.PaymentDate);
    }

    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({
        Pupil: this.Pupil,
        PupilAdmission: this.PupilAdmission,
        StaffLoginId: this.staffLogin.StaffLoginId,
        HostelPupil: this.HostelPupil,
        TransportPupil: this.TransportPupil,
        RegistrationId: this.Pupil.RegistrationId,
        FeePayment: this.Pupil.IsFeePayment ? this.FeePayment : null,
        FeePaymentDetailList: this.FeePaymentDetailList
      }))
    };
    this.dataLoading = true;
    this.service.savePupil(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Pupil.PupilId > 0) {
          this.toastr.success("Admission Details Updated successfully.");
          if (this.actionType == 3)
            history.back();
        } else {
          this.toastr.success("Admission Details Submitted Successfully.")
          if (response.FeePaymentId)
            this.printFeeePaymentReceipt(1, true, response.FeePaymentId);
        }
        if (this.actionType == 2) {
          this.AllRegistrationList = this.AllRegistrationList.filter(x => x.RegistrationId != this.Pupil.RegistrationId);
          this.RegistrationList = this.AllRegistrationList;
        }
        this.resetForm();
      } else {
        this.toastr.error(response.Message);
        this.Pupil.DOB = this.loadDataService.loadDate(this.Pupil.DOB)
        this.Pupil.PreviousSchoolTCDate = this.loadDataService.loadDate(this.Pupil.PreviousSchoolTCDate)
        this.PupilAdmission.AdmissionDate = this.loadDataService.loadDate(this.PupilAdmission.AdmissionDate)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  printFeeePaymentReceipt(docType: number, isPrint: boolean, Id: number) {
    var obj = {
      IsPrint: isPrint,
      docType: docType,
      Id: Id
    }
    this.service.printFeeePaymentReceipt(this.loadDataService.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(obj))));
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
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }


  getCityList() {
    var obj = {}
    this.dataLoading = true
    this.service.getCityList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllCityList = response.CityList;
        if (this.Pupil.PupilId > 0) {
          this.onStateChange(1, false);
          this.onStateChange(2, false);
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

  onStateChange(type: number, isReset: boolean) {
    if (type == 1) { // Crosspondance
      this.CrosspondanceCityList = this.AllCityList.filter(x => x.StateId == this.Pupil.CorrespondenceStateId);
      if (isReset)
        this.Pupil.CrosspondanceCityId = null;
    }
    if (type == 2) { // Permanent
      this.PermanentCityList = this.AllCityList.filter(x => x.StateId == this.Pupil.PermanentStateId);
      if (isReset)
        this.Pupil.PermanentCityId = null;
    }
  }

  onClassChange(isReset: boolean) {
    this.SectionList = this.AllSectionList.filter(x => x.ClassId == this.PupilAdmission.ClassId);
    if (isReset) {
      this.PupilAdmission.SectionId = null;
      if (this.SectionList.length > 0) {
        this.PupilAdmission.SectionId = this.SectionList[0].SectionId;
      }
    }
  }

  sameAsCorrespondence(e1: any) {
    if (e1.target.checked) {
      this.Pupil.PermanentAddress = this.Pupil.CorrespondenceAddress;
      this.Pupil.PermanentCityId = this.Pupil.CorrespondenceCityId;
      this.Pupil.PermanentStateId = this.Pupil.CorrespondenceStateId;
      this.Pupil.PermanentPinCode = this.Pupil.CorrespondencePinCode;
    }
    else {
      this.Pupil.PermanentAddress = null;
      this.Pupil.PermanentCityId = null;
      this.Pupil.PermanentStateId = null;
      this.Pupil.PermanentPinCode = null;
    }
    this.onStateChange(2, false);
  }


  getSectionList() {
    var obj = {}
    this.dataLoading = true
    this.service.getSectionList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllSectionList = response.SectionList;
        if (this.Pupil.PupilId > 0) {
          this.onClassChange(false);
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


  getSessionList() {
    var obj = {}
    this.dataLoading = true
    this.service.getSessionList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.SessionList = response.SessionList;
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

  TransportPupil: any = {};
  VehicleList: any[] = [];
  getVehicleList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getVehicleList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.VehicleList = response.VehicleList;

      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  TransportBatchList: any[] = [];
  getTransportBatchList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getTransportBatchList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.TransportBatchList = response.TransportBatchList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  HostelList: any[] = [];
  HostelPupil: any = {};
  getHostelList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getHostelList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.HostelList = response.HostelList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }
  AllHostelRoomList: any[] = [];
  HostelRoomList: any[] = [];
  getHostelRoomList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getHostelRoomList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllHostelRoomList = response.HostelRoomList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }
  changeHostel() {
    this.HostelRoomList = this.AllHostelRoomList.filter(x => x.HostelId == this.HostelPupil.HostelId);
    this.HostelPupil.HostelRoomId = null;
  }
}
