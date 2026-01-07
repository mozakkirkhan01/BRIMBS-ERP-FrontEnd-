import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { FeeFor, Months, PaymentFor, PaymentMode, SchoolNos, Status } from '../../../utils/enum';
import { ActionModel, FeePaymentDetailModel, FeePaymentMonthModel, FeeSessionModel, KeyValueModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LoadDataService } from '../../../utils/load-data.service';
import { LocalService } from '../../../utils/local.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-miscellaneous-payment',
  templateUrl: './miscellaneous-payment.component.html',
  styleUrls: ['./miscellaneous-payment.component.css']
})
export class MiscellaneousPaymentComponent {
  dataLoading: boolean = false
  FeePaymentDetailList: FeePaymentDetailModel[] = [];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  PaymentModeList: KeyValueModel[] = this.loadDataService.GetEnumList(PaymentMode);
  AllFeeForList = FeeFor;
  AllPaymentMode = PaymentMode;
  isAccount: boolean = ConstantData.getSchoolNo() == SchoolNos.RPS_Inter_College;

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private localService: LocalService,
    private loadDataService: LoadDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.resetFeePayment();
    this.getSearchStaffList();
    this.getSearchPupilList();
    this.getHeadList();
    // if (this.isAccount)
    this.getAccountList();
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url, StaffLoginId: this.staffLogin.StaffLoginId })).toString()
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

  @ViewChild('formFeePayment') formFeePayment: NgForm;
  @ViewChild('formFeePaymentDetail') formFeePaymentDetail: NgForm;

  PupilList: any[] = [];
  AllPupilList: any[] = [];
  getSearchPupilList() {
    this.dataLoading = true
    this.service.getSearchPupilList(this.FeePayment).subscribe(r1 => {
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
    this.FeePayment.PupilAdmissionId = null;
    this.FeePayment.PupilId = null;
  }

  Pupil: any = {};
  afterPupilSeleted(event: any) {
    this.FeePayment.PupilAdmissionId = event.option.id;
    this.Pupil = this.AllPupilList.find(x => x.PupilAdmissionId == this.FeePayment.PupilAdmissionId);
    this.FeePayment.PupilId = this.Pupil.PupilId;
    this.getFeePaymentList(0, this.Pupil.PupilId);
    this.FeePayment.PaymentDate = this.loadDataService.loadDateYMD(new Date())
  }

  clearPupil() {
    this.resetFeePayment();
    this.PupilList = this.AllPupilList;
    this.Pupil = {};
  }


  StaffList: any[] = [];
  AllStaffList: any[] = [];
  getSearchStaffList() {
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Status: Status.Active }))
    }
    this.dataLoading = true
    this.service.getStaffList(request).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllStaffList = response.StaffList;
        this.AllStaffList.map(x1 => x1.SearchStaff = `${x1.StaffCode} - ${x1.StaffName} - ${x1.DesignationName}`);
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

  // changeAccount() {
  //   this.FeePaymentDetailList = [];
  //   this.calculateTotal();
  //   if (ConstantData.getSchoolNo() == SchoolNos.RPS_Inter_College)
  //     this.HeadList = this.AllHeadList.filter(x => x.AccountId == this.FeePayment.AccountId);
  //   else
  //     this.HeadList = this.AllHeadList;
  // }

  filterStaffList(searchFiled: string) {
    if (searchFiled) {
      this.StaffList = this.AllStaffList.filter((option: any) => option.SearchStaff.toLowerCase().includes(searchFiled.toLowerCase()));
    } else {
      this.StaffList = this.AllStaffList;
    }
    this.FeePayment.StaffId = null;
  }

  Staff: any = {};
  afterStaffSeleted(event: any) {
    this.FeePayment.StaffId = event.option.id;
    this.Staff = this.AllStaffList.find(x => x.StaffId == this.FeePayment.StaffId);
    this.getFeePaymentList(this.Staff.StaffId, 0);
    this.FeePayment.PaymentDate = this.loadDataService.loadDateYMD(new Date())
  }

  clearStaff() {
    this.resetFeePayment();
    this.StaffList = this.AllStaffList;
    this.Staff = {};
  }


  HeadList: any[] = [];
  AllHeadList: any[] = [];
  getHeadList() {
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Status: Status.Active }))
    }
    this.dataLoading = true
    this.service.getHeadList(request).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllHeadList = response.HeadList;
        this.AllHeadList.map(x1 => x1.HeadName = `${x1.HeadName}`);
        this.HeadList = this.AllHeadList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false
    }))
  }

  filterHeadList(searchFiled: string) {
    if (searchFiled) {
      this.HeadList = this.AllHeadList.filter((option: any) => option.HeadName.toLowerCase().includes(searchFiled.toLowerCase()));
    } else {
      this.HeadList = this.AllHeadList;
    }
    this.FeePaymentDetail.HeadId = null;
  }

  FeePaymentDetail: FeePaymentDetailModel = {} as FeePaymentDetailModel;
  afterHeadSeleted(event: any) {
    this.FeePaymentDetail.HeadId = event.option.id;
  }

  clearHead() {
    this.HeadList = this.AllHeadList;
    this.FeePaymentDetail.HeadId = null;
    this.FeePaymentDetail.HeadName = null;
  }

  addFeePaymentDetail() {
    this.formFeePaymentDetail.control.markAllAsTouched();
    if (this.formFeePaymentDetail.invalid) {
      this.toastr.error(ConstantData.formInvalidMessage);
      return;
    }
    this.FeePaymentDetail.InitialAmount = this.FeePaymentDetail.FeeAmount;
    this.FeePaymentDetail.WaiveOffAmount = 0;
    this.FeePaymentDetail.TotalAmount = this.FeePaymentDetail.FeeAmount;
    this.FeePaymentDetail.FeeFor = FeeFor.Miscellaneous;
    this.FeePaymentDetailList.push(this.FeePaymentDetail);
    this.FeePaymentDetail = {} as FeePaymentDetailModel;
    this.formFeePaymentDetail.control.markAsUntouched();
    this.formFeePaymentDetail.control.markAsPristine();
    this.HeadList = this.AllHeadList;
    this.calculateTotal();
  }

  removeRecord(index: number) {
    this.FeePaymentDetailList.splice(index, 1);
  }

  FooterObj: any = {};
  FeePaymentList: any[] = [];
  getFeePaymentList(staffId: any, PupilId: any) {
    this.FooterObj = {
      FeeAmount: 0,
      WaiveOffAmount: 0,
      PaidAmount: 0,
      DueAmount: 0,
    };
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ StaffId: staffId, PupilId: PupilId }))
    }
    this.dataLoading = true
    this.service.getFeePaymentList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.FeePaymentList = response.FeePaymentList;
        this.FeePaymentList.forEach((e1: any) => {
          this.FooterObj.FeeAmount += e1.FeeAmount;
          this.FooterObj.WaiveOffAmount += e1.WaiveOffAmount;
          this.FooterObj.PaidAmount += e1.PaidAmount;
          this.FooterObj.DueAmount += e1.DueAmount;
        });
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }


  resetFeePayment() {
    this.FeePaymentDetailList = [];
    this.FeePayment = {
      PaymentDate: this.loadDataService.loadDateYMD(new Date()),
      PaymentMode: PaymentMode.Cash,
      PaymentBy: this.FeePayment.PaymentBy ?? 2
    };
    this.Staff = {};
    this.Pupil = {};
    this.FeePaymentList = [];
    if (this.formFeePayment) {
      this.formFeePayment.control.markAsPristine();
      this.formFeePayment.control.markAsUntouched();
    }
  }

  FeePayment: any = {};
  calculateTotal() {
    this.FeePayment.FeeAmount = 0;
    this.FeePayment.WaiveOffAmount = 0;
    this.FeePayment.PaidAmount = 0;
    this.FeePayment.TotalAmount = 0;
    this.FeePayment.InitialAmount = 0;

    this.FeePaymentDetailList.forEach((e1: FeePaymentDetailModel) => {
      this.FeePayment.FeeAmount += e1.FeeAmount;
      this.FeePayment.WaiveOffAmount += e1.WaiveOffAmount;
      this.FeePayment.TotalAmount += e1.TotalAmount;
      this.FeePayment.InitialAmount += e1.InitialAmount;
    });
    this.FeePayment.PaidAmount = this.FeePayment.TotalAmount;
    this.FeePayment.DueAmount = 0;
  }

  saveFeePayment() {
    this.formFeePayment.control.markAllAsTouched();
    if (this.formFeePayment.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }


    if (this.FeePayment.ChequeDate)
      this.FeePayment.ChequeDate = this.loadDataService.loadDateYMD(this.FeePayment.ChequeDate);
    if (this.loadDataService.loadDateYMD(this.FeePayment.PaymentDate) == this.loadDataService.loadDateYMD(new Date()))
      this.FeePayment.PaymentDate = this.loadDataService.loadDateTime(new Date());
    else
      this.FeePayment.PaymentDate = this.loadDataService.loadDateYMD(this.FeePayment.PaymentDate);
    this.FeePayment.PaymentFor = PaymentFor.Miscellaneous;
    var obj = {
      FeePayment: this.FeePayment,
      FeePaymentDetailList: this.FeePaymentDetailList,
      FeePaymentMonthList: [],
      StaffLoginId: this.staffLogin.StaffLoginId
    }
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true;
    this.service.saveFeePayment(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success("Fee Payment Successfully Done.");
        this.printFeeePaymentReceipt(1, true, response.FeePaymentId);
        this.resetFeePayment();
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  FilterObj: any = {};
  printFeeePaymentReceipt(docType: number, isPrint: boolean, Id: number) {
    var obj = {
      IsPrint: isPrint,
      docType: docType,
      Id: Id,
    }
    this.service.printFeeePaymentReceipt(this.loadDataService.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(obj))));
  }
}