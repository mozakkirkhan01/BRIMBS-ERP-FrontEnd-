import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { Status, TakenBy } from '../../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IssueModel } from '../../../interfaces/issue-model';
import { IssueProductModel } from '../../../interfaces/issue-product-model';
import { StockService } from '../../../services/stock.service';
import { ProductStockModel } from '../../../interfaces/product-stock-model';
import { ProductModel } from '../../../interfaces/product-model';
import { StaffModel } from '../../../interfaces/staff-model';
import { UnitModel } from '../../../interfaces/unit-model';
import { PupilModel } from '../../../interfaces/pupil-model';

@Component({
  selector: 'app-product-issue',
  templateUrl: './product-issue.component.html',
  styleUrls: ['./product-issue.component.css']

})
export class ProductIssueComponent {
  dataLoading: boolean = false
  Issue: IssueModel = {} as IssueModel;
  IssueProductList: IssueProductModel[] = [];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  Staff: StaffModel = {} as StaffModel;
  Pupil: PupilModel = {} as PupilModel;
  TakenByList = this.loadData.GetEnumList(TakenBy);
  recordPupil=ConstantData.recordPupil;
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
    this.getStaffList();
    this.getUnitList();
    this.route.paramMap.subscribe((params1: any) => {
      var issueId = params1.get('id');
      if (issueId) {
        var obj: RequestModel = {
          request: this.loadData.restoreSpecialCharacter(issueId)
        }
        this.dataLoading = true
        this.stockService.getIssueDetail(obj).subscribe(r1 => {
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
            this.IssueProductList = response.IssueProductList;
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
      request: this.localService.encrypt(JSON.stringify({ Url: '/admin/product-issue', StaffLoginId: this.staffLogin.StaffLoginId })).toString()
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
  @ViewChild('formIssue') formIssue: NgForm;
  @ViewChild('formStaff') formStaff: NgForm;
  @ViewChild('formIssueProduct') formIssueProduct: NgForm;
  resetForm() {
    this.Issue = {
      IssueDate: new Date(),
      TakenBy: this.Issue.TakenBy ?? TakenBy.Staff
    } as IssueModel;
    this.changeTakenBy();
    this.IssueProductList = [];
    if (this.formIssue) {
      this.formIssue.control.markAsPristine();
      this.formIssue.control.markAsUntouched();
    }
    if (this.formStaff) {
      this.formStaff.control.markAsPristine();
      this.formStaff.control.markAsUntouched();
    }
    this.AllProductList = [];
    this.getProductStockList();
  }

  ProductList: ProductStockModel[] = [];
  AllProductList: ProductStockModel[] = [];
  ProductStockList: ProductStockModel[] = [];
  AllProductStockList: ProductStockModel[] = [];

  getProductStockList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Status: Status.Active })).toString()
    }
    this.dataLoading = true
    this.stockService.getProductStockList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllProductStockList = response.ProductStockList;
        this.AllProductStockList.forEach(p1 => {
          if (this.AllProductList.filter(x => x.ProductId == p1.ProductId).length == 0) {
            this.AllProductList.push(p1);
          }
        });
        this.loadData
        this.AllProductList.map(x => x.Product.SearchProduct = `${x.Product.ProductName} ${x.Product.HSNCode ?? ''} ${x.Product.ManufacturerName ?? ''}`);
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

  selectedStock: ProductStockModel = {} as ProductStockModel;
  afterProductSelected(event: any) {
    if (this.IssueProduct.Product == null)
      this.IssueProduct.Product = {} as ProductModel;
    this.IssueProduct.Product.ProductId = event.option.id;
    var product = this.AllProductList.filter(x => x.ProductId == this.IssueProduct.Product?.ProductId)[0];
    this.IssueProduct.Product.HSNCode = product.Product.HSNCode;
    this.IssueProduct.UnitId = product.UnitId;
    this.IssueProduct.Product.MRP = product.MRP;
    this.ProductStockList = this.AllProductStockList.filter(x => x.ProductId == this.IssueProduct.Product?.ProductId);
    if (this.ProductStockList.length == 1) {
      this.selectedStock = this.ProductStockList[0];
      this.IssueProduct.UnitId = this.selectedStock.UnitId;
      this.IssueProduct.ProductStockId = this.selectedStock.ProductStockId;
    }
  }

  changeProductStock() {
    this.selectedStock = this.ProductStockList.filter(x => x.ProductStockId == this.IssueProduct.ProductStockId)[0];
    this.IssueProduct.UnitId = this.selectedStock.UnitId;
  }

  filterProductList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.ProductList = this.AllProductList.filter((option: any) => option.SearchProduct.toLowerCase().includes(filterValue));
    } else {
      this.ProductList = this.AllProductList;
    }
    this.IssueProduct.Product.ProductId = 0;
  }

  clearProduct() {
    this.ProductList = this.AllProductList;
    this.ProductStockList = [];
    this.selectedStock = {} as ProductStockModel;
    this.IssueProduct = {
      Quantity: 1,
      Product: {} as ProductModel
    } as IssueProductModel;
    if (this.formIssueProduct) {
      this.formIssueProduct.control.markAsUntouched();
      this.formIssueProduct.control.markAsPristine();
    }
  }

  removeProduct(index: number, issueProduct: IssueProductModel) {
    var selectedStock = this.AllProductStockList.filter(x => x.ProductStockId == issueProduct.ProductStockId)[0];
    selectedStock.AvailableQuantity += issueProduct.Quantity * issueProduct.UnitValue;
    var stockUnitValue = this.UnitList.filter(x => x.UnitId == selectedStock.UnitId)[0].Value;
    selectedStock.UnitValue = Math.floor(selectedStock.AvailableQuantity / stockUnitValue);
    selectedStock.PieceValue = selectedStock.AvailableQuantity % stockUnitValue;

    this.IssueProductList.splice(index, 1);
    this.calculateTotal(0);
  }

  IssueProduct: IssueProductModel = { Product: {} as ProductModel } as IssueProductModel;
  addIssueProduct() {
    this.formIssueProduct.control.markAllAsTouched();
    if (this.formIssueProduct.invalid) {
      this.toastr.error(ConstantData.formInvalidMessage)
      return
    }

    //validations
    var selectedUnit: any = this.UnitList.filter(x => x.UnitId == this.IssueProduct.UnitId)[0];
    this.IssueProduct.UnitValue = selectedUnit.Value;
    var decreaseQuantity = this.IssueProduct.Quantity * this.IssueProduct.UnitValue;
    if (decreaseQuantity > this.selectedStock.AvailableQuantity) {
      this.toastr.error("Quantity should not be more than available quantity !!");
      return;
    }

    this.selectedStock.AvailableQuantity -= decreaseQuantity;
    var stockUnitValue = this.UnitList.filter(x => x.UnitId == this.selectedStock.UnitId)[0].Value;
    this.selectedStock.UnitValue = Math.floor(this.selectedStock.AvailableQuantity / stockUnitValue);
    this.selectedStock.PieceValue = this.selectedStock.AvailableQuantity % stockUnitValue;

    this.IssueProduct.Product.ProductName = this.selectedStock.Product.ProductName;
    this.IssueProduct.Product.ManufacturerName = this.selectedStock.Product.ManufacturerName;
    this.IssueProduct.Product.ExpiredDate = this.selectedStock.Product.ExpiredDate;
    this.IssueProduct.Product.UnitName = selectedUnit.UnitName;

    this.IssueProductList.push(this.IssueProduct);
    if (this.ProductStockList.length > 1) {
      this.IssueProduct.Quantity = 1;
    } else
      this.clearProduct();
    this.calculateTotal(0);
  }


  calculateTotal(changeParam: number) {
    this.Issue.TotalProducts = 0;
    this.Issue.Quantity = this.IssueProductList.length;
    this.IssueProductList.forEach(p1 => this.Issue.Quantity += p1.Quantity);
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

  changeTakenBy() {
    this.clearPupil();
    this.clearStaff();
    if(this.AllPupilList.length == 0){
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
    this.Issue.PupilId= null;
  }

  filterStaffList(value: any) {
    if (value) {
      const filterValue = value.toLowerCase();
      this.StaffList = this.AllStaffList.filter((option: any) => option.SearchStaff.toLowerCase().includes(filterValue));
    } else {
      this.StaffList = this.AllStaffList;
    }
    this.Issue.StaffId = null;
    this.Issue.PupilId= null;
  }
  clearStaff() {
    this.StaffList = this.AllStaffList;
    this.Issue.StaffId = null;
    this.Staff = {} as StaffModel;
    this.Issue.PupilId= null;
  }

  saveIssue() {
    this.formIssue.control.markAllAsTouched();
    this.formStaff.control.markAllAsTouched();

    if (this.formIssue.invalid || this.formStaff.invalid) {
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

    if (this.IssueProductList.length == 0) {
      this.toastr.error("No any product is selected !!")
      return
    }
    this.Issue.IssueDate = this.loadData.loadDateTime(this.Issue.IssueDate);
    this.Issue.TotalProducts = this.IssueProductList.length;
    if (this.Issue.IssueId > 0)
      this.Issue.UpdatedBy = this.staffLogin.StaffLoginId;
    else
      this.Issue.CreatedBy = this.staffLogin.StaffLoginId;
    this.Issue.IssueProducts = this.IssueProductList;

    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Issue)).toString()
    }
    this.dataLoading = true;
    this.stockService.saveIssue(obj).subscribe(r1 => {
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
