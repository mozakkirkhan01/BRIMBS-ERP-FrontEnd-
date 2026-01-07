import { Injectable } from '@angular/core';
import { ConstantData } from '../utils/constant-data';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  private readonly apiUrl: string = ConstantData.getLibraryURL();
  private readonly headers: HttpHeaders = new HttpHeaders({ 'AppKey': ConstantData.getAdminKey() });

  constructor(private http: HttpClient) { }

  //Rack
  getRackList(obj: any) {
    return this.http.post(`${this.apiUrl}Rack/RackList`, obj, { headers: this.headers })
  }

  saveRack(obj: any) {
    return this.http.post(`${this.apiUrl}Rack/saveRack`, obj, { headers: this.headers })
  }

  deleteRack(obj: any) {
    return this.http.post(`${this.apiUrl}Rack/deleteRack`, obj, { headers: this.headers })
  }

  //BookType
  getBookTypeList(obj: any) {
    return this.http.post(`${this.apiUrl}BookType/BookTypeList`, obj, { headers: this.headers })
  }

  saveBookType(obj: any) {
    return this.http.post(`${this.apiUrl}BookType/saveBookType`, obj, { headers: this.headers })
  }

  deleteBookType(obj: any) {
    return this.http.post(`${this.apiUrl}BookType/deleteBookType`, obj, { headers: this.headers })
  }

  //Book
  getBookList(obj: any) {
    return this.http.post(`${this.apiUrl}Book/BookList`, obj, { headers: this.headers })
  }

  saveBook(obj: any) {
    return this.http.post(`${this.apiUrl}Book/saveBook`, obj, { headers: this.headers })
  }

  deleteBook(obj: any) {
    return this.http.post(`${this.apiUrl}Book/deleteBook`, obj, { headers: this.headers })
  }



  // IssueBook
  getIssueBookDetail(obj: any) {
    return this.http.post(`${this.apiUrl}IssueBook/IssueBookDetail`, obj, { headers: this.headers })
  }

  saveIssueBook(obj: any) {
    return this.http.post(`${this.apiUrl}IssueBook/SaveIssueBook`, obj, { headers: this.headers })
  }

  deleteIssueBook(obj: any) {
    return this.http.post(`${this.apiUrl}IssueBook/DeleteIssueBook`, obj, { headers: this.headers })
  }
  // getIssuedBookListForReturn(obj: any) {
  //   return this.http.post(`${this.apiUrl}IssueBook/IssuedBookListForReturn`, obj, { headers: this.headers })
  // }

  getIssueBookData(obj: any) {
    return this.http.post(`${this.apiUrl}IssueBook/IssueBookData`, obj, { headers: this.headers })
  }

  reutrnBook(obj: any) {
    return this.http.post(`${this.apiUrl}IssueBook/ReutrnBook`, obj, { headers: this.headers })
  }

  getIssueBookList(obj: any) {
    return this.http.post(`${this.apiUrl}IssueBook/IssueBookList`, obj, { headers: this.headers })
  }

  //BookStock
  getBookStockList(obj: any) {
    return this.http.post(`${this.apiUrl}BookStock/BookStockList`, obj, { headers: this.headers })
  }

  //PurchaseBook
  getPurchaseBookList(obj: any) {
    return this.http.post(`${this.apiUrl}PurchaseBook/PurchaseBookList`, obj, { headers: this.headers })
  }

  savePurchaseBook(obj: any) {
    return this.http.post(`${this.apiUrl}PurchaseBook/savePurchaseBook`, obj, { headers: this.headers })
  }

  deletePurchaseBook(obj: any) {
    return this.http.post(`${this.apiUrl}PurchaseBook/deletePurchaseBook`, obj, { headers: this.headers })
  }
  getPurchaseBookDetail(obj: any) {
    return this.http.post(`${this.apiUrl}PurchaseBook/PurchaseBookDetail`, obj, { headers: this.headers })
  }

}
