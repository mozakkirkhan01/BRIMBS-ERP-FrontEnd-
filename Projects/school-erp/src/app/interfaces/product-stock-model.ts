import { ProductModel } from "./product-model";


export interface ProductStockModel {
    ProductStockId: number;
    ProductId: number;
    UnitId: number;
    AvailableQuantity: number;
    MRP:number;
    ExpiredDate:any;
    UpdatedOn: string;
    UnitValue: number;
    PieceValue: number;
    Product: ProductModel;
}