import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantData } from '../utils/constant-data';
import { LoadDataService } from '../utils/load-data.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private readonly expenseUrl: string = ConstantData.getExpenseApiUrl();
  private readonly headers: HttpHeaders = new HttpHeaders({ 'AppKey': ConstantData.getAdminKey() });

  constructor(private http: HttpClient,
    private loadData: LoadDataService) {
  }
  printExpenseIncomeList(id: any) {
    window.open(ConstantData.getBaseUrl() + "report/expenseincomelist/" + id);
  }
  printExpenseHistory(id: any) {
    window.open(ConstantData.getBaseUrl() + "report/ExpenseHistory?param1=" + id);
  }

  //ExpenseCategory
  getExpenseCategoryList(obj: any) {
    return this.http.post(this.expenseUrl + "ExpenseCategory/ExpenseCategoryList", obj, { headers: this.headers })
  }

  saveExpenseCategory(obj: any) {
    return this.http.post(this.expenseUrl + "ExpenseCategory/saveExpenseCategory", obj, { headers: this.headers })
  }

  deleteExpenseCategory(obj: any) {
    return this.http.post(this.expenseUrl + "ExpenseCategory/deleteExpenseCategory", obj, { headers: this.headers })
  }

  //ExpenseHead
  getExpenseHeadList(obj: any) {
    return this.http.post(this.expenseUrl + "ExpenseHead/ExpenseHeadList", obj, { headers: this.headers })
  }

  saveExpenseHead(obj: any) {
    return this.http.post(this.expenseUrl + "ExpenseHead/saveExpenseHead", obj, { headers: this.headers })
  }

  deleteExpenseHead(obj: any) {
    return this.http.post(this.expenseUrl + "ExpenseHead/deleteExpenseHead", obj, { headers: this.headers })
  }

  //Expense
  getExpenseList(obj: any) {
    return this.http.post(this.expenseUrl + "Expense/ExpenseList", obj, { headers: this.headers })
  }
  getExpenseIncomeList(obj: any) {
    return this.http.post(this.expenseUrl + "Expense/ExpenseIncomeList", obj, { headers: this.headers })
  }

  saveExpense(obj: any) {
    return this.http.post(this.expenseUrl + "Expense/saveExpense", obj, { headers: this.headers })
  }

  deleteExpense(obj: any) {
    return this.http.post(this.expenseUrl + "Expense/deleteExpense", obj, { headers: this.headers })
  }

}
