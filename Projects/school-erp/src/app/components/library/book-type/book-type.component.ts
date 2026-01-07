import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { Status } from '../../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { Router } from '@angular/router';
import { LibraryService } from '../../../services/library.service';
import { BookTypeModel } from '../../../interfaces/book-type-model';
declare var $: any;

@Component({
  selector: 'app-book-type',
  templateUrl: './book-type.component.html',
  styleUrls: ['./book-type.component.css']
})
export class BookTypeComponent {
  dataLoading: boolean = false
  BookTypeList: BookTypeModel[] = []
  BookType: BookTypeModel = {} as BookTypeModel
  StatusList = this.loadData.GetEnumList(Status);
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  AllStatusList = Status;
  recordTitle = "Book Type";

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private libraryService:LibraryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getBookTypeList();
    this.resetForm();
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
      this.toastr.error(ConstantData.serverMessage)
      this.dataLoading = false;
    }))
  }

  @ViewChild('formBookType') formBookType: NgForm;
  resetForm() {
    this.BookType = { Status:Status.Active} as BookTypeModel;
    if (this.formBookType) {
      this.formBookType.control.markAsPristine();
      this.formBookType.control.markAsUntouched();
    }
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  getBookTypeList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.libraryService.getBookTypeList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.BookTypeList = response.BookTypeList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error(ConstantData.serverMessage)
      this.dataLoading = false;
    }))
  }

  saveBookType() {
    this.formBookType.control.markAllAsTouched();
    if (this.formBookType.invalid) {
      this.toastr.error(ConstantData.formInvalidMessage)
      return
    }
    if (this.BookType.BookTypeId)
      this.BookType.UpdatedBy = this.staffLogin.StaffLoginId;
    else
      this.BookType.CreatedBy = this.staffLogin.StaffLoginId;
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.BookType)).toString()
    }
    this.dataLoading = true;
    this.libraryService.saveBookType(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.BookType.BookTypeId > 0) {
          this.toastr.success(ConstantData.updateMessage)
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success(ConstantData.submitMessage)
        }
        this.resetForm()
        this.getBookTypeList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error(ConstantData.serverMessage)
      this.dataLoading = false;
    }))
  }

  deleteBookType(obj: any) {
    if (confirm(ConstantData.deleteConfirmation)) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true
      this.libraryService.deleteBookType(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success(ConstantData.deleteMessage);
          this.BookTypeList = this.BookTypeList.filter(x => x.BookTypeId != obj.BookTypeId);
        } else {
          this.toastr.error(response.Message)
        }
        this.dataLoading = false
      }, (err => {
        this.toastr.error(ConstantData.serverMessage);
        this.dataLoading = false
      }))
    }
  }

  editBookType(obj: any) {
    this.resetForm()
    this.BookType = obj
    $('#staticBackdrop').modal('show');
  }

  newBookType() {
    this.resetForm()
    $('#staticBackdrop').modal('show');
  }
}
