export interface ProductHistoryModel {
    Date: string;
    ProductHistoryType: number;
    BatchNo: string;
    UnitName: string;
    ManufacturedDate: string | null;
    ExpiredDate: string | null;
    MRP: number;
    CostPrice: number;
    Quantity: number;
    UnitValue: number;
    PieceValue: number;
}