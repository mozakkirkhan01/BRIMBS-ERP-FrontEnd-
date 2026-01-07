import { Component, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { FeeFor, PaymentFor, PaymentMode } from '../../../utils/enum';
import { ActionModel, FilterModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LoadDataService } from '../../../utils/load-data.service';
import { LocalService } from '../../../utils/local.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fee-due-list',
  templateUrl: './fee-due-list.component.html',
  styleUrls: ['./fee-due-list.component.css']
})
export class FeeDueListComponent {
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
  FeeDueList: any[] = [];
  PaymentForList = PaymentFor;
  PaymentModeList = PaymentMode;
  FeeForList = FeeFor;
  today: Date = new Date();
  filterModel: FilterModel = {
    SectionId:0,
    // ClassId:0,
    MonthId : this.today.getMonth()
  } as FilterModel;

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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getAllSearchPupilList();
    this.getSectionList();
    this.getSessionList();
    this.getClassList();
    this.getMonthList();
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url,StaffLoginId:this.staffLogin.StaffLoginId })).toString()
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


  PupilList: any[] = [];
  AllPupilList: any[] = [];
  getAllSearchPupilList() {
    this.dataLoading = true
    this.service.getAllSearchPupilList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllPupilList = response.PupilList;
        this.AllPupilList.map(x1 => x1.SearchPupil = `${x1.AdmissionNo} - ${x1.PupilName}`);
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
    this.filterModel.PupilId = 0;
  }

  clearPupil() {
    this.filterModel.PupilId = 0;
    this.filterModel.SearchPupil = "";
    this.PupilList = this.AllPupilList;
  }

  afterPupilSeleted(event: any) {
    this.filterModel.PupilId = event.option.id;
  }

  FooterObj: any = {};
  getFeeDueList() {
    if (this.fromFilter.invalid) {
      this.toastr.error('Fill all the required fields !!');
      this.FeeDueList = [];
      return;
    }

    this.FooterObj = {
      AdmissionFee: 0,
      ClassFee: 0,
      Fine: 0,
      OtherCharges: 0,
      RegistrationFee: 0,
      TransportFee: 0,
      TotalAmount: 0,
      HostelFee: 0,
    };
    var request:RequestModel = {
      request:this.localService.encrypt(JSON.stringify(this.filterModel))
    }
    this.dataLoading = true
    this.service.getFeeDueList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.FeeDueList = response.FeeDueList;
        this.FeeDueList.forEach((e1: any) => {
          this.FooterObj.AdmissionFee += e1.AdmissionFee;
          this.FooterObj.ClassFee += e1.ClassFee;
          this.FooterObj.Fine += e1.Fine;
          this.FooterObj.OtherCharges += e1.OtherCharges;
          this.FooterObj.RegistrationFee += e1.RegistrationFee;
          this.FooterObj.TransportFee += e1.TransportFee;
          this.FooterObj.TotalAmount += e1.TotalAmount;
          this.FooterObj.HostelFee += e1.HostelFee;
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

  printFeeDueReport(docType: number, isPrint: boolean) {
    if (this.fromFilter.invalid) {
      this.toastr.error('Fill all the required fields !!');
      this.FeeDueList = [];
      return;
    }

    this.filterModel.IsPrint = isPrint;
    this.filterModel.docType = docType;
    this.service.printFeeDueReport(this.loadDataService.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(this.filterModel))));
  }

  @ViewChild('table_1') table_1: ElementRef;
  isExporting: boolean = false;
  exportToExcel() {
    this.isExporting = true;
    var itemPerPage = this.itemPerPage;
    var p = this.p;
    this.p = 1;
    this.itemPerPage = this.FeeDueList.length;
    setTimeout(() => {
      this.loadDataService.exportToExcel(this.table_1, "Fee Due List " + this.loadDataService.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
    }, 1000);

  }

}
