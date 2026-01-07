import { Component, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { FeeFor, FeePaymentStatus, PaymentFor, PaymentMode, SchoolNos } from '../../../utils/enum';
import { ActionModel, FeePaymentDetailModel, FilterModel, KeyValueModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LoadDataService } from '../../../utils/load-data.service';
import { LocalService } from '../../../utils/local.service';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-fee-payment-list',
  templateUrl: './fee-payment-list.component.html',
  styleUrls: ['./fee-payment-list.component.css']
})
export class FeePaymentListComponent {
  dataLoading: boolean = false
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  SectionList: any[] = [];
  SessionList: any[] = [];
  ClassList: any[] = [];
  filterModel: FilterModel = {
    ClassId: 0,
    SectionId: 0,
    SessionId: 0,
    AccountId: 0,
    ReportNo: 1,
    PaymentMode:0
  } as FilterModel;
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  FeePaymentList: any[] = [];
  PaymentForList = PaymentFor;
  AllPaymentModeList = PaymentMode;
  PaymentModeList:KeyValueModel[]=[];
  FeeForList = FeeFor;
  isAccount: boolean = ConstantData.getSchoolNo() == SchoolNos.RPS_Inter_College;
  // @ViewChild('FilterObjForm') FilterObjForm: NgForm;

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

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
    this.PaymentModeList = this.loadDataService.GetEnumList(PaymentMode);
    if (this.isAccount) {
      this.getAccountList();
    }

    this.route.paramMap.subscribe((params1: any) => {
      this.validiateMenu();
      var id = params1.get('id');
      this.filterModel.ReportNo = id;
      if (id == 1) {
        this.getSearchPupilList();
      } else {
        this.filterModel.FromDateString = new Date();
        this.filterModel.ToDateString = new Date();
        this.getFeePaymentList();
        this.getSectionList();
        this.getSessionList();
        this.getClassList();
      }
    });
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
    this.filterModel.PupilId = 0;
    this.FeePaymentList = [];
  }

  afterPupilSeleted(event: any) {
    this.filterModel.PupilId = event.option.id;
    this.getFeePaymentList();
  }

  clearPupil() {
    this.PupilList = this.AllPupilList;
    this.FeePaymentList = [];
    this.filterModel.SearchPupil = '';
  }


  FooterObj: any = {};
  getFeePaymentList() {
    // if (this.FilterObjForm.invalid) {
    //   this.toastr.error("Session is required!!");
    //   return;
    // }
    this.FooterObj = {
      FeeAmount: 0,
      WaiveOffAmount: 0,
      PaidAmount: 0,
      DueAmount: 0,
      FeePaymentStatus: FeePaymentStatus.Paid
    };
    this.filterModel.FromDate = this.loadDataService.loadDateYMD(this.filterModel.FromDateString);
    this.filterModel.ToDate = this.loadDataService.loadDateYMD(this.filterModel.ToDateString);
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.filterModel))
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

  FeePaymentDetailList: FeePaymentDetailModel[] = [];
  getFeePaymentDetailList(obj: any) {
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ FeePaymentId: obj.FeePaymentId }))
    }
    this.dataLoading = true
    this.service.getFeePaymentDetailList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.FeePaymentDetailList = response.FeePaymentDetailList;
        $('#modal_popup').modal('show');
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  AllSectionList: any[] = [];
  getSectionList() {
    var obj = {}
    this.dataLoading = true
    this.service.getSectionList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllSectionList = response.SectionList;
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
        // this.filterModel.SessionId = response.CurrentSessionId;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  changeClass() {
    this.AllSectionList.forEach((e1: any) => {
      if (e1.ClassId == this.filterModel.ClassId) {
        this.SectionList.push(e1);
      }
    });
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
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  deleteFeePayment(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj))
      }
      this.dataLoading = true;
      this.service.deleteFeePayment(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully");
          this.FeePaymentList = this.FeePaymentList.filter(x => x.FeePaymentId != obj.FeePaymentId)
          // this.getFeePaymentList()
        } else {
          this.toastr.error(response.Message)
        }
        this.dataLoading = false;
      }, (err => {
        this.toastr.error("Error occured while deleteing the recored")
        this.dataLoading = false;
      }))
    }
  }

  editRecord(obj: any) {
    this.router.navigate(['/admin/fee-payment-edit/' + this.loadDataService.replaceSpecialCharacter(this.localService.encrypt(obj.FeePaymentId))]);
  }

  printFeeePaymentReceipt(docType: number, isPrint: boolean, item: any) {
    var FilterObj = {
      IsPrint: isPrint,
      docType: docType,
      Id: item.FeePaymentId
    }
    this.service.printFeeePaymentReceipt(this.loadDataService.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(FilterObj))));
  }

  printFeePaymentList(docType: number, isPrint: boolean) {
    this.filterModel.IsPrint = isPrint;
    this.filterModel.docType = docType;
    // this.filterModel.FromDate = this.loadDataService.loadDateYMD(this.filterModel.FromDateString);
    // this.filterModel.ToDate = this.loadDataService.loadDateYMD(this.filterModel.ToDateString);
    this.service.printFeePaymentList(this.loadDataService.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(this.filterModel))));
  }

  @ViewChild('table_1') table_1: ElementRef;
  isExporting: boolean = false;
  exportToExcel() {
    this.isExporting = true;
    var itemPerPage = this.itemPerPage;
    var p = this.p;
    this.p = 1;
    this.itemPerPage = this.FeePaymentList.length;
    setTimeout(() => {
      this.loadDataService.exportToExcel(this.table_1, "Fee Payment List " + this.loadDataService.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
    }, 1000);

  }

}
