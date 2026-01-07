import { ProductModel } from "./product-model";


export interface IssueProductModel {
    IssueProductId: number;
    IssueId: number;
    ProductStockId: number;
    UnitId: number;
    UnitValue: number;
    Quantity: number;
    UpdatedBy: number | null;
    UpdatedOn: string | null;
    Product: ProductModel;
}