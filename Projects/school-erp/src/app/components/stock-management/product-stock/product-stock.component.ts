import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { ActionModel, FilterModel, ReportModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { Router } from '@angular/router';
import { ProductStockModel } from '../../../interfaces/product-stock-model';
import { StockService } from '../../../services/stock.service';
declare var $: any;

@Component({
  selector: 'app-product-stock',
  templateUrl: './product-stock.component.html',
  styleUrls: ['./product-stock.component.css']
})
export class ProductStockComponent {
  dataLoading: boolean = false
  ProductStockList: ProductStockModel[] = []
  FilterModel: FilterModel = {} as FilterModel;
  ProductStock: ProductStockModel = {} as ProductStockModel;
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private stockService:StockService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getProductStockList();
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

  editProductStock(obj: any) {
    this.router.navigate([`/admin/productstock/${this.loadData.replaceSpecialCharacter(this.localService.encrypt(obj.ProductStockId))}`])
  }

  reportModel: ReportModel = {} as ReportModel;
  getProductStock(id: number, isPrint: boolean, docType: number) {
    this.reportModel.IsPrint = isPrint;
    this.reportModel.id = id;
    this.reportModel.DocType = docType;
    $('#headerConfirmation').modal('show');
  }

  printRecord() {
    // this.service.printProductStock(this.loadData.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(this.reportModel)).toString()));
    // $('#headerConfirmation').modal('hide');
  }

  @ViewChild('table_1') table_1: ElementRef;
  isExporting: boolean = false;
  exportToExcel() {
    this.isExporting = true;
    var itemPerPage = this.itemPerPage;
    var p = this.p;
    this.p = 1;
    this.itemPerPage = this.ProductStockList.length;
    setTimeout(() => {
      this.loadData.exportToExcel(this.table_1, "Product Stock List " + this.loadData.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
    }, 1000);
  }

  getProductStockList() {
    this.ProductStockList = [];
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.stockService.getProductStockList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.ProductStockList = response.ProductStockList;
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
    this.ProductStock.AvailableQuantity = 0;
    this.ProductStock.UnitValue = 0;
    this.ProductStock.PieceValue = 0;
    this.ProductStockList.forEach(p1 => {
      this.ProductStock.AvailableQuantity += p1.AvailableQuantity;
      this.ProductStock.UnitValue += p1.UnitValue;
      this.ProductStock.PieceValue += p1.PieceValue;
    });
  }

}
