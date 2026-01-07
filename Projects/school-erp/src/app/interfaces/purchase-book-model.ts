import { BookModel } from "./book-model";

export interface PurchaseBookModel {
    PurchaseBookId: number;
    PurchaseId: number;
    BookId: number;
    Quantity: number;
    FreeQunatity: number;
    MRP: number;
    CostPrice: number;
    BasicAmount: number;
    DiscountPercentage: number;
    DiscountAmount: number;
    BillDiscountAmount: number;
    TaxableAmount: number;
    GSTValue: number;
    GSTAmount:number;
    CGSTAmount: number;
    SGSTAmount: number;
    IGSTAmount: number;
    TotalAmount: number;
    Book: BookModel;
}