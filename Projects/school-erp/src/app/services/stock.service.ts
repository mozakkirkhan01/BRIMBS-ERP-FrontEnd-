import { Injectable } from '@angular/core';
import { ConstantData } from '../utils/constant-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private readonly apiUrl: string = ConstantData.getStockUrl();
  private readonly headers: HttpHeaders = new HttpHeaders({ 'AppKey': ConstantData.getAdminKey() }); 

  constructor(private http: HttpClient) { }

  //Product
  getProductList(obj: any) {
    return this.http.post(`${this.apiUrl}Product/ProductList`, obj, { headers: this.headers })
  }

  saveProduct(obj: any) {
    return this.http.post(`${this.apiUrl}Product/saveProduct`, obj, { headers: this.headers })
  }

  deleteProduct(obj: any) {
    return this.http.post(`${this.apiUrl}Product/deleteProduct`, obj, { headers: this.headers })
  }
  // ProductStock
  getProductStockList(obj: any) {
    return this.http.post(`${this.apiUrl}ProductStock/ProductStockList`, obj, { headers: this.headers })
  }
  getProductHistory(obj: any) {
    return this.http.post(`${this.apiUrl}ProductStock/ProductHistory`, obj, { headers: this.headers })
  }

  // Issue
  getIssueList(obj: any) {
    return this.http.post(`${this.apiUrl}Issue/IssueList`, obj, { headers: this.headers })
  }

  getIssueDetail(obj: any) {
    return this.http.post(`${this.apiUrl}Issue/IssueDetail`, obj, { headers: this.headers })
  }

  saveIssue(obj: any) {
    return this.http.post(`${this.apiUrl}Issue/saveIssue`, obj, { headers: this.headers })
  }

  deleteIssue(obj: any) {
    return this.http.post(`${this.apiUrl}Issue/deleteIssue`, obj, { headers: this.headers })
  }

  // Purchase
  getPurchaseList(obj: any) {
    return this.http.post(`${this.apiUrl}Purchase/PurchaseList`, obj, { headers: this.headers })
  }

  getPurchaseDetail(obj: any) {
    return this.http.post(`${this.apiUrl}Purchase/PurchaseDetail`, obj, { headers: this.headers })
  }

  savePurchase(obj: any) {
    return this.http.post(`${this.apiUrl}Purchase/savePurchase`, obj, { headers: this.headers })
  }

  deletePurchase(obj: any) {
    return this.http.post(`${this.apiUrl}Purchase/deletePurchase`, obj, { headers: this.headers })
  }
  //Manufacturer
  getManufacturerList(obj: any) {
    return this.http.post(`${this.apiUrl}Manufacturer/ManufacturerList`, obj, { headers: this.headers })
  }

  saveManufacturer(obj: any) {
    return this.http.post(`${this.apiUrl}Manufacturer/saveManufacturer`, obj, { headers: this.headers })
  }

  deleteManufacturer(obj: any) {
    return this.http.post(`${this.apiUrl}Manufacturer/deleteManufacturer`, obj, { headers: this.headers })
  }

  //Supplier
  getSupplierList(obj: any) {
    return this.http.post(`${this.apiUrl}Supplier/SupplierList`, obj, { headers: this.headers })
  }

  saveSupplier(obj: any) {
    return this.http.post(`${this.apiUrl}Supplier/saveSupplier`, obj, { headers: this.headers })
  }

  deleteSupplier(obj: any) {
    return this.http.post(`${this.apiUrl}Supplier/deleteSupplier`, obj, { headers: this.headers })
  }

  //Unit
  getUnitList(obj: any) {
    return this.http.post(`${this.apiUrl}Unit/UnitList`, obj, { headers: this.headers })
  }

  saveUnit(obj: any) {
    return this.http.post(`${this.apiUrl}Unit/saveUnit`, obj, { headers: this.headers })
  }

  deleteUnit(obj: any) {
    return this.http.post(`${this.apiUrl}Unit/deleteUnit`, obj, { headers: this.headers })
  }

}
