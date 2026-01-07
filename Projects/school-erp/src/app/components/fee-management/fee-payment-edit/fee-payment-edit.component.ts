import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { FeeFor, PaymentMode } from '../../../utils/enum';
import { ActionModel, FeePaymentDetailModel, KeyValueModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LoadDataService } from '../../../utils/load-data.service';
import { LocalService } from '../../../utils/local.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-fee-payment-edit',
  templateUrl: './fee-payment-edit.component.html',
  styleUrls: ['./fee-payment-edit.component.css']
})
export class FeePaymentEditComponent {
  dataLoading: boolean = false
  FeePaymentDetailList: FeePaymentDetailModel[] = [];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  PaymentModeList: KeyValueModel[] = this.loadDataService.GetEnumList(PaymentMode);
  AllFeeForList = FeeFor;
  Pupil: any = {};
  FeePayment: any = {};
  isSubmitted: boolean = false;
  isBack: boolean = false;

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private localService: LocalService,
    private loadDataService: LoadDataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.resetFeePayment();
    this.route.paramMap.subscribe((params1: any) => {
      var id = params1.get('id');
      if (id) {
        this.FeePayment.FeePaymentId = this.localService.decrypt(this.loadDataService.restoreSpecialCharacter(id));
        this.isBack = true;
        this.getFeePaymentDetail();
      } else {

      }
    });
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: '/admin/fee-payment-edit', StaffLoginId: this.staffLogin.StaffLoginId })).toString()
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


  Staff: any = {};
  Registration: any = {};
  getFeePaymentDetail() {
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ ReceiptNo: this.FeePayment.ReceiptNo, FeePaymentId: this.FeePayment.FeePaymentId }))
    }
    this.dataLoading = true;
    this.service.getFeePaymentDetail(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.FeePaymentDetailList = response.FeePaymentDetailList;
        this.FeePayment = response.FeePayment;
        this.FeePayment.PaymentDate = this.loadDataService.loadDateYMD(this.FeePayment.PaymentDate);
        if (this.FeePayment.ChequeDate)
          this.FeePayment.ChequeDate = this.loadDataService.loadDateYMD(this.FeePayment.ChequeDate);
        // if (response.Pupil)
        this.Pupil = response.Pupil;
        // else
        //   this.Pupil = {};
        // if (response.Staff)
        this.Staff = response.Staff;
        // else
        //   this.Staff = {};
        // if (response.Registration)
        this.Registration = response.Registration;
        // else
        //   this.Registration = {};
      } else {
        this.toastr.error(response.Message);
        this.Pupil = {};
        this.Staff = {};
        this.Registration = {};
        this.FeePaymentDetailList = [];
        this.FeePayment.FeePaymentId = 0;
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  resetFeePayment() {
    this.FeePaymentDetailList = [];
    this.FeePayment = {};
    this.Pupil = {};
    this.Staff = {};
    this.Registration = {};
  }


  changeAmount(FeePaymentDetail: FeePaymentDetailModel, ChangeParam: number) {
    FeePaymentDetail.TotalAmount = FeePaymentDetail.FeeAmount - FeePaymentDetail.WaiveOffAmount;
    if (FeePaymentDetail.TotalAmount < 0) {
      if (ChangeParam == 1)
        FeePaymentDetail.FeeAmount = 0;
      else
        FeePaymentDetail.WaiveOffAmount = 0;
      FeePaymentDetail.TotalAmount = FeePaymentDetail.FeeAmount - FeePaymentDetail.WaiveOffAmount;
      this.toastr.error("Invalid Amount !!");
    }
    this.calculateTotal();
  }

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
    this.FeePayment.DueAmount = this.FeePayment.InitialAmount - this.FeePayment.PaidAmount - this.FeePayment.WaiveOffAmount;
  }

  updateFeePayment(form: NgForm) {
    if (form.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    if (this.FeePayment.ChequeDate)
      this.FeePayment.ChequeDate = this.loadDataService.loadDateYMD(this.FeePayment.ChequeDate);
    if (this.loadDataService.loadDateYMD(this.FeePayment.PaymentDate) == this.loadDataService.loadDateYMD(new Date()))
      this.FeePayment.PaymentDate = this.loadDataService.loadDateTime(new Date());

    var obj = {
      FeePayment: this.FeePayment,
      FeePaymentDetailList: this.FeePaymentDetailList,
      StaffLoginId: this.staffLogin.StaffLoginId
    }
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(obj)).toString()
    }
    this.dataLoading = true;
    this.service.updateFeePayment(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success("Fee Payment Details Updated Successfully.");
        this.printFeeePaymentReceipt(1, true, response.FeePaymentId);
        this.resetFeePayment();
        if (this.isBack)
          history.back();
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  printFeeePaymentReceipt(docType: number, isPrint: boolean, Id: number) {
    var filterModel = {
      IsPrint: isPrint,
      docType: docType,
      Id: Id,
    }
    this.service.printFeeePaymentReceipt(this.loadDataService.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(filterModel))));
  }

}