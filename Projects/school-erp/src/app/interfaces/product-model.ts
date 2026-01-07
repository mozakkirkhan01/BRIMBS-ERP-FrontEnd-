export interface ProductModel {
    ProductId: any;
    ProductName: string | null;
    Status: number;
    CreatedBy: number;
    CreatedOn: string;
    UpdatedBy: number | null;
    UpdatedOn: string | null;
    ManufacturerId: number | null;
    HSNCode: string | null;
    UnitId: number;
    MRP: number;
    GSTValue: number;
    UnitName: string | null;
    ManufacturerName: string | null;
    SearchProduct:string |null;
    ExpiredDate:any;
}