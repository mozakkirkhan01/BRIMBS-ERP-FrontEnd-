import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { BookStockStatus, IssueBookStatus, Status, TakenBy } from '../../../utils/enum';
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
import { BookModel } from '../../../interfaces/book-model';

@Component({
  selector: 'app-book-return',
  templateUrl: './book-return.component.html',
  styleUrls: ['./book-return.component.css']
})
export class BookReturnComponent {
  dataLoading: boolean = false
  IssueBookList: IssueBookModel[] = [];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  recordPupil = ConstantData.recordPupil;
  IssueBook: IssueBookModel = { BookStock: { Book: {} as BookModel } as BookStockModel } as IssueBookModel;
  Pupil: PupilModel = {} as PupilModel;
  Staff: StaffModel = {} as StaffModel;
  SearchBook: string = "";
  IssueBookStatusList = this.loadData.GetEnumList(IssueBookStatus);

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private libraryService: LibraryService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getBookStockList();
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

  @ViewChild('formIssueBook') formIssueBook: NgForm;

  BookStockList: BookStockModel[] = [];
  AllBookStockList: BookStockModel[] = [];
  getBookStockList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Status: BookStockStatus.Isuued })).toString()
    }
    this.dataLoading = true
    this.libraryService.getBookStockList(obj).subscribe((response: any) => {
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
    var obj: RequestModel = {
      request: this.localService.encrypt(event.option.id).toString()
    }
    this.dataLoading = true
    this.libraryService.getIssueBookData(obj).subscribe((response: any) => {
      if (response.Message == ConstantData.SuccessMessage) {
        this.IssueBook = response.IssueBook;
        this.IssueBook.ReturnDate = new Date();
        this.IssueBook.IssueBookStatus = IssueBookStatus.Return;
        this.changeReturnDate();
        if (response.Pupil)
          this.Pupil = response.Pupil;
        if (response.Staff)
          this.Staff = response.Staff;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  filterBookStockList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.BookStockList = this.AllBookStockList.filter((option: any) => option.SearchBook.toLowerCase().includes(filterValue));
    } else {
      const issueBookStockIds = this.IssueBookList.map(x => x.BookStockId);
      this.BookStockList = this.AllBookStockList.filter((x: any) => !issueBookStockIds.includes(x.BookStockId.toString()));
    }
  }

  clearBook() {
    this.IssueBook = { BookStock: { Book: {} as BookModel } as BookStockModel } as IssueBookModel;
    this.Pupil = {} as PupilModel;
    this.Staff = {} as StaffModel;
    this.SearchBook = "";
    if (this.formIssueBook) {
      this.formIssueBook.control.markAsUntouched();
      this.formIssueBook.control.markAsPristine();
    }
    this.filterBookStockList(null);
  }

  changeReturnDate() {
    this.IssueBook.NoOfDays = this.loadData.getDaysBetweenDates(this.IssueBook.IssueDate, this.IssueBook.ReturnDate);
  }

  returnBook() {
    this.formIssueBook.control.markAllAsTouched();
    if (this.formIssueBook.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    if (this.IssueBook.IssueBookId == null) {
      this.toastr.error("Invalid Book !!")
      return
    }
    this.IssueBook.ReturnDate = this.loadData.loadDateTime(this.IssueBook.ReturnDate);
    this.IssueBook.UpdatedBy = this.staffLogin.StaffLoginId;

    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.IssueBook)).toString()
    }
    this.dataLoading = true;
    this.libraryService.reutrnBook(obj).subscribe((response: any) => {
      if (response.Message == ConstantData.SuccessMessage) {
        // if (this.IssueBook.IssueBookId > 0) {
        this.toastr.success(ConstantData.updateMessage);
        //   history.back();
        // } else {
        //   this.toastr.success(ConstantData.submitMessage)
        // }
        if (this.IssueBook.IssueBookStatus == IssueBookStatus.Return)
          this.AllBookStockList = this.AllBookStockList.filter(x => x.BookStockId != this.IssueBook.BookStockId);
        this.clearBook();
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