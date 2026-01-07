import { IssueBookModel } from "./issue-book-model";
import { IssueProductModel } from "./issue-product-model";

export interface IssueModel {
    IssueId: number;
    TakenBy: number;
    PupilId: number|null;
    StaffId: number|null;
    ReceiptNo: string | null;
    IssueDate: any;
    TotalProducts: number;
    Quantity: number;
    Remarks: string | null;
    CreatedBy: number;
    CreatedOn: string;
    UpdatedBy: number | null;
    UpdatedOn: string | null;
    StaffName: string | null;
    CreatedByUser: string | null;
    IssueProducts: IssueProductModel[];
    IssueBooks: IssueBookModel[];

}