import { BookModel } from "./book-model";

export interface BookStockModel {
    BookStockId: number;
    BookId: number;
    BookNo: string;
    PurchaseBookId: number;
    BookStockStatus: number;
    Book: BookModel;
    SearchBook:string;

}