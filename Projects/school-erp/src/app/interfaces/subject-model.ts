export interface SubjectModel {
    SubjectId: number;
    SubjectName: string;
    IsSelected:boolean;
    SubjectShortName: string;
    SubjectCode: string;
    ParentSubjectId: number;
    IsGrade: boolean;
    GradeGroupId: number;
    CreatedBy: number;
    CreatedDate: string;
    UpdatedBy: number;
    UpdatedDate: string;
}