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
import { StockService } from '../../../services/stock.service';
import { UnitModel } from '../../../interfaces/unit-model';
import { ProductModel } from '../../../interfaces/product-model';
import { ManufacturerModel } from '../../../interfaces/manufaturere-model';
declare var $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  dataLoading: boolean = false
  ProductList: ProductModel[] = []
  Product: ProductModel = {} as ProductModel
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
    this.getManufacturerList();
    this.getUnitList();
    this.getProductList();
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
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  @ViewChild('formProduct') formProduct: NgForm;
  resetForm() {
    this.Product = {
      Status: Status.Active,
      MRP: 0,
      GSTValue: 0
    } as ProductModel;
    if (this.formProduct) {
      this.formProduct.control.markAsPristine();
      this.formProduct.control.markAsUntouched();
    }
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p
  }

  UnitList: UnitModel[] = [];
  getUnitList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.stockService.getUnitList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.UnitList = response.UnitList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  ManufacturerList: ManufacturerModel[] = [];
  AllManufacturerList: ManufacturerModel[] = [];
  getManufacturerList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.stockService.getManufacturerList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllManufacturerList = response.ManufacturerList;
        this.ManufacturerList = this.AllManufacturerList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  afterManufacturerSelected(event: any) {
    this.Product.ManufacturerId = event.option.id;
  }

  filterManufacturerList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.ManufacturerList = this.AllManufacturerList.filter((option: any) => option.SearchManufacturer.toLowerCase().includes(filterValue));
    } else {
      this.ManufacturerList = this.AllManufacturerList;
    }
    this.Product.ManufacturerId = null;
  }
  clearManufacturer() {
    this.ManufacturerList = this.AllManufacturerList;
    this.Product.ManufacturerId = null;
    this.Product.ManufacturerName = null;
  }


  getProductList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.stockService.getProductList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.ProductList = response.ProductList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  saveProduct() {
    this.formProduct.control.markAllAsTouched();
    if (this.formProduct.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    if (this.Product.ProductId > 0)
      this.Product.UpdatedBy = this.staffLogin.StaffLoginId;
    else
      this.Product.CreatedBy = this.staffLogin.StaffLoginId;

    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Product)).toString()
    }
    this.dataLoading = true;
    this.stockService.saveProduct(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Product.ProductId > 0) {
          this.toastr.success("Product detail updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("Product added successfully")
        }
        this.resetForm()
        this.getProductList();
        this.getManufacturerList();
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteProduct(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true
      this.stockService.deleteProduct(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getProductList()
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

  editProduct(obj: any) {
    this.resetForm()
    this.Product = obj
    $('#staticBackdrop').modal('show');
  }

  newProduct() {
    this.resetForm()
    $('#staticBackdrop').modal('show');
  }
}
