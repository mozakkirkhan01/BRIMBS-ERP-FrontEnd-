import { PurchaseBookModel } from "./purchase-book-model";
import { PurchaseProductModel } from "./purchase-product-model";
import { SupplierModel } from "./supplier-model";


export interface PurchaseModel {
    PurchaseId: number;
    SupplierId: number;
    PurchaseDate: any;
    InvoiceNo: string;
    BasicAmount: number;
    ItemDiscountAmount: number;
    BillDiscountPercentage: number;
    BillDiscountAmount: number;
    DiscountAmount: number;
    TaxableAmount: number;
    CGSTAmount: number;
    SGSTAmount: number;
    IGSTAmount: number;
    TotalAmount: number;
    FinalAmount: number;
    PaidAmount: number;
    DuesAmount: number;
    CreatedOn: string;
    CreatedBy: number;
    UpdatedOn: string | null;
    UpdatedBy: number | null;
    Supplier: SupplierModel;
    PurchaseProducts: PurchaseProductModel[];
    PurchaseBooks: PurchaseBookModel[];
    Quantity: number;
    FreeQunatity: number;
}