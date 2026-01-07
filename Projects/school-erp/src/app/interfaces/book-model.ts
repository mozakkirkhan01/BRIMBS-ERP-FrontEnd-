export interface BookModel {
    BookId: number;
    BookName: string;
    SearchBook: string;
    Author: string | null;
    Edition: string | null;
    Publisher: string | null;
    PublishingYear: number | null;
    TotalPages: number;
    Volumne: string;
    BookTypeIds: string;
    ClassIds: string;
    SubjectIds: string;
    RackIds: string;
    AvailableStock: number;
    Status: number;
    CreatedBy: number;
    CreatedOn: string;
    UpdatedBy: number;
    UpdatedOn: string;
    BookNos: string;
}