import { PageOrientation, PageSize } from "pdfmake/interfaces";

export interface KeyValueModel {
    Key: number,
    Value: string
}


export interface FeePaymentModel {
    PupilAdmissionId: number;
    PaymentDate: any | null;
    AccountId: number | null;
    PaymentMode: number;
    ChequeNo: string | null;
    ChequeDate: any | null;
    ChequeBank: string;
    ChequeBankBranch: string;
    TransactionNo: string;
    FeeAmount: number;
    WaiveOffAmount: number;
    InitialAmount: number;
    TotalAmount: number;
    PaidAmount: number;
    DueAmount: number;
    Remarks: string;
    RemarksOnWaiveOff: string;
}

export interface FeePaymentDetailModel {
    FeePaymentDetailId: number;
    IsActive: boolean;
    IsSelected: boolean;
    IsCompulsory: boolean;
    HeadId: number | null;
    HeadName: string | null;
    FeeFor: number;
    FeeAmount: number;
    WaiveOffAmount: number;
    InitialAmount: number;
    TotalAmount: number;
    PaidAmount: number;
    DueAmount: number;
    Remarks: string;
    PupilWaiveOffId: number | null;
    PupilWaiveOffList: PupilWaiveOffModel[];
}

export interface FeeSessionModel {
    SessionId: number;
    SessionName: string;
    ClassName: string;
    SectionName: string;
    PupilAdmissionId: number;
    IsPaidAll: boolean;
    IsExpand: boolean;
    IsCurrent: boolean;
    FeePaymentMonthList: FeePaymentMonthModel[];
}

export interface FeePaymentMonthModel {
    IsSelected: boolean;
    IsExpand: boolean;
    FeePaymentMonthId: number;
    Year: number;
    MonthId: number;
    Date: string;
    Position: number;
    MonthName: string;
    TotalAmount: number;
    PaidAmount: number;
    DueAmount: number;
    PupilAdmissionId: number;
    FeePaymentDetailList: FeePaymentDetailModel[];
}

export interface PupilWaiveOffModel {
    PupilWaiveOffId: number;
}

export interface ReportModel {
    id: number,
    Ids: number[],
    DocType: number,
    IsPrint: boolean,
    IsHeader: boolean,
    ReportType: number,
}

export interface FilterModel {
    FromDate: any;
    ToDate: any;
    ToDateString: any;
    FromDateString: any;
    ReportNo: number;
    Id: number;
    ClassId: number;
    PupilId: number;
    SearchPupil: string;
    SectionId: number;
    AccountId: number;
    PaymentMode: number;
    SessionId: number;
    FeePaymentStatus: number;
    MonthId: number;
    IsPrint: boolean;
    docType: number;
    AdmissionType: number;
    PupilTypeId: any;
    SupplierId: number;
    SearchSupplier: string;
    SessionName: string;
    ClassName: string;
    SectionName: string;
    PupilTypeName: string;
    AdmissionTypeName: string;
    StaffId: number;
    SearchStaff: string;
    Status: number;
    TakenBy: number;
}
export interface ClassStudentModel {
    ClassName: string;
    NoOfStudents: number;
}
export interface DashboardModel {
    NoOfActiveStudents: number;
    NoOfInactiveStudents: number;
    NoOfForms: number;
    NoOfAdmitted: number;
    TodayNewAdmission: number;
    CurrentMonthNewAdmission: number;
    TodayRegistration: number;
    CurrentMonthRegistration: number;
    TodayCollection: number;
    CurrentMonthCollection: number;
    TodayExpense: number;
    CurrentMonthExpense: number;
    ClassStudentList: ClassStudentModel[];
    ShowNoOfActiveStudents: boolean;
    ShowNoOfInactiveStudents: boolean;
    ShowNoOfForms: boolean;
    ShowNoOfAdmitted: boolean;
    ShowTodayNewAdmission: boolean;
    ShowCurrentMonthNewAdmission: boolean;
    ShowTodayRegistration: boolean;
    ShowCurrentMonthRegistration: boolean;
    ShowTodayCollection: boolean;
    ShowCurrentMonthCollection: boolean;
    ShowTodayExpense: boolean;
    ShowCurrentMonthExpense: boolean;
    ShowClassStudentList: boolean;
    ShowRegistrationChart: boolean;
    ShowStudentChart: boolean;
    ShowIncomExpenseChart: boolean;
    ShowAccountChart: boolean;
    ShowTodayReport: boolean;
    ShowCurrentMonthReport: boolean;
    TitleAccountChart: string;
    TitleIncomExpenseChart: string;
    TitleStudentChart: string;
    TitleRegistrationChart: string;
    TitleNoOfActiveStudents: string;
    TitleNoOfInactiveStudents: string;
    TitleNoOfForms: string;
    TitleNoOfAdmitted: string;
    TitleTodayNewAdmission: string;
    TitleCurrentMonthNewAdmission: string;
    TitleTodayRegistration: string;
    TitleCurrentMonthRegistration: string;
    TitleTodayCollection: string;
    TitleCurrentMonthCollection: string;
    TitleTodayExpense: string;
    TitleCurrentMonthExpense: string;
    TitleClassStudentList: string;
}
export interface License {
    IsValid: boolean,
    Message: string,
    WarningMessage: string,
}

export interface FieldSelectionModel {
    key: string,
    isShow: boolean,
    title: string,
}
export interface PdfSettingModel {
    pageOrientation: PageOrientation;
    pageSize: PageSize;
    userPassword: string;
    pageMargins: number;
    commandType: number,
    fontSize: number;
}

export interface ActionModel {
    CanEdit: boolean,
    CanCreate: boolean,
    CanDelete: boolean,
    ResponseReceived: boolean,
    MenuTitle: string,
    ParentMenuTitle: string
}
export interface StaffLoginModel {
    StaffLoginId: number,
    StaffId: number,
    StaffName: string,
    UserName: string,
    DesignationName: string,
    StaffPhoto: string
}

export interface RequestModel {
    request: string
}

export interface ResponseModel {
    responseData: string,
    Message: string
}







