import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ProductHistoryType } from '../../../utils/enum';
import { ProductHistoryModel } from '../../../interfaces/product-history-model';
import { StockService } from '../../../services/stock.service';

@Component({
  selector: 'app-Product-history',
  templateUrl: './Product-history.component.html',
  styleUrls: ['./Product-history.component.css']
})
export class ProductHistoryComponent {
  dataLoading: boolean = false
  ProductHistory: ProductHistoryModel[] = []
  FilterModel: any = {
    // FromDate: new Date(),
    // ToDate: new Date(),
  };
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  AllProductHistoryType = ProductHistoryType;

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private stockService: StockService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getProductList();
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

  editProductHistoryModel(obj: any) {
    this.router.navigate([`/admin/Producthistorymodel/${this.loadData.replaceSpecialCharacter(this.localService.encrypt(obj.ProductHistoryModelId))}`])
  }

  @ViewChild('form1') form1: NgForm;
  Product: any = {};
  ProductList: any[] = [];
  AllProductList: any[] = [];
  getProductList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.stockService.getProductList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllProductList = response.ProductList;
        this.AllProductList.map(x => x.SearchProduct = `${x.ProductName} ${x.HSNCode ?? ''} ${x.ManufacturerName ?? ''}`);
        this.clearProduct();
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  afterProductSelected(event: any) {
    this.FilterModel.Id = event.option.id;
    this.Product = this.AllProductList.filter(x => x.ProductId == this.FilterModel.Id)[0];
  }

  filterProductList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.ProductList = this.AllProductList.filter((option: any) => option.SearchProduct.toLowerCase().includes(filterValue));
    } else {
      this.ProductList = this.AllProductList;
    }
    this.FilterModel.Id = null;
    this.Product = {};
    this.ProductHistory = [];
  }

  clearProduct() {
    this.ProductList = this.AllProductList;
    this.Product = {};
    this.FilterModel.Id = null;
    this.ProductHistory = [];

    if (this.form1) {
      this.form1.control.markAsUntouched();
      this.form1.control.markAsPristine();
    }
  }

  @ViewChild('table_1') table_1: ElementRef;
  isExporting: boolean = false;
  exportToExcel() {
    this.isExporting = true;
    var itemPerPage = this.itemPerPage;
    var p = this.p;
    this.p = 1;
    this.itemPerPage = this.ProductHistory.length;
    setTimeout(() => {
      this.loadData.exportToExcel(this.table_1, "Product History" + this.loadData.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
    }, 1000);
  }

  getProductHistory() {
    this.form1.control.markAllAsTouched();
    if (this.form1.invalid) {
      this.toastr.error(ConstantData.formInvalidMessage);
      return;
    }
    if (this.FilterModel.Id == null) {
      this.toastr.error("Selected Product is invalid !!");
      return;
    }
    this.ProductHistory = [];
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({
        Id: this.FilterModel.Id,
        FromDate: this.loadData.loadDateYMD(this.FilterModel.FromDate),
        ToDate: this.loadData.loadDateYMD(this.FilterModel.FromDate)
      })).toString()
    }
    this.dataLoading = true
    this.stockService.getProductHistory(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.ProductHistory = response.ProductHistory;
        this.calculateTotal();
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  calculateTotal() {
    this.Product.PurchaseQuantity = 0;
    this.Product.IssueQuantity = 0;
    this.ProductHistory.forEach(p1 => {
      if (p1.ProductHistoryType == ProductHistoryType.Purchase)
        this.Product.PurchaseQuantity += p1.Quantity;
      else
        this.Product.IssueQuantity += p1.Quantity;
    });
  }

}
