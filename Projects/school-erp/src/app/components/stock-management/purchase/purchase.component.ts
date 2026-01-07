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
import { PurchaseProductModel } from '../../../interfaces/purchase-product-model';
import { StockService } from '../../../services/stock.service';
import { SupplierModel } from '../../../interfaces/supplier-model';
import { ProductModel } from '../../../interfaces/product-model';
import { UnitModel } from '../../../interfaces/unit-model';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent {
  dataLoading: boolean = false
  Purchase: PurchaseModel = {} as PurchaseModel;
  PurchaseProductList: PurchaseProductModel[] = [];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  Supplier: SupplierModel = {} as SupplierModel;
  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private stockService: StockService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.resetForm();
    this.getSupplierList();
    this.getUnitList();
    this.route.paramMap.subscribe((params1: any) => {
      var purchaseId = params1.get('id');
      if (purchaseId) {
        var obj: RequestModel = {
          request: this.loadData.restoreSpecialCharacter(purchaseId)
        }
        this.dataLoading = true
        this.stockService.getPurchaseDetail(obj).subscribe(r1 => {
          let response = r1 as any
          if (response.Message == ConstantData.SuccessMessage) {
            this.Supplier = response.Supplier;
            this.Purchase = response.Purchase;
            this.PurchaseProductList = response.PurchaseProductList;
            this.PurchaseProductList.forEach(x => {
              x.Product.SearchProduct = `${x.Product.ProductName} ${x.HSNCode ?? ''} ${x.Product.ManufacturerName ?? ''}`;
              if (x.ManufacturedDate != null)
                x.ManufacturedDate = this.loadData.loadDateYMD(x.ManufacturedDate);
              if (x.ExpiredDate != null)
                x.ExpiredDate = this.loadData.loadDateYMD(x.ExpiredDate);
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
      request: this.localService.encrypt(JSON.stringify({ Url: '/admin/purchase', StaffLoginId: this.staffLogin.StaffLoginId })).toString()
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
  @ViewChild('formPurchaseProduct') formPurchaseProduct: NgForm;
  resetForm() {
    this.Purchase = {
      PurchaseDate: new Date(),
      BillDiscountPercentage: 0,
      BillDiscountAmount: 0,
    } as PurchaseModel;
    this.Supplier = { StateCode: ConstantData.stateCode, Status: Status.Active } as SupplierModel;
    this.PurchaseProductList = [];
    if (this.formPurchase) {
      this.formPurchase.control.markAsPristine();
      this.formPurchase.control.markAsUntouched();
    }
    if (this.formSupplier) {
      this.formSupplier.control.markAsPristine();
      this.formSupplier.control.markAsUntouched();
    }
    this.AllProductList = [];
    this.getProductList();
  }

  ProductList: ProductModel[] = [];
  AllProductList: ProductModel[] = [];
  getProductList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Status: Status.Active })).toString()
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
    this.PurchaseProduct.ProductId = event.option.id;
    var product = this.AllProductList.filter(x => x.ProductId == this.PurchaseProduct.ProductId)[0];
    this.PurchaseProduct.HSNCode = product.HSNCode;
    this.PurchaseProduct.UnitId = product.UnitId;
    this.PurchaseProduct.MRP = product.MRP;
    this.PurchaseProduct.GSTValue = product.GSTValue;
    this.changeData(this.PurchaseProduct, 1, false);
  }

  filterProductList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.ProductList = this.AllProductList.filter((option: any) => option.SearchProduct.toLowerCase().includes(filterValue));
    } else {
      this.ProductList = this.AllProductList;
    }
    this.PurchaseProduct.ProductId = 0;
    this.PurchaseProduct.Product.ProductName = value;
  }

  clearProduct() {
    this.ProductList = this.AllProductList;
    this.PurchaseProduct = {
      GSTValue: 12,
      Quantity: 1,
      FreeQunatity: 0,
      DiscountPercentage: 0,
      DiscountAmount: 0,
      Product: {} as ProductModel
    } as PurchaseProductModel;
    if (this.formPurchaseProduct) {
      this.formPurchaseProduct.control.markAsUntouched();
      this.formPurchaseProduct.control.markAsPristine();
    }
  }

  removeProduct(index: number) {
    this.PurchaseProductList.splice(index, 1);
    this.calculateTotal(0);
  }

  PurchaseProduct: PurchaseProductModel = { Product: {} as ProductModel } as PurchaseProductModel;
  addPurchaseProduct() {
    this.formPurchaseProduct.control.markAllAsTouched();

    if (this.formPurchaseProduct.invalid) {
      this.toastr.error(ConstantData.formInvalidMessage)
      return
    }

    this.PurchaseProduct.ExpiredDate = this.loadData.loadDateYMD(this.PurchaseProduct.ExpiredDate);
    this.PurchaseProduct.ManufacturedDate = this.loadData.loadDateYMD(this.PurchaseProduct.ManufacturedDate);
    this.PurchaseProductList.push(this.PurchaseProduct);
    this.clearProduct();
    this.calculateTotal(0);
  }

  changeStateCode() {
    this.PurchaseProductList.forEach(p1 => this.changeData(p1, 0));
    this.changeData(this.PurchaseProduct, 0);
    this.calculateTotal(0);
  }

  changeData(purchaseProduct: PurchaseProductModel, changeParam: number, isCalculateTotal: boolean = false) {
    if (changeParam == 1) {  //MRP
      if (purchaseProduct.CostPrice == null || purchaseProduct.CostPrice == 0)
        purchaseProduct.CostPrice = purchaseProduct.MRP;
      else
        return;
    }
    purchaseProduct.BasicAmount = purchaseProduct.Quantity * purchaseProduct.CostPrice;
    if (changeParam == 2) {  //Discount Amount
      purchaseProduct.DiscountPercentage = this.loadData.round(purchaseProduct.DiscountAmount * 100 / purchaseProduct.BasicAmount, 2);
    } else {
      purchaseProduct.DiscountAmount = this.loadData.round(purchaseProduct.BasicAmount * purchaseProduct.DiscountPercentage / 100, 2);
    }
    this.calculateGST(purchaseProduct);
    if (isCalculateTotal)
      this.calculateTotal(0);
  }

  calculateGST(purchaseProduct: PurchaseProductModel) {
    purchaseProduct.TotalAmount = purchaseProduct.BasicAmount - purchaseProduct.DiscountAmount - (purchaseProduct.BillDiscountAmount ?? 0);
    if (purchaseProduct.GSTValue > 0) {
      purchaseProduct.GSTAmount = this.loadData.round(purchaseProduct.TotalAmount * purchaseProduct.GSTValue / (100 + purchaseProduct.GSTValue), 2);
      if (this.Supplier.StateCode == ConstantData.stateCode || this.Supplier.StateCode == null) {
        purchaseProduct.CGSTAmount = this.loadData.round(purchaseProduct.GSTAmount / 2, 2);
        purchaseProduct.SGSTAmount = this.loadData.round(purchaseProduct.GSTAmount / 2, 2);
        purchaseProduct.IGSTAmount = 0;
      } else {
        purchaseProduct.IGSTAmount = purchaseProduct.GSTAmount;
        purchaseProduct.CGSTAmount = 0;
        purchaseProduct.SGSTAmount = 0;
      }
    } else {
      purchaseProduct.CGSTAmount = 0;
      purchaseProduct.SGSTAmount = 0;
      purchaseProduct.IGSTAmount = 0;
      purchaseProduct.GSTAmount = 0;
    }
    purchaseProduct.TaxableAmount = this.loadData.round(purchaseProduct.TotalAmount - purchaseProduct.GSTAmount, 2);
  }

  calculateTotal(changeParam: number) {
    this.Purchase.BasicAmount = 0;
    this.Purchase.ItemDiscountAmount = 0;
    this.Purchase.TaxableAmount = 0;
    this.Purchase.CGSTAmount = 0;
    this.Purchase.SGSTAmount = 0;
    this.Purchase.IGSTAmount = 0;
    this.Purchase.TotalAmount = 0;

    this.PurchaseProductList.forEach(p1 => this.Purchase.TotalAmount += p1.TotalAmount + (p1.BillDiscountAmount ?? 0));

    if (changeParam == 1) {  //Discount Percentage
      this.Purchase.BillDiscountAmount = this.loadData.round(this.Purchase.TotalAmount * this.Purchase.BillDiscountPercentage / 100, 2);
    } else {
      this.Purchase.BillDiscountPercentage = this.loadData.round((this.Purchase.BillDiscountAmount ?? 0) * 100 / this.Purchase.TotalAmount, 2);
    }

    if (this.Purchase.BillDiscountAmount > 0) {
      var BillDiscountAmount: number = this.Purchase.BillDiscountAmount;
      this.PurchaseProductList.forEach(p1 => {
        p1.BillDiscountAmount = this.loadData.round(p1.BasicAmount * this.Purchase.BillDiscountPercentage / 100, 2);
        BillDiscountAmount -= p1.BillDiscountAmount;
        this.calculateGST(p1);
      });

      if (BillDiscountAmount != 0) {
        var pm1 = this.PurchaseProductList.filter(p1 => p1.TotalAmount == Math.max.apply(Math, this.PurchaseProductList.map(x => x.TotalAmount)))[0];
        pm1.BillDiscountAmount += BillDiscountAmount;
        this.calculateGST(pm1);
      }
    }

    this.Purchase.TotalAmount = 0;
    this.PurchaseProductList.forEach(p1 => {
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



  UnitList: UnitModel[] = [];
  getUnitList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Status: Status.Active })).toString()
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
      this.dataLoading = false;
    }))
  }

  SupplierList: SupplierModel[] = [];
  AllSupplierList: SupplierModel[] = [];
  getSupplierList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Status: Status.Active, PurchaseFor: PurchaseFor.Store })).toString()
    }
    this.dataLoading = true
    this.stockService.getSupplierList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllSupplierList = response.SupplierList;
        this.AllSupplierList.map(x1 => x1.SearchSupplier = `${x1.SupplierName} - ${x1.MobileNo}`);
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




  savePurchase() {
    this.formPurchase.control.markAllAsTouched();
    this.formSupplier.control.markAllAsTouched();


    if (this.formPurchase.invalid || this.formSupplier.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    if (this.PurchaseProductList.length == 0) {
      this.toastr.error("No any product is selected !!")
      return
    }
    this.Purchase.PurchaseDate = this.loadData.loadDateTime(this.Purchase.PurchaseDate);
    if (this.Purchase.PurchaseId > 0)
      this.Purchase.UpdatedBy = this.staffLogin.StaffLoginId;
    else
      this.Purchase.CreatedBy = this.staffLogin.StaffLoginId;


    this.Purchase.Supplier = this.Supplier;
    this.Purchase.PurchaseProducts = this.PurchaseProductList

    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Purchase)).toString()
    }
    this.dataLoading = true;
    this.stockService.savePurchase(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Purchase.PurchaseId > 0) {
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
