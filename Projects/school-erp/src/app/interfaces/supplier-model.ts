export interface SupplierModel {
    SupplierId: number;
    SupplierName: string;
    PurchaseFor:number;
    FullAddress: string | null;
    MobileNo: string | null;
    AlternateNo: string | null;
    StateCode: string | null;
    Status: number;
    CreatedOn: string;
    CreatedBy: number;
    UpdatedOn: string | null;
    UpdatedBy: number | null;

    SearchSupplier:string;
}