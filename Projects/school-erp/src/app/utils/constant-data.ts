import { SchoolNos } from "./enum";

export class ConstantData {
    public static DevelopedBy = "Webaikon Infotech";
    public static SuccessMessage = "Success";
    public static AccessDenied = "Access Denied";
    public static recordClass = "Class";
    public static recordSection = "Section";
    public static recordSession = "Session";
    public static recordRegistration = "Registration";
    public static recordPupil = "Pupil";
    public static recordSchool = "School";
    public static recordIncome = "Debit";
    public static recordExpense = "Credit";
    public static recordSearchPupil = "Enter Admission No / Pupil Name / Father's Name / Class Name / Section Name";
    public static stateCode = "20";

    public static formInvalidMessage = "Fill all the required fields !!";
    public static updateMessage = "Record details updated successfully.";
    public static submitMessage = "Record details submitted successfully.";
    public static deleteConfirmation = "Are your sure you want to delete this recored ?";
    public static deleteMessage = "Record Deleted Successfully.";
    public static serverMessage = "Error occured while fetching data !!";
    public static RowChangesMessage = "Allow to changes all row while changing first row";
    public static PageSizes = [10, 20, 100, 200, 500, 1000, 2000, 5000];
    public static StatusList = [{ Key: 1, Value: "Active" }, { Key: 2, Value: "Inactive" }];
    public static BoolList = [{ Key: true, Value: "Yes" }, { Key: false, Value: "No" }];
    private static readonly examKey = "3431F73D-D88B-4FE7-B5B3-EAB2063A30A4";
    private static readonly adminKey = "7918CCB7-21F0-4E8C-814F-AA66061E15CA";
    
   
//    private static readonly baseUrlNew: string = "https://localhost:7121/";
//    private static readonly baseUrl: string = "http://localhost:44335/";
    // private static readonly schoolNo: number = SchoolNos.PPS_Chas;

    //Active
    // private static readonly baseUrlNew: string = "https://schoolapi.winnexcode.com/";
    // private static readonly baseUrl: string = "https://schoolapi.webaikon.com/";
    // private static readonly schoolNo: number = SchoolNos.MJM_Bijulia;

    // private static readonly baseUrlNew: string = "https://mjmschoolapi.winnexcode.com/";
    // private static readonly baseUrl: string = "https://api.mjmpublicschool.edu.in/";
    // private static readonly schoolNo: number = SchoolNos.MJM_Bijulia;

    // private static readonly baseUrlNew: string = "https://ppschasapi.winnexcode.com/";
    // private static readonly baseUrl: string = "https://api.ppschas.org/";
    // private static readonly schoolNo: number = SchoolNos.PPS_Chas;

    // private static readonly baseUrl: string = "https://ljpsapi.npuniversity.in/";
    // private static readonly baseUrlNew: string = "https://ljpsapi.winnexcode.com/";
    // private static readonly schoolNo: number = SchoolNos.Leela_Janki;

    // private static readonly baseUrlNew: string = "https://rpsintercollegeapi.winnexcode.com/";
    // private static readonly baseUrl: string = "https://api.rpsintercollege.edu.in/";
    // private static readonly schoolNo: number = SchoolNos.RPS_Inter_College;


    //https://brimbsapi.brimbsbokaro.edu.in/

    private static readonly baseUrlNew: string = "https://brimbscollegeapi.winnexcode.com/";
    static readonly baseUrl: string = "https://brimbsapi.brimbsbokaro.edu.in/";
    private static readonly schoolNo: number = SchoolNos.Brimbs_Bokaro;
    // static readonly baseUrl: string = "https://brimbsapi.brimbsbokaro.edu.in";



    //private static readonly baseUrl: string = "https://api.gyandarshanpublicschool.org/";
    // private static readonly schoolNo: number = SchoolNos.Gyandarsan_Jodadih;

    //private static readonly baseUrl: string = "https://api.mkpsgarhwa.in.net/";
    //private static readonly schoolNo: number = SchoolNos.MKPS_Garhwa;

    //Changed
    //private static readonly baseUrl: string = "https://sjcsbishrampurapi.webaikon.com/";

    public static getExamKey() {
        return this.examKey;
    }
    public static getBaseUrl(): string {
        return this.baseUrl;
    }
    public static getApiUrl(): string {
        return this.baseUrl + "api/";
    }
    public static getExamApiUrl(): string {
        return this.baseUrl + "examination/";
    }
    public static getExpenseApiUrl(): string {
        return this.baseUrl + "expense/";
    }
    public static getCertificateApiUrl(): string {
        return this.baseUrl + "certificate/";
    }
    public static getStockUrl(): string {
        return this.baseUrlNew + "stock/";
    }

    public static getLibraryURL(): string {
        return this.baseUrlNew + "library/";
    }
    public static getAdminKey(): string {
        return this.adminKey;
    }

    public static getBaseUrlNew(): string {
        return this.baseUrlNew;
    }
    public static getSchoolNo(): number {
        return this.schoolNo;
    }
    public static getImageBase64(): string {
        return 'data:image/jpeg;base64,';
    }
}