export interface BookTypeModel {
    BookTypeId: number;
    BookTypeName: string;
    IsSelected:boolean;
    Status: number;
    CreatedBy: number;
    UpdatedBy: number | null;
    CreatedOn: string;
    UpdatedOn: string | null;
}