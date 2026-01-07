import { PupilAdmissionModel } from "./pupil-admission-model";

export interface PupilModel {
    PupilId: number;
    PupilTypeId: number;
    AdmissionNo: string;
    PupilName: string;
    DOB: string;
    Gender: number;
    FatherName: string;
    FatherOccupation: string;
    MotherName: string;
    MotherOccupation: string;
    FamilyAnnualIncome: number;
    GuardianMobileNo: string;
    CorrespondenceAddress: string;
    CorrespondenceCityId: number;
    CorrespondencePinCode: string;
    PermanentAddress: string;
    PermanentCityId: number;
    PermanentPinCode: string;
    Category: number;
    BloodGroup: number;
    Religion: number;
    Nationality: number;
    MobileNo: string;
    AlternateNo: string;
    Email: string;
    AadhaarNo: string;
    PreviousSchoolName: string;
    PreviousSchoolBoard: string;
    PreviousSchoolClass: string;
    PreviousSchoolMedium: string;
    PreviousSchoolTCNo: string;
    PreviousSchoolTCDate: string;
    Remarks: string;
    StudentPhoto: string;
    LoginPassword: string;
    PupilStatus: number;
    JoinDate: string;
    CreatedDate: string;
    CreatedBy: number;
    UpdatedDate: string;
    UpdatedBy: number;
    PreviousBoard: number;

    PupilTypeName: string;
    CorrespondenceStateId: number;
    CorrespondenceCityName: string;
    CorrespondenceStateName: string;
    PermanentStateId: number;
    PermanentCityName: string;
    PermanentStateName: string;
    PupilAdmission: PupilAdmissionModel;
    SearchPupil: string;
    ClassName: string;
    SectionName: string;
}

