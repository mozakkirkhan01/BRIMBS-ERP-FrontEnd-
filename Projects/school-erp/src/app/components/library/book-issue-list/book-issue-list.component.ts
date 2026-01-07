import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { IssueFor, PaymentMode, PaymentStatus, TakenBy } from '../../../utils/enum';
import { ActionModel, FilterModel, ReportModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { Router } from '@angular/router';
import { IssueModel } from '../../../interfaces/issue-model';
import { StockService } from '../../../services/stock.service';
import { IssueBookModel } from '../../../interfaces/issue-book-model';
import { StaffModel } from '../../../interfaces/staff-model';
import { PupilModel } from '../../../interfaces/pupil-model';
import { LibraryService } from '../../../services/library.service';
declare var $: any;

@Component({
  selector: 'app-book-issue-list',
  templateUrl: './book-issue-list.component.html',
  styleUrls: ['./book-issue-list.component.css']
})
export class BookIssueListComponent {
  dataLoading: boolean = false
  IssueList: IssueModel[] = []
  FilterModel: FilterModel = {
    FromDate: this.loadData.loadFirstDate(),
    ToDate: this.loadData.loadDateYMD(new Date()),
  } as FilterModel;
  Issue: IssueModel = {} as IssueModel;
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  AllPaymentStatusList = PaymentStatus;
  AllPaymentModeList = PaymentMode;
  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private stockService: StockService,
    private libraryService: LibraryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getIssueList();
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

  onTableDataChange(p: any) {
    this.p = p
  }

  editIssue(obj: any) {
    this.router.navigate([`/admin/book-issue/${this.loadData.replaceSpecialCharacter(this.localService.encrypt(obj.IssueId))}`])
  }

  reportModel: ReportModel = {} as ReportModel;
  getIssue(id: number, isPrint: boolean, docType: number) {
    this.reportModel.IsPrint = isPrint;
    this.reportModel.id = id;
    this.reportModel.DocType = docType;
    $('#headerConfirmation').modal('show');
  }

  printRecord() {
    // this.service.printIssue(this.loadData.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(this.reportModel)).toString()));
    // $('#headerConfirmation').modal('hide');
  }

  @ViewChild('table_1') table_1: ElementRef;
  isExporting: boolean = false;
  exportToExcel() {
    this.isExporting = true;
    var itemPerPage = this.itemPerPage;
    var p = this.p;
    this.p = 1;
    this.itemPerPage = this.IssueList.length;
    setTimeout(() => {
      this.loadData.exportToExcel(this.table_1, "Book Issue " + this.loadData.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
    }, 1000);
  }

  getIssueList() {
    this.IssueList = [];
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({
        FromDate: this.loadData.loadDateYMD(this.FilterModel.FromDate),
        ToDate: this.loadData.loadDateYMD(this.FilterModel.ToDate),
        IssueFor: IssueFor.Library
      })).toString()
    }
    this.dataLoading = true
    this.stockService.getIssueList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.IssueList = response.IssueList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  recordPupil = ConstantData.recordPupil;
  IssueBookList: IssueBookModel[] = [];
  SelectedIssue: IssueModel = {} as IssueModel;
  Staff: StaffModel = {} as StaffModel;
  Pupil: PupilModel = {} as PupilModel;
  getIssueDetail(issue: IssueModel) {
    var obj: RequestModel = {
      request: this.localService.encrypt(issue.IssueId.toString()).toString()
    }
    this.dataLoading = true
    this.libraryService.getIssueBookDetail(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.IssueBookList = response.IssueBookList;
        this.SelectedIssue = response.Issue;
        if (this.SelectedIssue.TakenBy == TakenBy.Staff) {
          this.Staff = response.Staff;
          this.Pupil = {} as PupilModel;
        } else {
          this.Pupil = response.Pupil;
          this.Staff = {} as StaffModel;
        }
        $('#modal_detail').modal('show');
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  deleteIssue(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true
      this.libraryService.deleteIssueBook(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getIssueList()
        } else {
          this.toastr.error(response.Message)
          this.dataLoading = false
        }
      }, (err => {
        this.toastr.error("Error occured while deleteing the recored")
        this.dataLoading = false
      }))
    }
  }


}
