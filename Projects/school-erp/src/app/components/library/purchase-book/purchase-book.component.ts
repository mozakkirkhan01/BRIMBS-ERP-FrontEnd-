import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { PurchaseFor, Status } from '../../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseModel } from '../../../interfaces/purchase-model';
import { PurchaseBookModel } from '../../../interfaces/purchase-book-model';
import { LibraryService } from '../../../services/library.service';
import { SupplierModel } from '../../../interfaces/supplier-model';
import { BookModel } from '../../../interfaces/book-model';
import { StockService } from '../../../services/stock.service';

@Component({
  selector: 'app-purchase-book',
  templateUrl: './purchase-book.component.html',
  styleUrls: ['./purchase-book.component.css']
})
export class PurchaseBookComponent {
  dataLoading: boolean = false
  Purchase: PurchaseModel = {} as PurchaseModel;
  PurchaseBookList: PurchaseBookModel[] = [];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  Supplier: SupplierModel = {} as SupplierModel;
  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private libraryService: LibraryService,
    private stockService: StockService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.resetForm();
    this.getSupplierList();
    this.route.paramMap.subscribe((params1: any) => {
      var purchaseId = params1.get('id');
      if (purchaseId) {
        var obj: RequestModel = {
          request: this.loadData.restoreSpecialCharacter(purchaseId)
        }
        this.dataLoading = true
        this.libraryService.getPurchaseBookDetail(obj).subscribe(r1 => {
          let response = r1 as any
          if (response.Message == ConstantData.SuccessMessage) {
            this.Supplier = response.Supplier;
            this.Purchase = response.Purchase;
            this.PurchaseBookList = response.PurchaseBookList;
            this.PurchaseBookList.forEach(x => {
              x.Book.SearchBook = `${x.Book.BookName} ${x.Book.Author ?? ''} ${x.Book.Publisher ?? ''}`;
            });
            this.calculateTotal(0);
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
      request: this.localService.encrypt(JSON.stringify({ Url: '/admin/purchase-book', StaffLoginId: this.staffLogin.StaffLoginId })).toString()
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
  @ViewChild('formPurchase') formPurchase: NgForm;
  @ViewChild('formSupplier') formSupplier: NgForm;
  @ViewChild('formPurchaseBook') formPurchaseBook: NgForm;
  resetForm() {
    this.Purchase = {
      PurchaseDate: new Date(),
      BillDiscountPercentage: 0,
      BillDiscountAmount: 0,
    } as PurchaseModel;
    this.Supplier = { StateCode: ConstantData.stateCode, Status: Status.Active } as SupplierModel;
    this.PurchaseBookList = [];
    if (this.formPurchase) {
      this.formPurchase.control.markAsPristine();
      this.formPurchase.control.markAsUntouched();
    }
    if (this.formSupplier) {
      this.formSupplier.control.markAsPristine();
      this.formSupplier.control.markAsUntouched();
    }
    this.AllBookList = [];
    this.getBookList();
  }

  BookList: BookModel[] = [];
  AllBookList: BookModel[] = [];
  getBookList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Status: Status.Active })).toString()
    }
    this.dataLoading = true
    this.libraryService.getBookList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllBookList = response.BookList;
        this.AllBookList.map(x => x.SearchBook = `${x.BookName} ${x.Author ?? ''} ${x.Publisher ?? ''}`);
        this.clearBook();
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
    this.PurchaseBook.BookId = event.option.id;
    this.changeData(this.PurchaseBook, 1, false);
  }

  filterBookList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.BookList = this.AllBookList.filter((option: any) => option.SearchBook.toLowerCase().includes(filterValue));
    } else {
      this.BookList = this.AllBookList;
    }
    this.PurchaseBook.BookId = 0;
    this.PurchaseBook.Book.BookName = value;
  }

  clearBook() {
    this.BookList = this.AllBookList;
    this.PurchaseBook = {
      GSTValue: 12,
      Quantity: 1,
      FreeQunatity: 0,
      DiscountPercentage: 0,
      DiscountAmount: 0,
      Book: {} as BookModel
    } as PurchaseBookModel;
    if (this.formPurchaseBook) {
      this.formPurchaseBook.control.markAsUntouched();
      this.formPurchaseBook.control.markAsPristine();
    }
  }

  removeBook(index: number) {
    this.PurchaseBookList.splice(index, 1);
    this.calculateTotal(0);
  }

  PurchaseBook: PurchaseBookModel = { Book: {} as BookModel } as PurchaseBookModel;
  addPurchaseBook() {
    this.formPurchaseBook.control.markAllAsTouched();

    if (this.formPurchaseBook.invalid) {
      this.toastr.error(ConstantData.formInvalidMessage)
      return
    }
    this.PurchaseBookList.push(this.PurchaseBook);
    this.clearBook();
    this.calculateTotal(0);
  }

  changeStateCode() {
    this.PurchaseBookList.forEach(p1 => this.changeData(p1, 0));
    this.changeData(this.PurchaseBook, 0);
    this.calculateTotal(0);
  }

  changeData(purchaseBook: PurchaseBookModel, changeParam: number, isCalculateTotal: boolean = false) {
    if (changeParam == 1) {  //MRP
      if (purchaseBook.CostPrice == null || purchaseBook.CostPrice == 0)
        purchaseBook.CostPrice = purchaseBook.MRP;
      else
        return;
    }
    purchaseBook.BasicAmount = purchaseBook.Quantity * purchaseBook.CostPrice;
    if (changeParam == 2) {  //Discount Amount
      purchaseBook.DiscountPercentage = this.loadData.round(purchaseBook.DiscountAmount * 100 / purchaseBook.BasicAmount, 2);
    } else {
      purchaseBook.DiscountAmount = this.loadData.round(purchaseBook.BasicAmount * purchaseBook.DiscountPercentage / 100, 2);
    }
    this.calculateGST(purchaseBook);
    if (isCalculateTotal)
      this.calculateTotal(0);
  }

  calculateGST(purchaseBook: PurchaseBookModel) {
    purchaseBook.TotalAmount = purchaseBook.BasicAmount - purchaseBook.DiscountAmount - (purchaseBook.BillDiscountAmount ?? 0);
    if (purchaseBook.GSTValue > 0) {
      purchaseBook.GSTAmount = this.loadData.round(purchaseBook.TotalAmount * purchaseBook.GSTValue / (100 + purchaseBook.GSTValue), 2);
      if (this.Supplier.StateCode == ConstantData.stateCode || this.Supplier.StateCode == null) {
        purchaseBook.CGSTAmount = this.loadData.round(purchaseBook.GSTAmount / 2, 2);
        purchaseBook.SGSTAmount = this.loadData.round(purchaseBook.GSTAmount / 2, 2);
        purchaseBook.IGSTAmount = 0;
      } else {
        purchaseBook.IGSTAmount = purchaseBook.GSTAmount;
        purchaseBook.CGSTAmount = 0;
        purchaseBook.SGSTAmount = 0;
      }
    } else {
      purchaseBook.CGSTAmount = 0;
      purchaseBook.SGSTAmount = 0;
      purchaseBook.IGSTAmount = 0;
      purchaseBook.GSTAmount = 0;
    }
    purchaseBook.TaxableAmount = this.loadData.round(purchaseBook.TotalAmount - purchaseBook.GSTAmount, 2);
  }

  calculateTotal(changeParam: number) {
    this.Purchase.BasicAmount = 0;
    this.Purchase.ItemDiscountAmount = 0;
    this.Purchase.TaxableAmount = 0;
    this.Purchase.CGSTAmount = 0;
    this.Purchase.SGSTAmount = 0;
    this.Purchase.IGSTAmount = 0;
    this.Purchase.TotalAmount = 0;

    this.PurchaseBookList.forEach(p1 => this.Purchase.TotalAmount += p1.TotalAmount + (p1.BillDiscountAmount ?? 0));

    if (changeParam == 1) {  //Discount Percentage
      this.Purchase.BillDiscountAmount = this.loadData.round(this.Purchase.TotalAmount * this.Purchase.BillDiscountPercentage / 100, 2);
    } else {
      this.Purchase.BillDiscountPercentage = this.loadData.round((this.Purchase.BillDiscountAmount ?? 0) * 100 / this.Purchase.TotalAmount, 2);
    }

    if (this.Purchase.BillDiscountAmount > 0) {
      var BillDiscountAmount: number = this.Purchase.BillDiscountAmount;
      this.PurchaseBookList.forEach(p1 => {
        p1.BillDiscountAmount = this.loadData.round(p1.BasicAmount * this.Purchase.BillDiscountPercentage / 100, 2);
        BillDiscountAmount -= p1.BillDiscountAmount;
        this.calculateGST(p1);
      });

      if (BillDiscountAmount != 0) {
        var pm1 = this.PurchaseBookList.filter(p1 => p1.TotalAmount == Math.max.apply(Math, this.PurchaseBookList.map(x => x.TotalAmount)))[0];
        pm1.BillDiscountAmount += BillDiscountAmount;
        this.calculateGST(pm1);
      }
    }

    this.Purchase.TotalAmount = 0;
    this.PurchaseBookList.forEach(p1 => {
      this.Purchase.BasicAmount += p1.BasicAmount;
      this.Purchase.ItemDiscountAmount += p1.DiscountAmount;
      this.Purchase.TaxableAmount += p1.TaxableAmount;
      this.Purchase.CGSTAmount += p1.CGSTAmount;
      this.Purchase.SGSTAmount += p1.SGSTAmount;
      this.Purchase.IGSTAmount += p1.IGSTAmount;
      this.Purchase.TotalAmount += p1.TotalAmount;
    });

    this.Purchase.DiscountAmount = this.Purchase.ItemDiscountAmount + this.Purchase.BillDiscountAmount;
    // this.Purchase.TotalAmount = this.loadData.round(this.Purchase.TotalAmount, 2);
    this.Purchase.FinalAmount = this.loadData.round(this.Purchase.TotalAmount, 0);
    this.Purchase.PaidAmount = this.Purchase.FinalAmount;
    this.Purchase.DuesAmount = 0;
  }

  SupplierList: SupplierModel[] = [];
  AllSupplierList: SupplierModel[] = [];
  getSupplierList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Status: Status.Active, PurchaseFor: PurchaseFor.Library })).toString()
    }
    this.dataLoading = true
    this.stockService.getSupplierList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllSupplierList = response.SupplierList;
        this.AllSupplierList.map(x1 => x1.SearchSupplier = `${x1.SupplierName}  ${x1.MobileNo ?? ''}  ${x1.FullAddress ?? ''}`);
        this.SupplierList = this.AllSupplierList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  afterSupplierSelected(event: any) {
    this.Purchase.SupplierId = event.option.id;
    this.Supplier = this.SupplierList.find(x => x.SupplierId == this.Purchase.SupplierId)!;
  }

  filterSupplierList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.SupplierList = this.AllSupplierList.filter((option: any) => option.SearchSupplier.toLowerCase().includes(filterValue));
    } else {
      this.SupplierList = this.AllSupplierList;
    }
    this.Purchase.SupplierId = 0;
  }
  clearSupplier() {
    this.SupplierList = this.AllSupplierList;
    this.Purchase.SupplierId = 0;
    this.Supplier = { StateCode: ConstantData.stateCode, Status: Status.Active } as SupplierModel;
  }
  
  savePurchaseBook() {
    this.formPurchase.control.markAllAsTouched();
    this.formSupplier.control.markAllAsTouched();

    if (this.formPurchase.invalid || this.formSupplier.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    if (this.PurchaseBookList.length == 0) {
      this.toastr.error("No any book is selected !!")
      return
    }
    this.Purchase.PurchaseDate = this.loadData.loadDateTime(this.Purchase.PurchaseDate);
    if (this.Purchase.PurchaseId > 0)
      this.Purchase.UpdatedBy = this.staffLogin.StaffLoginId;
    else
      this.Purchase.CreatedBy = this.staffLogin.StaffLoginId;
    this.Purchase.Supplier = this.Supplier;
    this.Purchase.PurchaseBooks = this.PurchaseBookList
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Purchase)).toString()
    }
    this.dataLoading = true;
    this.libraryService.savePurchaseBook(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Purchase.PurchaseId > 0) {
          this.toastr.success(ConstantData.updateMessage);
          history.back();
        } else {
          this.toastr.success(ConstantData.submitMessage);
          if (this.Purchase.SupplierId > 0) {
            this.SupplierList = this.AllSupplierList;
          } else {
            this.getSupplierList();
          }
        }
        this.resetForm()
      } else {
        this.toastr.error(response.Message);
        this.Purchase.PurchaseDate = new Date(this.Purchase.PurchaseDate);
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.Purchase.PurchaseDate = new Date(this.Purchase.PurchaseDate);
      this.dataLoading = false;
    }))
  }
}

