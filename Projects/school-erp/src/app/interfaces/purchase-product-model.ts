import { ProductModel } from "./product-model";

export interface PurchaseProductModel {
    PurchaseProductId: number;
    PurchaseId: number;
    ProductId: number;
    ProductStockId: number;
    BatchNo: string | null;
    HSNCode: string | null;
    UnitId: number;
    ManufacturedDate: string | null;
    ExpiredDate: string | null;
    Quantity: number;
    FreeQunatity: number;
    MRP: number;
    CostPrice: number;
    BasicAmount: number;
    DiscountPercentage: number;
    DiscountAmount: number;
    BillDiscountAmount: number;
    TaxableAmount: number;
    GSTAmount:number;
    GSTValue: number;
    CGSTAmount: number;
    SGSTAmount: number;
    IGSTAmount: number;
    TotalAmount: number;
    Product: ProductModel;
}