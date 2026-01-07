export interface RackModel {
    RackId: number;
    RackName: string;
    IsSelected:boolean;
    Status: number;
    CreatedBy: number;
    CreatedOn: string;
    UpdatedBy: number | null;
    UpdatedOn: string | null;
}