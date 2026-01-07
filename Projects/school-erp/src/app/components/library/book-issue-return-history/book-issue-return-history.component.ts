import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { IssueBookStatus, IssueFor, TakenBy } from '../../../utils/enum';
import { ActionModel, FilterModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { Router } from '@angular/router';
import { IssueBookModel } from '../../../interfaces/issue-book-model';
import { StaffModel } from '../../../interfaces/staff-model';
import { PupilModel } from '../../../interfaces/pupil-model';
import { LibraryService } from '../../../services/library.service';
declare var $: any;

@Component({
  selector: 'app-book-issue-return-history',
  templateUrl: './book-issue-return-history.component.html',
  styleUrls: ['./book-issue-return-history.component.css']
})
export class BookIssueReturnHistoryComponent {
  dataLoading: boolean = false
  IssueBookList: IssueBookModel[] = []
  FilterModel: FilterModel = {
    FromDate: this.loadData.loadFirstDate(),
    ToDate: this.loadData.loadDateYMD(new Date()),
    PupilId: 0,
    StaffId: 0,
    Status: 0,
    TakenBy: 0,
  } as FilterModel;
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = 'IssueDate';
  itemPerPage: number = this.PageSize[0];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  AllIssueBookStatusList = IssueBookStatus;
  IssueBookStatusList = this.loadData.GetEnumList(IssueBookStatus);
  TakenByList = this.loadData.GetEnumList(TakenBy);
  recordPupil = ConstantData.recordPupil;

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private libraryService: LibraryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getIssueBookList();
    this.getStaffList();
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

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  changeTakenBy() {
    this.clearPupil();
    this.clearStaff();
    if (this.AllPupilList.length == 0) {
      this.getSearchPupilList();
    }
  }

  AllPupilList: PupilModel[] = [];
  PupilList: PupilModel[] = [];
  getSearchPupilList() {
    this.dataLoading = true
    this.service.getSearchPupilList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllPupilList = response.PupilList;
        this.AllPupilList.map(x1 => x1.SearchPupil = `${x1.AdmissionNo} - ${x1.PupilName} - ${x1.ClassName}`);
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

  afterPupilSelected(event: any) {
    this.FilterModel.PupilId = event.option.id;
    this.FilterModel.StaffId = 0;
  }

  filterPupilList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.PupilList = this.AllPupilList.filter((option: any) => option.SearchPupil.toLowerCase().includes(filterValue));
    } else {
      this.PupilList = this.AllPupilList;
    }
    this.FilterModel.PupilId = 0;
    this.FilterModel.StaffId = 0;
  }
  clearPupil() {
    this.PupilList = this.AllPupilList;
    this.FilterModel.PupilId = 0;
    this.FilterModel.StaffId = 0;
    this.FilterModel.SearchPupil = "";
  }

  StaffList: StaffModel[] = [];
  AllStaffList: StaffModel[] = [];
  getStaffList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getStaffList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllStaffList = response.StaffList;
        this.AllStaffList.map(x1 => x1.SearchStaff = `${x1.StaffName} - ${x1.MobileNo}`);
        this.StaffList = this.AllStaffList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  afterStaffSelected(event: any) {
    this.FilterModel.StaffId = event.option.id;
    this.FilterModel.PupilId = 0;
  }

  filterStaffList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.StaffList = this.AllStaffList.filter((option: any) => option.SearchStaff.toLowerCase().includes(filterValue));
    } else {
      this.StaffList = this.AllStaffList;
    }
    this.FilterModel.StaffId = 0;
    this.FilterModel.PupilId = 0;
  }
  clearStaff() {
    this.StaffList = this.AllStaffList;
    this.FilterModel.StaffId = 0;
    this.FilterModel.PupilId = 0;
    this.FilterModel.SearchStaff = "";
  }

  @ViewChild('table_1') table_1: ElementRef;
  isExporting: boolean = false;
  exportToExcel() {
    this.isExporting = true;
    var itemPerPage = this.itemPerPage;
    var p = this.p;
    this.p = 1;
    this.itemPerPage = this.IssueBookList.length;
    setTimeout(() => {
      this.loadData.exportToExcel(this.table_1, "Book Issue " + this.loadData.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
    }, 1000);
  }

  getIssueBookList() {
    this.IssueBookList = [];
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({
        FromDate: this.loadData.loadDateYMD(this.FilterModel.FromDate),
        ToDate: this.loadData.loadDateYMD(this.FilterModel.ToDate),
        IssueFor: IssueFor.Library,
        PupilId: this.FilterModel.PupilId,
        StaffId: this.FilterModel.StaffId,
        Status: this.FilterModel.Status,
        TakenBy: this.FilterModel.TakenBy,
      })).toString()
    }
    this.dataLoading = true
    this.libraryService.getIssueBookList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.IssueBookList = response.IssueBookList;
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
