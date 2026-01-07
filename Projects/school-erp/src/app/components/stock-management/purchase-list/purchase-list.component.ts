import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { PaymentMode, PaymentStatus, PurchaseFor } from '../../../utils/enum';
import { ActionModel, FilterModel, ReportModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { Router } from '@angular/router';
import { PurchaseModel } from '../../../interfaces/purchase-model';
import { StockService } from '../../../services/stock.service';
import { PurchaseProductModel } from '../../../interfaces/purchase-product-model';
import { SupplierModel } from '../../../interfaces/supplier-model';
declare var $: any;

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.css']
})
export class PurchaseListComponent {
  dataLoading: boolean = false
  PurchaseList: PurchaseModel[] = []
  FilterModel: FilterModel = {
    FromDate: this.loadData.loadFirstDate(),
    ToDate: this.loadData.loadDateYMD(new Date()),
  } as FilterModel;
  Purchase: PurchaseModel = {} as PurchaseModel;
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
    private stockService: StockService,
    private localService: LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getPurchaseList();
    this.getSupplierList();
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

  editPurchase(obj: any) {
    this.router.navigate([`/admin/purchase/${this.loadData.replaceSpecialCharacter(this.localService.encrypt(obj.PurchaseId))}`])
  }

  reportModel: ReportModel = {} as ReportModel;
  getPurchase(id: number, isPrint: boolean, docType: number) {
    this.reportModel.IsPrint = isPrint;
    this.reportModel.id = id;
    this.reportModel.DocType = docType;
    $('#headerConfirmation').modal('show');
  }

  printRecord() {
    // this.service.printPurchase(this.loadData.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(this.reportModel)).toString()));
    // $('#headerConfirmation').modal('hide');
  }

  @ViewChild('table_1') table_1: ElementRef;
  isExporting: boolean = false;
  exportToExcel() {
    this.isExporting = true;
    var itemPerPage = this.itemPerPage;
    var p = this.p;
    this.p = 1;
    this.itemPerPage = this.PurchaseList.length;
    setTimeout(() => {
      this.loadData.exportToExcel(this.table_1, "Purchase List " + this.loadData.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
    }, 1000);
  }

  SupplierList: SupplierModel[] = [];
  AllSupplierList: SupplierModel[] = [];
  getSupplierList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ PurchaseFor: PurchaseFor.Store })).toString()
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
    this.FilterModel.SupplierId = event.option.id;
    this.getPurchaseList();
  }

  filterSupplierList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.SupplierList = this.AllSupplierList.filter((option: any) => option.SearchSupplier.toLowerCase().includes(filterValue));
    } else {
      this.SupplierList = this.AllSupplierList;
    }
    this.FilterModel.SupplierId = 0;
  }
  clearSupplier() {
    this.SupplierList = this.AllSupplierList;
    this.FilterModel.SupplierId = 0;
    this.FilterModel.SearchSupplier = "";
  }

  getPurchaseList() {
    this.PurchaseList = [];
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({
        FromDate: this.loadData.loadDateYMD(this.FilterModel.FromDate),
        ToDate: this.loadData.loadDateYMD(this.FilterModel.ToDate),
        PurchaseFor: PurchaseFor.Store,
        SupplierId:this.FilterModel.SupplierId
      })).toString()
    }
    this.dataLoading = true
    this.stockService.getPurchaseList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.PurchaseList = response.PurchaseList;
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
    this.Purchase.BasicAmount = 0;
    this.Purchase.DiscountAmount = 0;
    this.Purchase.TaxableAmount = 0;
    this.Purchase.CGSTAmount = 0;
    this.Purchase.SGSTAmount = 0;
    this.Purchase.IGSTAmount = 0;
    this.Purchase.FinalAmount = 0;
    this.Purchase.PaidAmount = 0;
    this.Purchase.DuesAmount = 0;

    this.PurchaseList.forEach(p1 => {
      this.Purchase.BasicAmount += p1.BasicAmount;
      this.Purchase.DiscountAmount += p1.DiscountAmount;
      this.Purchase.TaxableAmount += p1.TaxableAmount;
      this.Purchase.CGSTAmount += p1.CGSTAmount;
      this.Purchase.SGSTAmount += p1.SGSTAmount;
      this.Purchase.IGSTAmount += p1.IGSTAmount;
      this.Purchase.FinalAmount += p1.FinalAmount;
      this.Purchase.PaidAmount += p1.PaidAmount;
      this.Purchase.DuesAmount += p1.DuesAmount;
    });
  }

  PurchaseProductList: PurchaseProductModel[] = [];
  SelectedPurchase: PurchaseModel = {} as PurchaseModel;
  Supplier: SupplierModel = {} as SupplierModel;
  getPurchaseDetail(purchase: PurchaseModel) {
    var obj: RequestModel = {
      request: this.localService.encrypt(purchase.PurchaseId.toString()).toString()
    }
    this.dataLoading = true
    this.stockService.getPurchaseDetail(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.PurchaseProductList = response.PurchaseProductList;
        this.SelectedPurchase = response.Purchase;
        this.Supplier = response.Supplier;
        this.SelectedPurchase.Quantity = 0;
        this.SelectedPurchase.FreeQunatity = 0;
        this.PurchaseProductList.forEach(p1 => {
          this.SelectedPurchase.Quantity += p1.Quantity;
          this.SelectedPurchase.FreeQunatity += p1.FreeQunatity;
        })
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

  deletePurchase(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true
      this.stockService.deletePurchase(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully");
          this.PurchaseList = this.PurchaseList.filter(x => x.PurchaseId != obj.PurchaseId);
          //this.getPurchaseList()
        } else {
          this.toastr.error(response.Message)
        }
        this.dataLoading = false
      }, (err => {
        this.toastr.error("Error occured while deleteing the recored")
        this.dataLoading = false
      }))
    }
  }


}
