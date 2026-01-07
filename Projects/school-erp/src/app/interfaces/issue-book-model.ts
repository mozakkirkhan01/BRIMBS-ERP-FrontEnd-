import { BookModel } from "./book-model";
import { BookStockModel } from "./book-stock-model";

export interface IssueBookModel {
    IssueBookId: number;
    IssueId: number;
    BookStockId: number;
    ReturnDate: any | null;
    NoOfDays: number | null;
    FineAmount: number | null;
    IssueBookStatus: number;
    UpdatedBy: number | null;
    UpdatedOn: string | null;
    BookStock: BookStockModel;
    BookNo: string | null;
    IssueDate: any;
}