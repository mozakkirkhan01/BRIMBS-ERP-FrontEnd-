import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { BookStockStatus, Status, TakenBy } from '../../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IssueModel } from '../../../interfaces/issue-model';
import { IssueBookModel } from '../../../interfaces/issue-book-model';
import { StockService } from '../../../services/stock.service';
import { BookStockModel } from '../../../interfaces/book-stock-model';
import { StaffModel } from '../../../interfaces/staff-model';
import { PupilModel } from '../../../interfaces/pupil-model';
import { LibraryService } from '../../../services/library.service';

@Component({
  selector: 'app-book-issue',
  templateUrl: './book-issue.component.html',
  styleUrls: ['./book-issue.component.css']

})
export class BookIssueComponent {
  dataLoading: boolean = false
  Issue: IssueModel = {} as IssueModel;
  IssueBookList: IssueBookModel[] = [];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  Staff: StaffModel = {} as StaffModel;
  Pupil: PupilModel = {} as PupilModel;
  TakenByList = this.loadData.GetEnumList(TakenBy);
  recordPupil = ConstantData.recordPupil;
  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private stockService: StockService,
    private libraryService: LibraryService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.resetForm();
    this.getStaffList();
    this.getBookStockList();
    this.route.paramMap.subscribe((params1: any) => {
      var issueId = params1.get('id');
      if (issueId) {
        var obj: RequestModel = {
          request: this.loadData.restoreSpecialCharacter(issueId)
        }
        this.dataLoading = true
        this.libraryService.getIssueBookDetail(obj).subscribe(r1 => {
          let response = r1 as any
          if (response.Message == ConstantData.SuccessMessage) {
            if (response.Staff != null) {
              this.Staff = response.Staff;
              this.Staff.SearchStaff = this.Staff.StaffName;
            }
            if (response.Pupil != null) {
              this.Pupil = response.Pupil
              this.Pupil.SearchPupil = this.Pupil.SearchPupil;
            }
            this.Issue = response.Issue;
            this.IssueBookList = response.IssueBookList;
          } else {
            this.toastr.error(response.Message)
          }
          this.dataLoading = false
        }, (err => {
          this.toastr.error("Error while fetching records")
        }))
      }
    });
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: '/admin/book-issue', StaffLoginId: this.staffLogin.StaffLoginId })).toString()
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
  @ViewChild('formStaff') formStaff: NgForm;
  @ViewChild('formIssueBook') formIssueBook: NgForm;
  resetForm() {
    this.Issue = {
      IssueDate: new Date(),
      TakenBy: this.Issue.TakenBy ?? TakenBy.Staff
    } as IssueModel;
    this.changeTakenBy();
    this.IssueBookList = [];
    if (this.formStaff) {
      this.formStaff.control.markAsPristine();
      this.formStaff.control.markAsUntouched();
    }
  }


  BookStockList: BookStockModel[] = [];
  AllBookStockList: BookStockModel[] = [];
  getBookStockList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Status: BookStockStatus.Available })).toString()
    }
    this.dataLoading = true
    this.libraryService.getBookStockList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllBookStockList = response.BookStockList;
        this.AllBookStockList.map(x => x.SearchBook = `${x.BookNo} - ${x.Book.BookName}`);
        this.BookStockList = this.AllBookStockList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  afterBookSelected(event: any) {
    this.IssueBook.BookStockId = event.option.id;
    this.IssueBook.BookStock = this.BookStockList.filter(x => x.BookStockId = this.IssueBook.BookStockId)[0];
  }

  filterBookStockList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.BookStockList = this.AllBookStockList.filter((option: any) => option.SearchBook.toLowerCase().includes(filterValue));
    } else {
      const issueBookStockIds = this.IssueBookList.map(x => x.BookStockId);
      this.BookStockList = this.AllBookStockList.filter((x: any) => !issueBookStockIds.includes(x.BookStockId.toString()));
    }
    this.IssueBook.BookStockId = 0;
  }

  clearBook() {
    this.IssueBook = {
      BookStock: {} as BookStockModel
    } as IssueBookModel;
    if (this.formIssueBook) {
      this.formIssueBook.control.markAsUntouched();
      this.formIssueBook.control.markAsPristine();
    }
    this.filterBookStockList(null);
  }

  removeBook(index: number, issueBook: IssueBookModel) {
    this.IssueBookList.splice(index, 1);
    this.filterBookStockList(null);
  }

  IssueBook: IssueBookModel = { BookStock: {} as BookStockModel } as IssueBookModel;
  addIssueBook() {
    this.formIssueBook.control.markAllAsTouched();
    if (this.formIssueBook.invalid) {
      this.toastr.error(ConstantData.formInvalidMessage)
      return
    }
    if (this.IssueBook.BookStockId == 0 || this.IssueBook.BookStockId == null) {
      this.toastr.error('Invalid Book !!')
      return
    }
    this.IssueBookList.push(this.IssueBook);
    this.clearBook();
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
        this.AllPupilList.map(x1 => x1.SearchPupil = `${x1.AdmissionNo} - ${x1.PupilName} - ${x1.ClassName} - ${x1.SectionName}`);
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
    this.Issue.PupilId = event.option.id;
    this.Pupil = this.PupilList.find(x => x.PupilId == this.Issue.PupilId)!;
    this.Issue.StaffId = null;
  }

  filterPupilList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.PupilList = this.AllPupilList.filter((option: any) => option.SearchPupil.toLowerCase().includes(filterValue));
    } else {
      this.PupilList = this.AllPupilList;
    }
    this.Issue.PupilId = null;
    this.Issue.StaffId = null;
  }
  clearPupil() {
    this.PupilList = this.AllPupilList;
    this.Issue.PupilId = null;
    this.Issue.StaffId = null;
    this.Pupil = {} as PupilModel;
  }

  StaffList: StaffModel[] = [];
  AllStaffList: StaffModel[] = [];
  getStaffList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Status: Status.Active })).toString()
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
    this.Issue.StaffId = event.option.id;
    this.Staff = this.StaffList.find(x => x.StaffId == this.Issue.StaffId)!;
    this.Issue.PupilId = null;
  }

  filterStaffList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.StaffList = this.AllStaffList.filter((option: any) => option.SearchStaff.toLowerCase().includes(filterValue));
    } else {
      this.StaffList = this.AllStaffList;
    }
    this.Issue.StaffId = null;
    this.Issue.PupilId = null;
  }
  clearStaff() {
    this.StaffList = this.AllStaffList;
    this.Issue.StaffId = null;
    this.Staff = {} as StaffModel;
    this.Issue.PupilId = null;
  }

  saveIssueBook() {
    this.formStaff.control.markAllAsTouched();

    if (this.formStaff.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    if (this.Issue.TakenBy == TakenBy.Staff && this.Issue.StaffId == null) {
      this.toastr.error("Invalid staff !!")
      return
    }

    if (this.Issue.TakenBy == TakenBy.Student && this.Issue.PupilId == null) {
      this.toastr.error(`Invalid ${ConstantData.recordPupil} !!`)
      return
    }

    if (this.IssueBookList.length == 0) {
      this.toastr.error("No any book is selected !!")
      return
    }
    this.Issue.IssueDate = this.loadData.loadDateTime(this.Issue.IssueDate);
    this.Issue.TotalProducts = this.IssueBookList.length;
    if (this.Issue.IssueId > 0)
      this.Issue.UpdatedBy = this.staffLogin.StaffLoginId;
    else
      this.Issue.CreatedBy = this.staffLogin.StaffLoginId;
    this.Issue.IssueBooks = this.IssueBookList;

    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Issue)).toString()
    }
    this.dataLoading = true;
    this.libraryService.saveIssueBook(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Issue.IssueId > 0) {
          this.toastr.success(ConstantData.updateMessage);
          history.back();
        } else {
          this.toastr.success(ConstantData.submitMessage)
        }
        this.resetForm()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }
}
