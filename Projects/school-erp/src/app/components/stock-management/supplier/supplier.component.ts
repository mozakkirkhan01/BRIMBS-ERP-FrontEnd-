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
import { SupplierModel } from '../../../interfaces/supplier-model';
import { StockService } from '../../../services/stock.service';
declare var $: any;

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent {
  dataLoading: boolean = false
  SupplierList: SupplierModel[] = []
  Supplier: SupplierModel = {} as SupplierModel;
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
  purchaseFor: number = 0;
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
    this.route.paramMap.subscribe((params1: any) => {
      this.purchaseFor = params1.get('id');
      this.getSupplierList();
    });
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

  @ViewChild('formSupplier') formSupplier: NgForm;
  resetForm() {
    this.Supplier = { Status: Status.Active } as SupplierModel;
    if (this.formSupplier) {
      this.formSupplier.control.markAsPristine();
      this.formSupplier.control.markAsUntouched();
    }
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p
  }

  getSupplierList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ PurchaseFor: this.purchaseFor } as SupplierModel)).toString()
    }
    this.dataLoading = true
    this.stockService.getSupplierList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.SupplierList = response.SupplierList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error(ConstantData.serverMessage)
      this.dataLoading = false;
    }))
  }

  saveSupplier() {
    this.formSupplier.control.markAllAsTouched();
    if (this.formSupplier.invalid) {
      this.toastr.error(ConstantData.formInvalidMessage)
      return
    }
    if (this.Supplier.SupplierId)
      this.Supplier.UpdatedBy = this.staffLogin.StaffLoginId;
    else
      this.Supplier.CreatedBy = this.staffLogin.StaffLoginId;
    this.Supplier.PurchaseFor = this.purchaseFor;

    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Supplier)).toString()
    }
    this.dataLoading = true;
    this.stockService.saveSupplier(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Supplier.SupplierId > 0) {
          this.toastr.success(ConstantData.updateMessage)
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success(ConstantData.submitMessage)
        }
        this.resetForm()
        this.getSupplierList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error(ConstantData.serverMessage)
      this.dataLoading = false;
    }))
  }

  deleteSupplier(obj: any) {
    if (confirm(ConstantData.deleteConfirmation)) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true
      this.stockService.deleteSupplier(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success(ConstantData.deleteMessage);
          this.SupplierList = this.SupplierList.filter(x => x.SupplierId != obj.SupplierId);
        } else {
          this.toastr.error(response.Message)
          this.dataLoading = false
        }
      }, (err => {
        this.toastr.error(ConstantData.serverMessage);
      }))
      this.dataLoading = false
    }
  }

  editSupplier(obj: any) {
    this.resetForm()
    this.Supplier = obj
    $('#staticBackdrop').modal('show');
  }

  newSupplier() {
    this.resetForm()
    $('#staticBackdrop').modal('show');
  }
}
