import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { FeeFor, Months, PaymentFor, PaymentMode, PupilStatus, SchoolNos } from '../../../utils/enum';
import { ActionModel, FeePaymentDetailModel, FeePaymentMonthModel, FeeSessionModel, KeyValueModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LoadDataService } from '../../../utils/load-data.service';
import { LocalService } from '../../../utils/local.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fee-payment',
  templateUrl: './fee-payment.component.html',
  styleUrls: ['./fee-payment.component.css']
})
export class FeePaymentComponent {
  dataLoading: boolean = false
  //FeePaymentMonthList: FeePaymentMonthModel[] = [];
  FeeSessionList: FeeSessionModel[] = [];
  PaidFeePaymentDetailList: FeePaymentDetailModel[] = [];
  FeePaymentDetailList: FeePaymentDetailModel[] = [];
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  PaymentModeList: KeyValueModel[] = this.loadDataService.GetEnumList(PaymentMode);
  AllFeeForList = FeeFor;
  AllPupilStatus = PupilStatus;
  AllPaymentForList = FeeFor;
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
    this.getSearchPupilList();
    if (this.isAccount) {
      this.getAccountList();
      this.getHeadList();
    }
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

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }


  HeadList: any[] = [];
  getHeadList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({}))
    }
    this.dataLoading = true
    this.service.getHeadList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.HeadList = response.HeadList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error(ConstantData.serverMessage)
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

  changeAccount() {
    this.FeePaymentDetailList.forEach(f1 => {
      if (this.HeadList.filter(x => x.HeadId == f1.HeadId && x.AccountId == this.FeePayment.AccountId).length > 0) {
        f1.IsSelected = true;
      } else {
        f1.IsSelected = false;
      }
    });
    this.calculateTotal();
  }

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
    this.getFeePaymentDetailForFee(event.option.id);
    this.getFeePaymentList(this.Pupil.PupilId);
    this.FeePayment.PaymentDate = this.loadDataService.loadDateYMD(new Date())
  }

  clearPupil() {
    this.resetFeePayment();
    this.PupilList = this.AllPupilList;
    this.Pupil = {};
  }


  FooterObj: any = {};
  FeePaymentList: any[] = [];
  getFeePaymentList(pupilId: any) {
    this.FooterObj = {
      FeeAmount: 0,
      WaiveOffAmount: 0,
      PaidAmount: 0,
      DueAmount: 0,
    };
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ PupilId: pupilId }))
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
    //this.FeePaymentMonthList = [];
    this.FeeSessionList = [];
    this.PaidFeePaymentDetailList = [];
    this.FeePayment = {
      PaymentDate: this.loadDataService.loadDateYMD(new Date())
    };
    this.FeePayment.PaymentMode = "";
    this.FeePayment.PaymentDate = this.loadDataService.loadDateTime(new Date());
    this.isSubmitted = false;
    this.Pupil = {};
    this.FeePaymentList = [];
    if (this.formFeePayment) {
      this.formFeePayment.control.markAsPristine();
      this.formFeePayment.control.markAsUntouched();
    }
  }

  getFeePaymentDetailForFee(PupilAdmissionId: any) {
    if (PupilAdmissionId) {
      this.dataLoading = true
      var obj = {
        PupilAdmissionId: PupilAdmissionId,
        PupilId: this.FeePayment.PupilId
      }
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.service.getFeePaymentDetailForFee(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.PaidFeePaymentDetailList = response.PaidFeePaymentDetailList;
          this.FeeSessionList = response.FeeSessionList;

          this.setFeePaymentDetailList();
          // ✅ Auto-select all months
          this.FeeSessionList.forEach(session => {
            session.IsExpand = true;

            session.FeePaymentMonthList.forEach(month => {
              if (month.FeePaymentMonthId === 0) {
                month.IsSelected = true;
              }
            });
          });

          // Recalculate totals again
          this.setFeePaymentDetailList();
        } else {
          this.toastr.error(response.Message)
        }
        this.dataLoading = false
      }, (err => {
        this.toastr.error("Error while fetching records")
        this.dataLoading = false
      }))
    } else {
      this.resetFeePayment();
    }
  }


  changeMonthSelection(month: FeePaymentMonthModel, i1: number, iS1: number) {
    var iS2: number = 0;
    if (month.IsSelected) {
      this.FeeSessionList.forEach(fs1 => {
        if (iS1 == iS2) {
          for (var i = i1; i >= 0; i--) {
            fs1.FeePaymentMonthList[i].IsSelected = true;
          }
        } else if (iS1 > iS2) {
          fs1.FeePaymentMonthList.forEach(f1 => f1.IsSelected = true);
        }

        iS2++;
      })
    }
    else {
      this.FeeSessionList.forEach(fs1 => {
        if (iS1 == iS2) {
          for (var i = i1; i < fs1.FeePaymentMonthList.length; i++) {
            fs1.FeePaymentMonthList[i].IsSelected = false;
          }
        } else if (iS1 < iS2) {
          fs1.FeePaymentMonthList.forEach(f1 => f1.IsSelected = false);
        }
        iS2++;
      });

    }
    this.setFeePaymentDetailList();
  }

  PaymentFeeForList: any[] = [];
  setFeePaymentDetailList() {
    this.FeePaymentDetailList = [];
    this.PaymentFeeForList = [];
    var FeePaymentDetailList: FeePaymentDetailModel[] = [];
    var monthFeePaymentDetails: FeePaymentDetailModel[] = [];
    this.FeeSessionList.forEach(fs1 => {
      if (fs1.FeePaymentMonthList.filter(x => x.FeePaymentMonthId == 0).length > 0) {
        if (this.FeeSessionList.filter(x => x.IsCurrent).length == 0) {
          fs1.IsCurrent = true;
        }
      }

      fs1.FeePaymentMonthList.forEach((e1: FeePaymentMonthModel) => {
        if (e1.IsSelected || e1.FeePaymentMonthId != 0) {
          e1.FeePaymentDetailList.forEach((e2: FeePaymentDetailModel) => {
            var e3s = FeePaymentDetailList.filter(x => x.HeadId == e2.HeadId && x.FeeFor == e2.FeeFor);
            if (e3s.length != 0) {
              const e3 = e3s[0];
              e3.FeeAmount += e2.FeeAmount;
              e3.WaiveOffAmount += e2.WaiveOffAmount;
              e3.TotalAmount = e3.FeeAmount - e3.WaiveOffAmount;
              if (e2.IsCompulsory)
                e3.IsCompulsory = true;
              if (e2.PupilWaiveOffId != null) {
                e3.PupilWaiveOffList.push({ PupilWaiveOffId: e2.PupilWaiveOffId });
              }
            } else {
              var obj: FeePaymentDetailModel = {
                IsSelected: true,
                IsActive: true,
                FeeAmount: e2.FeeAmount,
                FeeFor: e2.FeeFor,
                FeePaymentDetailId: e2.FeePaymentDetailId,
                HeadId: e2.HeadId,
                HeadName: e2.HeadName,
                IsCompulsory: e2.IsCompulsory,
                PupilWaiveOffId: e2.PupilWaiveOffId,
                Remarks: e2.Remarks,
                TotalAmount: e2.TotalAmount,
                WaiveOffAmount: e2.WaiveOffAmount,
                PupilWaiveOffList: [],
                InitialAmount: 0,
                PaidAmount: 0,
                DueAmount: 0
              }
              if (e2.PupilWaiveOffId != null) {
                obj.PupilWaiveOffList.push({ PupilWaiveOffId: e2.PupilWaiveOffId });
              }
              FeePaymentDetailList.push(obj);
            }
            e2.PaidAmount = 0;
            e2.TotalAmount = e2.FeeAmount - e2.WaiveOffAmount;
            monthFeePaymentDetails.push(e2);
          });
        } else if (e1.MonthId == Months.April) {
          e1.FeePaymentDetailList.filter(f1 => f1.FeeFor == FeeFor.AdmissionFee).forEach((e2: FeePaymentDetailModel) => {
            var FeePaymentDetails = FeePaymentDetailList.filter(e3 => e3.HeadId == e2.HeadId && e3.FeeFor == e2.FeeFor);
            if (FeePaymentDetails.length > 0) {
              const e3 = FeePaymentDetails[0];
              e3.FeeAmount += e2.FeeAmount;
              e3.WaiveOffAmount += e2.WaiveOffAmount;
              // e3.TotalAmount = e3.FeeAmount - e3.WaiveOffAmount;
              if (e2.IsCompulsory)
                e3.IsCompulsory = true;
              if (e2.PupilWaiveOffId != null) {
                e3.PupilWaiveOffList.push({ PupilWaiveOffId: e2.PupilWaiveOffId });
              }
            }
            else {
              var obj: FeePaymentDetailModel = {
                IsSelected: true,
                IsActive: true,
                FeeAmount: e2.FeeAmount,
                FeeFor: e2.FeeFor,
                FeePaymentDetailId: e2.FeePaymentDetailId,
                HeadId: e2.HeadId,
                HeadName: e2.HeadName,
                IsCompulsory: e2.IsCompulsory,
                PupilWaiveOffId: e2.PupilWaiveOffId,
                Remarks: e2.Remarks,
                TotalAmount: e2.TotalAmount,
                PaidAmount: 0,
                WaiveOffAmount: e2.WaiveOffAmount,
                PupilWaiveOffList: [],
                InitialAmount: 0,
                DueAmount: 0
              };
              if (e2.PupilWaiveOffId != null) {
                obj.PupilWaiveOffList.push({ PupilWaiveOffId: e2.PupilWaiveOffId });
              }
              FeePaymentDetailList.push(obj);
            }
            e2.PaidAmount = 0;
            e2.TotalAmount = e2.FeeAmount - e2.WaiveOffAmount;
            monthFeePaymentDetails.push(e2);
          });
        }
      });
    });

    monthFeePaymentDetails.forEach(x1 => x1.DueAmount = x1.TotalAmount);
    //deduct paid amount
    var notUsedPaidFeePaymentDetailList: FeePaymentDetailModel[] = [];
    this.PaidFeePaymentDetailList.forEach((e1: FeePaymentDetailModel) => {
      const e2s = FeePaymentDetailList.filter(x1 => x1.HeadId == e1.HeadId && x1.FeeFor == e1.FeeFor);
      if (e2s.length != 0) {
        const e2 = e2s[0];
        e2.FeeAmount -= e1.FeeAmount;
        e2.WaiveOffAmount -= e1.WaiveOffAmount;
        // if (e2.WaiveOffAmount < 0)
        //   e2.WaiveOffAmount = 0
        e2.TotalAmount = e2.FeeAmount - e2.WaiveOffAmount;
      } else {
        notUsedPaidFeePaymentDetailList.push(e1);
      }

      var remainingBalance: number = e1.FeeAmount;
      var filterList: FeePaymentDetailModel[] = monthFeePaymentDetails.filter(x => x.HeadId == e1.HeadId && x.FeeFor == e1.FeeFor && x.DueAmount > 0);
      if (filterList.length == 0)
        filterList = monthFeePaymentDetails.filter(x => x.HeadId == e1.HeadId && x.DueAmount > 0);
      for (let i1 = 0; i1 < filterList.length; i1++) {
        const mf1 = filterList[i1];
        if (remainingBalance > mf1.TotalAmount) {
          mf1.PaidAmount = mf1.TotalAmount;
          mf1.DueAmount = mf1.TotalAmount - mf1.PaidAmount;
          remainingBalance -= mf1.TotalAmount;
        } else {
          mf1.PaidAmount = remainingBalance;
          mf1.DueAmount = mf1.TotalAmount - mf1.PaidAmount;
          remainingBalance = 0;
          break;
        }
      }
    });
    this.FeeSessionList.forEach(f1 => f1.FeePaymentMonthList.forEach(f2 => {
      f2.PaidAmount = 0;
      f2.FeePaymentDetailList.forEach(f3 => f2.PaidAmount += f3.PaidAmount);
      f2.DueAmount = f2.TotalAmount - f2.PaidAmount;
      if (f2.DueAmount > 0) {
        f2.FeePaymentMonthId = 0;
        f1.IsPaidAll = false;
      }
    }));

    notUsedPaidFeePaymentDetailList.forEach(e1 => {
      const e2s = FeePaymentDetailList.filter(x1 => x1.HeadId == e1.HeadId);
      if (e2s.length != 0) {
        const e2 = e2s[0];
        e2.FeeAmount -= e1.FeeAmount;
        e2.WaiveOffAmount -= e1.WaiveOffAmount;
        // if (e2.WaiveOffAmount < 0)
        //   e2.WaiveOffAmount = 0
        // e2.TotalAmount = e2.FeeAmount - e2.WaiveOffAmount;
      }
    });

    //remove negative values
    FeePaymentDetailList.forEach((e1: FeePaymentDetailModel) => {
      e1.InitialAmount = e1.FeeAmount;
      if (e1.FeeAmount != 0) {
        this.FeePaymentDetailList.push(e1);
      }
    });

    this.FeePaymentDetailList.forEach(x1 => {
      if (x1.WaiveOffAmount < 0)
        x1.WaiveOffAmount = 0
      x1.TotalAmount = x1.FeeAmount - x1.WaiveOffAmount;

      if (this.PaymentFeeForList.filter(x2 => x1.FeeFor == x2.Key).length == 0) {
        this.PaymentFeeForList.push({ Key: x1.FeeFor, IsSelected: true })
      }
    });
    this.PaymentFeeForList.forEach(x => x.DueAmount = x.InitialAmount - x.PaidAmount)
    // var negativeFeePaymentDetailList: FeePaymentDetailModel[] = [];
    // FeePaymentDetailList.filter(x => x.FeeAmount < 0).forEach(f1 => {
    //   if (negativeFeePaymentDetailList.filter(x1 => x1.HeadId == f1.HeadId).length != 0)
    //     negativeFeePaymentDetailList.filter(x1 => x1.HeadId == f1.HeadId)[0].FeeAmount += f1.FeeAmount;
    //   else
    //     negativeFeePaymentDetailList.push(f1);
    // });
    // negativeFeePaymentDetailList.forEach(f1 => {
    //   var amt = -f1.FeeAmount;
    //   var f2s = this.FeePaymentDetailList.filter(x1 => x1.HeadId == f1.HeadId);
    //   for (let i1 = 0; i1 < f2s.length; i1++) {
    //     const e1 = f2s[i1];
    //     if (amt <= e1.FeeAmount) {
    //       e1.FeeAmount -= amt;
    //       e1.TotalAmount = e1.FeeAmount - e1.WaiveOffAmount;
    //       e1.InitialAmount = e1.FeeAmount;
    //       break;
    //     }
    //     else {
    //       amt -= e1.FeeAmount;
    //       e1.FeeAmount = 0;
    //     }
    //   }
    //   this.FeePaymentDetailList = this.FeePaymentDetailList.filter(x => x.FeeAmount != 0);
    // });

    this.calculateTotal();
  }

  changePaymentFeeFor(paymentFeeFor: any) {
    this.FeePaymentDetailList.filter(x => x.FeeFor == paymentFeeFor.Key).forEach(x => x.IsSelected = paymentFeeFor.IsSelected);
    this.calculateTotal();
  }

  changeAmount(FeePaymentDetail: FeePaymentDetailModel, ChangeParam: number) {
    FeePaymentDetail.TotalAmount = FeePaymentDetail.FeeAmount - FeePaymentDetail.WaiveOffAmount;
    // if (FeePaymentDetail.TotalAmount < 0) {
    //   if (ChangeParam == 1)
    //     FeePaymentDetail.FeeAmount = 0;
    //   else
    //     FeePaymentDetail.WaiveOffAmount = 0;
    //   FeePaymentDetail.TotalAmount = FeePaymentDetail.FeeAmount - FeePaymentDetail.WaiveOffAmount;
    //   this.toastr.error("Invalid Amount !!");
    // }
    this.calculateTotal();
  }

  FeePayment: any = {};
  calculateTotal() {
    this.FeePayment.FeeAmount = 0;
    this.FeePayment.WaiveOffAmount = 0;
    this.FeePayment.PaidAmount = 0;
    this.FeePayment.TotalAmount = 0;
    this.FeePayment.InitialAmount = 0;

    this.FeePaymentDetailList.forEach((e1: FeePaymentDetailModel) => {
      if (e1.IsSelected || e1.IsCompulsory) {
        this.FeePayment.FeeAmount += e1.FeeAmount;
        this.FeePayment.WaiveOffAmount += e1.WaiveOffAmount ?? 0;
        this.FeePayment.TotalAmount += e1.TotalAmount;
        if (ConstantData.getSchoolNo() == SchoolNos.RPS_Inter_College) {
          this.FeePayment.InitialAmount += e1.InitialAmount;
        }
      }
      if (ConstantData.getSchoolNo() != SchoolNos.RPS_Inter_College) {
        this.FeePayment.InitialAmount += e1.InitialAmount;
      }
    });
    this.FeePayment.PaidAmount = this.FeePayment.TotalAmount;
    this.FeePayment.DueAmount = this.FeePayment.InitialAmount - this.FeePayment.PaidAmount - this.FeePayment.WaiveOffAmount;
  }

  saveFeePayment() {
    this.isSubmitted = true;
    this.formFeePayment.control.markAllAsTouched();
    if (this.formFeePayment.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    var FeePaymentDetailList: FeePaymentDetailModel[] = [];
    var FeePaymentMonthList: FeePaymentMonthModel[] = [];
    this.FeePaymentDetailList.forEach((e1: FeePaymentDetailModel) => {
      if (e1.IsCompulsory || e1.IsSelected)
        FeePaymentDetailList.push(e1);
    });

    this.FeeSessionList.forEach(fs1 => {
      fs1.FeePaymentMonthList.forEach((e1: FeePaymentMonthModel) => {
        if (e1.IsSelected && e1.FeePaymentMonthId == 0) {
          e1.PupilAdmissionId = fs1.PupilAdmissionId;
          FeePaymentMonthList.push(e1);
        }
      });
    })

    if (this.FeePayment.ChequeDate)
      this.FeePayment.ChequeDate = this.loadDataService.loadDateYMD(this.FeePayment.ChequeDate);
    if (this.loadDataService.loadDateYMD(this.FeePayment.PaymentDate) == this.loadDataService.loadDateYMD(new Date()))
      this.FeePayment.PaymentDate = this.loadDataService.loadDateTime(new Date());
    else
      this.FeePayment.PaymentDate = this.loadDataService.loadDateYMD(this.FeePayment.PaymentDate);
    this.FeePayment.PaymentFor = PaymentFor.Fee;
    var obj = {
      FeePayment: this.FeePayment,
      FeePaymentDetailList: FeePaymentDetailList,
      FeePaymentMonthList: FeePaymentMonthList,
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
    this.FilterObj.IsPrint = isPrint;
    this.FilterObj.docType = docType;
    this.FilterObj.Id = Id;
    this.service.printFeeePaymentReceipt(this.loadDataService.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(this.FilterObj))));
  }

  // this.feePaymentForm = this.formBuilder.group({
  //   PupilAdmissionId: [null, Validators.required],
  //   PaymentDate: [null, Validators.required],
  //   PaymentMode: [null, Validators.required],
  //   ChequeNo: [null],
  //   ChequeDate: [null],
  //   ChequeBank: [null],
  //   TransactionNo: [null],
  //   FeeAmount: [null, Validators.required],
  //   WaiveOffAmount: [null, Validators.required],
  //   TotalAmount: [null, Validators.required],
  //   PaidAmount: [null, Validators.required],
  //   WaiveOfPaidAmountfAmount: [null],
  //   Remarks: [null],
  //   RemarksOnWaiveOff: [null],
  // })
}