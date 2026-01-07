export interface PupilAdmissionModel {
    PupilAdmissionId: number;
    PupilId: number;
    AdmissionType: number;
    SessionId: number;
    SectionId: number;
    RollNo: number;
    AdmissionDate: string;
    LeaveDate: string;
    Height: string;
    Weight: string;
    PupilAdmissionStatus: number;
    CreatedDate: string;
    CreatedBy: number;
    UpdatedDate: string;
    UpdatedBy: number;
    IsFullyPaid: boolean;

    SessionName:string;
    ClassId:number;
    ClassName:string;
    SectionName:string;
}