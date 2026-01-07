export enum Term {
    TermOne = 1,
    TermTwo = 2
}
export enum PupilLeftStatus {
    Left = 1,
    Rejoin = 2
}
export enum PaymentMode {
    Cash = 1,
    Cheque = 2,
    POS = 3,
    QRCode = 4,
    Online = 6,
    Others = 10
}
export enum Months {
    January = 1,
    February = 2,
    March = 3,
    April = 4,
    May = 5,
    June = 6,
    July = 7,
    August = 8,
    September = 9,
    October = 10,
    November = 11,
    December = 12
}
export enum Board {
    JAC = 1,
    CBSE = 2,
    Others = 20,
}
export enum AccountType {
    CashAccount = 1,
    BankAccount = 2,
    Others = 20
}
export enum DashboardItem {
    IncomExpenseChart = 1,
    AccountChart = 2,
    StudentChart = 3,
    RegistrationChart = 4,
    ActiveStudents = 5,
    InactiveStudents = 6,
    TodayRegistration = 7,
    CurrentMonthRegistration = 8,
    TodayAdmission = 9,
    CurrentMonthAdmission = 10,
    TodayCollection = 11,
    CurrentMonthCollection = 12,
    TodayExpense = 13,
    CurrentMonthExpense = 14,
    Shortcuts = 15,
}
export enum BookStockStatus {
    Available = 1,
    Isuued = 2,
    Damage = 3,
    Missing = 4,
}
export enum PurchaseFor {
    Store = 1,
    Library = 2
}

export enum IssueFor {
    Store = 1,
    Library = 2
}
export enum PaymentStatus {
    Pending = 1,
    Paid = 2
}
export enum ProductHistoryType {
    Purchase = 1,
    Issue = 2
}
export enum IssueBookStatus {
    Issue = 1,
    Reissue = 2,
    Return = 3,
}
export enum TakenBy {
    Staff = 1,
    Student = 2
}
export enum BackupStatus {
    Pending = 1,
    InProgress = 2,
    Completed = 3,
}
export enum CommandType {
    Download = 1,
    Print = 2,
    Preview = 3
}
export enum SchoolNos {
    MJM_Bijulia = 1,
    PPS_Chas = 2,
    Leela_Janki = 3,
    RPS_Inter_College = 4,
    Gyandarsan_Jodadih = 5,
    MKPS_Garhwa = 6,
    WinnexCode_school = 50,
     Brimbs_Bokaro = 7,
}

export enum FormFor {
    SameSchool = 1,
    OtherSchool = 2,
    AllSchool = 3,
}

export enum Category {

    General = 1,
    OBC = 2,
    SC = 3,
    ST = 4,
    BPL = 5,
    Other = 10
}

export enum YesNo {
    Yes = 1,
    No = 0,
}

export enum BloodGroup {
    OPositive = 1,
    ONegative = 2,
    APositive = 3,
    ANegative = 4,
    BPositive = 5,
    BNegative = 6,
    ABPositive = 7,
    ABNegative = 8,
}


export enum Nationality {
    Indian = 1,
    Other = 2
}

export enum Religion {
    Hinduism = 1,
    Islam = 2,
    Christianity = 3,
    Sikhism = 4,
    Buddhism = 5,
    Jainism = 6,
    Tribal = 7,
    Other = 8
}

export enum PupilAdmissionStatus {
    Active = 1,
    Inactive = 2,
}

export enum PupilStatus {
    Active = 1,
    Inactive = 2,
    Left = 10
}
export enum FeePaymentStatus {
    Pending = 1,
    Paid = 2,
    Cancelled = 3
}

export enum FeeFor {
    AdmissionFee = 1,
    ClassFee = 2,
    FormFee = 3,
    TransportFee = 4,
    Fine = 6,
    OtherCharges = 7,
    HostelFee = 8,
    Miscellaneous = 9,
}
export enum PaymentFor {
    Fee = 1,
    Form = 2,
    Miscellaneous = 3,
}
export enum RegistrationStatus {
    Pending = 1,
    Registred = 2,
    Admitted = 3
}
export enum Gender {
    Male = 1,
    Female = 2,
    Other = 3
}
export enum StaffType {
    SuperAdmin = 1,
    Admin = 2,
    TeachingStaff = 3,
    NonTeachingStaff = 4
}
export enum Status {
    Active = 1,
    Inactive = 2
}
export enum AdmissionType {
    NewAdmission = 1,
    Promoted = 2,
    ClassBack = 3
}
export enum ClassNos {
    PreNursery = 1,
    Nursery = 2,
    LKG = 3,
    UKG = 4,
    One = 8,
    Two = 9,
    Three = 10,
    Four = 11,
    Five = 12,
    Six = 13,
    Seven = 14,
    Eight = 15,
    Nine = 16,
    Ten = 17,
    Eleven = 18,
    Twelve = 19,
}
export enum ExamAttendance {
    Present = 1,
    Absent = 2,
    MedicalLeave = 3,
}

export enum DocType {
    Pdf = 1,
    Word = 2,
    Excel = 3,
    Print = 4,
}

export enum PupilOrderBy {
    RollNo = 1,
    Rank = 2,
    PupilName = 4,
}