import { Component, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { FeeFor, PaymentFor, PaymentMode, SchoolNos } from '../../../utils/enum';
import { ActionModel, FilterModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LoadDataService } from '../../../utils/load-data.service';
import { LocalService } from '../../../utils/local.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-yearly-collection-report',
  templateUrl: './yearly-collection-report.component.html',
  styleUrls: ['./yearly-collection-report.component.css']
})
export class YearlyCollectionReportComponent {
  dataLoading: boolean = false
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = 'RollNo';
  itemPerPage: number = this.PageSize[0];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  YearlyCollectionList: any[] = [];
  PaymentForList = PaymentFor;
  PaymentModeList = PaymentMode;
  FeeForList = FeeFor;
  today: Date = new Date();
  filterModel: FilterModel = {
  } as FilterModel;
  //isAccount: boolean = ConstantData.getSchoolNo() == SchoolNos.RPS_Inter_College;
  currentDate: Date = new Date();

  @ViewChild('fromFilter') fromFilter: NgForm;

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private localService: LocalService,
    private loadDataService: LoadDataService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    // this.getSectionList();
    // this.getClassList();
    // if (this.isAccount) {
    this.getAccountList();
    // }
    this.route.paramMap.subscribe((params1: any) => {
      this.validiateMenu();
      this.filterModel = {
        AccountId: 0,
        ReportNo: parseInt(params1.get('id')),
      } as FilterModel;

      if (this.filterModel.ReportNo == 2) {
        this.filterModel.MonthId = this.currentDate.getMonth() + 1;
        this.getMonthList();
      } else if(this.filterModel.ReportNo==3) {
        this.filterModel.FromDateString = new Date();
        this.filterModel.ToDateString = new Date();
        this.getYearlyCollectionList(true);
      }

      if (this.filterModel.ReportNo == 1 || this.filterModel.ReportNo == 2) {
        if (this.SessionList.length == 0)
          this.getSessionList();
        else {
          this.filterModel.SessionId = this.SessionList[0].SessionId;
          this.getYearlyCollectionList(true);
        }
      }

      this.YearlyCollectionList = [];
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

  SessionList: any[] = [];
  getSessionList() {
    var obj = {}
    this.dataLoading = true
    this.service.getSessionList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.SessionList = response.SessionList;
        this.filterModel.SessionId = response.CurrentSessionId;
        this.getYearlyCollectionList(true);
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  SectionList: any[] = [];
  changeClass() {
    this.SectionList = this.AllSectionList.filter(x => x.ClassId == this.filterModel.ClassId);
    this.filterModel.SectionId = 0;
    // if (this.SectionList.length > 0)
    //   this.filterModel.SectionId = this.SectionList[0].SectionId;
  }

  MonthList: any[] = [];
  getMonthList() {
    var obj = {}
    this.dataLoading = true
    this.service.getMonthList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.MonthList = response.MonthList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  ClassList: any[] = [];
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

  FooterObj: any = {};
  getYearlyCollectionList(isStart:boolean) {
    if (this.fromFilter && this.fromFilter.invalid && !isStart) {
      this.toastr.error('Fill all the required fields !!');
      this.YearlyCollectionList = [];
      return;
    }

    this.FooterObj = {
      FeeAmount: 0,
      InitialAmount: 0,
      WaiveOffAmount: 0,
      TotalAmount: 0,
    };

    this.filterModel.FromDate = this.loadDataService.loadDateYMD(this.filterModel.FromDateString);
    this.filterModel.ToDate = this.loadDataService.loadDateYMD(this.filterModel.ToDateString);

    this.dataLoading = true;
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.filterModel))
    }
    this.service.getYearlyCollectionList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.YearlyCollectionList = response.YearlyCollectionList;
        this.YearlyCollectionList.forEach((e1: any) => {
          this.FooterObj.FeeAmount += e1.FeeAmount;
          this.FooterObj.InitialAmount += e1.InitialAmount;
          this.FooterObj.WaiveOffAmount += e1.WaiveOffAmount;
          this.FooterObj.TotalAmount += e1.TotalAmount;
        });
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  printReport(docType: number, isPrint: boolean) {
    if (this.fromFilter.invalid) {
      this.toastr.error('Fill all the required fields !!');
      this.YearlyCollectionList = [];
      return;
    }

    this.filterModel.IsPrint = isPrint;
    this.filterModel.docType = docType;
    this.service.printYearlyCollectionReport(this.loadDataService.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(this.filterModel))));
  }

  @ViewChild('table_1') table_1: ElementRef;
  isExporting: boolean = false;
  exportToExcel() {
    this.isExporting = true;
    var itemPerPage = this.itemPerPage;
    var p = this.p;
    this.p = 1;
    this.itemPerPage = this.YearlyCollectionList.length;
    setTimeout(() => {
      this.loadDataService.exportToExcel(this.table_1, "Fee Due List " + this.loadDataService.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
    }, 1000);

  }

}
