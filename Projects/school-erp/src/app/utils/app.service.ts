import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantData } from './constant-data';

@Injectable({
  providedIn: 'root'
})

export class AppService {
  private readonly apiUrl: string = ConstantData.getApiUrl();
  private readonly headers: HttpHeaders = new HttpHeaders({ 'AppKey': ConstantData.getAdminKey() });

  constructor(private http: HttpClient) {
  }

  getImageUrl(): string {
    return ConstantData.getBaseUrl();
  }

  printCashbookBankbook(id: any) {
    window.open(ConstantData.getBaseUrl() + "report/CashbookBankbook?param1=" + id);
  }

  printFeeePaymentReceipt(id: any) {
    window.open(ConstantData.getBaseUrl() + "report/feepaymentreceipt?param1=" + id);
  }

  printPupilList(id: any) {
    window.open(ConstantData.getBaseUrl() + "report/pupillist?param1=" + id);
  }

  printRegistrationReceipt(id: any) {
    window.open(ConstantData.getBaseUrl() + "report/RegistrationReceipt?param1=" + id);
  }

  printRegistrationList(id: any) {
    window.open(ConstantData.getBaseUrl() + "report/RegistrationList?param1=" + id);
  }
  printFeePaymentList(id: any) {
    window.open(ConstantData.getBaseUrl() + "report/feepaymentlist?param1=" + id);
  }
  printAccountCollectionReport(id: any) {
    window.open(ConstantData.getBaseUrl() + "report/AccountCollectionReport?param1=" + id);
  }
  printFeeDueReport(id: any) {
    window.open(ConstantData.getBaseUrl() + "report/FeeDueReport?param1=" + id);
  }
  printYearlyCollectionReport(id: any) {
    window.open(ConstantData.getBaseUrl() + "report/YearlyCollectionReport?param1=" + id);
  }

  // Status Type
  getStatusList(obj: any) {
    return this.http.post(this.apiUrl + "enum/StatusList", obj, { headers: this.headers })
  }

  //  gender Type
  getGenderList(obj: any) {
    return this.http.post(this.apiUrl + "enum/GenderList", obj, { headers: this.headers })
  }

  // Staff Type
  getStaffTypeList(obj: any) {
    return this.http.post(this.apiUrl + "enum/StaffTypeList", obj, { headers: this.headers })
  }

  // Category 
  getCategoryList(obj: any) {
    return this.http.post(this.apiUrl + "enum/CategoryList", obj, { headers: this.headers })
  }

  // BloodGroup 
  getBloodGroupList(obj: any) {
    return this.http.post(this.apiUrl + "enum/BloodGroupList", obj, { headers: this.headers })
  }

  // Religon 
  getReligionList(obj: any) {
    return this.http.post(this.apiUrl + "enum/ReligionList", obj, { headers: this.headers })
  }

  // Nationality 
  getNationalityList(obj: any) {
    return this.http.post(this.apiUrl + "enum/NationalityList", obj, { headers: this.headers })
  }
  // FeeFor 
  getFeeForList(obj: any) {
    return this.http.post(this.apiUrl + "enum/FeeForList", obj, { headers: this.headers })
  }

  // Admission Type
  getAdmissionTypeList(obj: any) {
    return this.http.post(this.apiUrl + "enum/AdmissionTypeList", obj, { headers: this.headers })
  }

  // Registration
  saveRegistration(obj: any) {
    return this.http.post(this.apiUrl + "Registration/saveRegistration", obj, { headers: this.headers })
  }

  getRegistrationList(obj: any) {
    return this.http.post(this.apiUrl + "Registration/RegistrationList", obj, { headers: this.headers })
  }

  getSearchRegistrationList(obj: any) {
    return this.http.post(this.apiUrl + "Registration/SearchRegistrationList", obj, { headers: this.headers })
  }

  deleteRegistration(obj: any) {
    return this.http.post(this.apiUrl + "Registration/deleteRegistration", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  // FeePayment
  getFeePaymentList(obj: any) {
    return this.http.post(this.apiUrl + "FeePayment/FeePaymentList", obj, { headers: this.headers })
  }
  getAccountCollectionList(obj: any) {
    return this.http.post(this.apiUrl + "FeePayment/AccountCollectionList", obj, { headers: this.headers })
  }
  getFeePaymentDetailForFee(obj: any) {
    return this.http.post(this.apiUrl + "FeePayment/FeePaymentDetailForFee", obj, { headers: this.headers })
  }
  saveFeePayment(obj: any) {
    return this.http.post(this.apiUrl + "FeePayment/SaveFeePayment", obj, { headers: this.headers })
  }
  updateFeePayment(obj: any) {
    return this.http.post(this.apiUrl + "FeePayment/UpdateFeePayment", obj, { headers: this.headers })
  }
  deleteFeePayment(obj: any) {
    return this.http.post(this.apiUrl + "FeePayment/DeleteFeePayment", obj, { headers: this.headers })
  }
  getFeeDueList(obj: any) {
    return this.http.post(this.apiUrl + "FeePayment/FeeDueList", obj, { headers: this.headers })
  }
  getFeePaymentDetail(obj: any) {
    return this.http.post(this.apiUrl + "FeePayment/FeePaymentDetail", obj, { headers: this.headers })
  }
  //Fee Report
  getYearlyCollectionList(obj: any) {
    return this.http.post(this.apiUrl + "FeeReport/YearlyCollectionList", obj, { headers: this.headers })
  }

  // Month
  getMonthList(obj: any) {
    return this.http.post(this.apiUrl + "Month/MonthList", obj, { headers: this.headers })
  }

  // Pupil Admission
  getPupilListForPromotion(obj: any) {
    return this.http.post(this.apiUrl + "PupilAdmission/PupilListForPromotion", obj, { headers: this.headers })
  }
  pupilPromotion(obj: any) {
    return this.http.post(this.apiUrl + "PupilAdmission/pupilPromotion", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */
  // FeePaymentDetail
  getFeePaymentDetailList(obj: any) {
    return this.http.post(this.apiUrl + "FeePaymentDetail/FeePaymentDetailList", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  // Designation 
  getDesignationList(obj: any) {
    return this.http.post(this.apiUrl + "Designation/DesignationList", obj, { headers: this.headers })
  }

  saveDesignation(obj: any) {
    return this.http.post(this.apiUrl + "Designation/saveDesignation", obj, { headers: this.headers })
  }

  deleteDesignation(obj: any) {
    return this.http.post(this.apiUrl + "Designation/deleteDesignation", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //Department
  getDepartmentList(obj: any) {
    return this.http.post(this.apiUrl + "Department/DepartmentList", obj, { headers: this.headers })
  }

  saveDepartment(obj: any) {
    return this.http.post(this.apiUrl + "Department/saveDepartment", obj, { headers: this.headers })
  }

  deleteDepartment(obj: any) {
    return this.http.post(this.apiUrl + "Department/deleteDepartment", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  // Staff
  getStaffList(obj: any) {
    return this.http.post(this.apiUrl + "Staff/StaffList", obj, { headers: this.headers })
  }

  saveStaff(obj: any) {
    return this.http.post(this.apiUrl + "Staff/saveStaff", obj, { headers: this.headers })
  }

  deleteStaff(obj: any) {
    return this.http.post(this.apiUrl + "Staff/deleteStaff", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  // Staff Login
  StaffLogin(obj: any) {
    return this.http.post(this.apiUrl + "StaffLogin/StaffLogin", obj, { headers: this.headers })
  }

  getStaffLoginList(obj: any) {
    return this.http.post(this.apiUrl + "StaffLogin/StaffLoginList", obj, { headers: this.headers })
  }

  saveStaffLogin(obj: any) {
    return this.http.post(this.apiUrl + "StaffLogin/saveStaffLogin", obj, { headers: this.headers })
  }

  deleteStaffLogin(obj: any) {
    return this.http.post(this.apiUrl + "StaffLogin/deleteStaffLogin", obj, { headers: this.headers })
  }

  changePassword(obj: any) {
    return this.http.post(this.apiUrl + "StaffLogin/changePassword", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  // School
  getSchool(obj: any) {
    return this.http.post(this.apiUrl + "School/GetSchool", obj, { headers: this.headers })
  }

  getSchoolList(obj: any) {
    return this.http.post(this.apiUrl + "School/SchoolList", obj, { headers: this.headers })
  }

  saveSchool(obj: any) {
    return this.http.post(this.apiUrl + "School/saveSchool", obj, { headers: this.headers })
  }

  deleteSchool(obj: any) {
    return this.http.post(this.apiUrl + "School/deleteSchool", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //PageGroup
  getPageGroupList(obj: any) {
    return this.http.post(this.apiUrl + "PageGroup/PageGroupList", obj, { headers: this.headers })
  }

  savePageGroup(obj: any) {
    return this.http.post(this.apiUrl + "PageGroup/savePageGroup", obj, { headers: this.headers })
  }

  deletePageGroup(obj: any) {
    return this.http.post(this.apiUrl + "PageGroup/deletePageGroup", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //Page
  getPageList(obj: any) {
    return this.http.post(this.apiUrl + "Page/PageList", obj, { headers: this.headers })
  }

  savePage(obj: any) {
    return this.http.post(this.apiUrl + "Page/savePage", obj, { headers: this.headers })
  }

  deletePage(obj: any) {
    return this.http.post(this.apiUrl + "Page/deletePage", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //Dashboard
  getDashboardList(obj: any) {
    return this.http.post(this.apiUrl + "Dashboard/DashboardList", obj, { headers: this.headers })
  }

  saveDashboard(obj: any) {
    return this.http.post(this.apiUrl + "Dashboard/saveDashboard", obj, { headers: this.headers })
  }

  deleteDashboard(obj: any) {
    return this.http.post(this.apiUrl + "Dashboard/deleteDashboard", obj, { headers: this.headers })
  }

  getDashboardDetail(obj: any) {
    return this.http.post(this.apiUrl + "Dashboard/DashboardDetail", obj, { headers: this.headers })
  }

  //Shortcut
  getShortcutList(obj: any) {
    return this.http.post(this.apiUrl + "Shortcut/ShortcutList", obj, { headers: this.headers })
  }

  saveShortcut(obj: any) {
    return this.http.post(this.apiUrl + "Shortcut/saveShortcut", obj, { headers: this.headers })
  }

  deleteShortcut(obj: any) {
    return this.http.post(this.apiUrl + "Shortcut/deleteShortcut", obj, { headers: this.headers })
  }

  //RoleDashboard
  getRoleDashboardList(obj: any) {
    return this.http.post(this.apiUrl + "RoleDashboard/AllRoleDashboardList", obj, { headers: this.headers })
  }

  saveRoleDashboard(obj: any) {
    return this.http.post(this.apiUrl + "RoleDashboard/saveRoleDashboard", obj, { headers: this.headers })
  }

  //Menu
  getUserMenuList(obj: any) {
    return this.http.post(this.apiUrl + "Menu/UserMenuList", obj, { headers: this.headers })
  }

  validiateMenu(obj: any) {
    return this.http.post(this.apiUrl + "Menu/ValidiateMenu", obj, { headers: this.headers })
  }

  getPageMenuList(obj: any) {
    return this.http.post(this.apiUrl + "Menu/PageMenuList", obj, { headers: this.headers })
  }

  getMenuList(obj: any) {
    return this.http.post(this.apiUrl + "Menu/MenuList", obj, { headers: this.headers })
  }

  saveMenu(obj: any) {
    return this.http.post(this.apiUrl + "Menu/saveMenu", obj, { headers: this.headers })
  }

  deleteMenu(obj: any) {
    return this.http.post(this.apiUrl + "Menu/deleteMenu", obj, { headers: this.headers })
  }

  menuUp(obj: any) {
    return this.http.post(this.apiUrl + "Menu/MenuUp", obj, { headers: this.headers })
  }

  menuDown(obj: any) {
    return this.http.post(this.apiUrl + "Menu/MenuDown", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //Role
  getRoleList(obj: any) {
    return this.http.post(this.apiUrl + "Role/RoleList", obj, { headers: this.headers })
  }

  saveRole(obj: any) {
    return this.http.post(this.apiUrl + "Role/saveRole", obj, { headers: this.headers })
  }

  deleteRole(obj: any) {
    return this.http.post(this.apiUrl + "Role/deleteRole", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //RoleMenu
  getRoleMenuList(obj: any) {
    return this.http.post(this.apiUrl + "RoleMenu/AllRoleMenuList", obj, { headers: this.headers })
  }

  saveRoleMenu(obj: any) {
    return this.http.post(this.apiUrl + "RoleMenu/saveRoleMenu", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //StaffLoginRole
  getStaffLoginRoleList(obj: any) {
    return this.http.post(this.apiUrl + "StaffLoginRole/StaffLoginRoleList", obj, { headers: this.headers })
  }

  saveStaffLoginRole(obj: any) {
    return this.http.post(this.apiUrl + "StaffLoginRole/saveStaffLoginRole", obj, { headers: this.headers })
  }

  deleteStaffLoginRole(obj: any) {
    return this.http.post(this.apiUrl + "StaffLoginRole/deleteStaffLoginRole", obj, { headers: this.headers })
  }

   //Account
   getAccountList(obj: any) {
    return this.http.post(this.apiUrl + "Account/AccountList", obj, { headers: this.headers })
  }

  saveAccount(obj: any) {
    return this.http.post(this.apiUrl + "Account/saveAccount", obj, { headers: this.headers })
  }

  deleteAccount(obj: any) {
    return this.http.post(this.apiUrl + "Account/deleteAccount", obj, { headers: this.headers })
  }


  /* ---------------------------------------------------------------------- */

  //Head
  getHeadList(obj: any) {
    return this.http.post(this.apiUrl + "Head/HeadList", obj, { headers: this.headers })
  }

  saveHead(obj: any) {
    return this.http.post(this.apiUrl + "Head/saveHead", obj, { headers: this.headers })
  }

  deleteHead(obj: any) {
    return this.http.post(this.apiUrl + "Head/deleteHead", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //Session
  getSessionList(obj: any) {
    return this.http.post(this.apiUrl + "Session/SessionList", obj, { headers: this.headers })
  }

  saveSession(obj: any) {
    return this.http.post(this.apiUrl + "Session/saveSession", obj, { headers: this.headers })
  }

  deleteSession(obj: any) {
    return this.http.post(this.apiUrl + "Session/deleteSession", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //State
  getStateList(obj: any) {
    return this.http.post(this.apiUrl + "State/StateList", obj, { headers: this.headers })
  }

  saveState(obj: any) {
    return this.http.post(this.apiUrl + "State/saveState", obj, { headers: this.headers })
  }

  deleteState(obj: any) {
    return this.http.post(this.apiUrl + "State/deleteState", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //City
  getCityList(obj: any) {
    return this.http.post(this.apiUrl + "City/CityList", obj, { headers: this.headers })
  }

  saveCity(obj: any) {
    return this.http.post(this.apiUrl + "City/saveCity", obj, { headers: this.headers })
  }

  deleteCity(obj: any) {
    return this.http.post(this.apiUrl + "City/deleteCity", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //ClassNumber
  getClassNumberList(obj: any) {
    return this.http.post(this.apiUrl + "ClassNumber/ClassNumberList", obj, { headers: this.headers })
  }

  //Class
  getClassSectionList(obj: any) {
    return this.http.post(this.apiUrl + "Class/ClassSectionList", obj, { headers: this.headers })
  }

  getClassStreamList(obj: any) {
    return this.http.post(this.apiUrl + "Class/ClassStreamList", obj, { headers: this.headers })
  }

  getClassList(obj: any) {
    return this.http.post(this.apiUrl + "Class/ClassList", obj, { headers: this.headers })
  }

  getAllClassList(obj: any) {
    return this.http.post(this.apiUrl + "Class/AllClassList", obj, { headers: this.headers })
  }

  saveClass(obj: any) {
    return this.http.post(this.apiUrl + "Class/saveClass", obj, { headers: this.headers })
  }

  deleteClass(obj: any) {
    return this.http.post(this.apiUrl + "Class/deleteClass", obj, { headers: this.headers })
  }

  
  // Cashbook 
  getCashbookForEntry(obj: any) {
    return this.http.post(this.apiUrl + "Cashbook/CashbookForEntry", obj, { headers: this.headers })
  }
  getCashbookBankbookList(obj: any) {
    return this.http.post(this.apiUrl + "Cashbook/CashbookBankbookList", obj, { headers: this.headers })
  }
  getCashbookList(obj: any) {
    return this.http.post(this.apiUrl + "Cashbook/CashbookList", obj, { headers: this.headers })
  }

  saveCashbook(obj: any) {
    return this.http.post(this.apiUrl + "Cashbook/saveCashbook", obj, { headers: this.headers })
  }

  deleteCashbook(obj: any) {
    return this.http.post(this.apiUrl + "Cashbook/deleteCashbook", obj, { headers: this.headers })
  }

  // Transfer 
  getTransferList(obj: any) {
    return this.http.post(this.apiUrl + "Transfer/TransferList", obj, { headers: this.headers })
  }

  saveTransfer(obj: any) {
    return this.http.post(this.apiUrl + "Transfer/saveTransfer", obj, { headers: this.headers })
  }

  deleteTransfer(obj: any) {
    return this.http.post(this.apiUrl + "Transfer/deleteTransfer", obj, { headers: this.headers })
  }

  // License 
  checkLicense(obj: any) {
    return this.http.post(this.apiUrl + "License/CheckLicense", obj, { headers: this.headers })
  }

  saveLicense(obj: any) {
    return this.http.post(this.apiUrl + "License/saveLicense", obj, { headers: this.headers })
  }

   // Backup 
   getBackupList(obj: any) {
    return this.http.post(this.apiUrl + "Backup/BackupList", obj, { headers: this.headers })
  }

  saveBackup(obj: any) {
    return this.http.post(this.apiUrl + "Backup/saveBackup", obj, { headers: this.headers })
  }

  deleteBackup(obj: any) {
    return this.http.post(this.apiUrl + "Backup/deleteBackup", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //Section
  getSectionList(obj: any) {
    return this.http.post(this.apiUrl + "Section/SectionList", obj, { headers: this.headers })
  }

  saveSection(obj: any) {
    return this.http.post(this.apiUrl + "Section/saveSection", obj, { headers: this.headers })
  }

  deleteSection(obj: any) {
    return this.http.post(this.apiUrl + "Section/deleteSection", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */

  //PupilType
  getPupilTypeList(obj: any) {
    return this.http.post(this.apiUrl + "PupilType/PupilTypeList", obj, { headers: this.headers })
  }

  savePupilType(obj: any) {
    return this.http.post(this.apiUrl + "PupilType/savePupilType", obj, { headers: this.headers })
  }

  deletePupilType(obj: any) {
    return this.http.post(this.apiUrl + "PupilType/deletePupilType", obj, { headers: this.headers })
  }

  //PupilWaiveOff
  getPupilWaiveOffListforEntry(obj: any) {
    return this.http.post(this.apiUrl + "PupilWaiveOff/PupilWaiveOffListforEntry", obj, { headers: this.headers })
  }

  savePupilWaiveOff(obj: any) {
    return this.http.post(this.apiUrl + "PupilWaiveOff/savePupilWaiveOff", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */
  //FeeClass
  getAllFeeClassList(obj: any) {
    return this.http.post(this.apiUrl + "FeeClass/AllFeeClassList", obj, { headers: this.headers })
  }

  saveFeeClass(obj: any) {
    return this.http.post(this.apiUrl + "FeeClass/saveFeeClass", obj, { headers: this.headers })
  }

  /* ---------------------------------------------------------------------- */
  //FeeClassHead
  getAllFeeClassHeadList(obj: any) {
    return this.http.post(this.apiUrl + "FeeClassHead/AllFeeClassHeadList", obj, { headers: this.headers })
  }

  saveFeeClassHead(obj: any) {
    return this.http.post(this.apiUrl + "FeeClassHead/saveFeeClassHead", obj, { headers: this.headers })
  }

  //FeeAdmissionHead
  getFeeAdmissionHeadList(obj: any) {
    return this.http.post(this.apiUrl + "FeeAdmissionHead/FeeAdmissionHeadList", obj, { headers: this.headers })
  }

  saveFeeAdmissionHead(obj: any) {
    return this.http.post(this.apiUrl + "FeeAdmissionHead/saveFeeAdmissionHead", obj, { headers: this.headers })
  }

  deleteFeeAdmissionHead(obj: any) {
    return this.http.post(this.apiUrl + "FeeAdmissionHead/deleteFeeAdmissionHead", obj, { headers: this.headers })
  }
  //FeeAdmission
  getFeeAdmissionList(obj: any) {
    return this.http.post(this.apiUrl + "FeeAdmission/FeeAdmissionList", obj, { headers: this.headers })
  }

  saveFeeAdmission(obj: any) {
    return this.http.post(this.apiUrl + "FeeAdmission/saveFeeAdmission", obj, { headers: this.headers })
  }

  deleteFeeAdmission(obj: any) {
    return this.http.post(this.apiUrl + "FeeAdmission/deleteFeeAdmission", obj, { headers: this.headers })
  }
  /************************************Hostel*****************************************/
  //Hostel
  getHostelList(obj: any) {
    return this.http.post(this.apiUrl + "Hostel/HostelList", obj, { headers: this.headers })
  }
  saveHostel(obj: any) {
    return this.http.post(this.apiUrl + "Hostel/saveHostel", obj, { headers: this.headers })
  }
  deleteHostel(obj: any) {
    return this.http.post(this.apiUrl + "Hostel/deleteHostel", obj, { headers: this.headers })
  }
  //HostelRoom
  getHostelRoomList(obj: any) {
    return this.http.post(this.apiUrl + "HostelRoom/HostelRoomList", obj, { headers: this.headers })
  }
  saveHostelRoom(obj: any) {
    return this.http.post(this.apiUrl + "HostelRoom/saveHostelRoom", obj, { headers: this.headers })
  }
  deleteHostelRoom(obj: any) {
    return this.http.post(this.apiUrl + "HostelRoom/deleteHostelRoom", obj, { headers: this.headers })
  }
  //FeeHostelHead
  getFeeHostelHeadList(obj: any) {
    return this.http.post(this.apiUrl + "FeeHostelHead/FeeHostelHeadList", obj, { headers: this.headers })
  }
  saveFeeHostelHead(obj: any) {
    return this.http.post(this.apiUrl + "FeeHostelHead/saveFeeHostelHead", obj, { headers: this.headers })
  }

  //FeeHostel
  getFeeHostelList(obj: any) {
    return this.http.post(this.apiUrl + "FeeHostel/FeeHostelList", obj, { headers: this.headers })
  }
  saveFeeHostel(obj: any) {
    return this.http.post(this.apiUrl + "FeeHostel/saveFeeHostel", obj, { headers: this.headers })
  }
  deleteFeeHostel(obj: any) {
    return this.http.post(this.apiUrl + "FeeHostel/deleteFeeHostel", obj, { headers: this.headers })
  }

  //HostelDuration
  getHostelDurationList(obj: any) {
    return this.http.post(this.apiUrl + "HostelDuration/HostelDurationList", obj, { headers: this.headers })
  }
  saveHostelDuration(obj: any) {
    return this.http.post(this.apiUrl + "HostelDuration/saveHostelDuration", obj, { headers: this.headers })
  }
  deleteHostelDuration(obj: any) {
    return this.http.post(this.apiUrl + "HostelDuration/deleteHostelDuration", obj, { headers: this.headers })
  }

  //HostelPupil
  getHostelPupilList(obj: any) {
    return this.http.post(this.apiUrl + "HostelPupil/HostelPupilList", obj, { headers: this.headers })
  }
  saveHostelPupil(obj: any) {
    return this.http.post(this.apiUrl + "HostelPupil/saveHostelPupil", obj, { headers: this.headers })
  }
  deleteHostelPupil(obj: any) {
    return this.http.post(this.apiUrl + "HostelPupil/deleteHostelPupil", obj, { headers: this.headers })
  }


  /************************************Transport*****************************************/
  //TransportBatch
  getTransportBatchList(obj: any) {
    return this.http.post(this.apiUrl + "TransportBatch/TransportBatchList", obj, { headers: this.headers })
  }
  saveTransportBatch(obj: any) {
    return this.http.post(this.apiUrl + "TransportBatch/saveTransportBatch", obj, { headers: this.headers })
  }
  deleteTransportBatch(obj: any) {
    return this.http.post(this.apiUrl + "TransportBatch/deleteTransportBatch", obj, { headers: this.headers })
  }

  //TransportDuration
  getTransportDurationList(obj: any) {
    return this.http.post(this.apiUrl + "TransportDuration/TransportDurationList", obj, { headers: this.headers })
  }
  saveTransportDuration(obj: any) {
    return this.http.post(this.apiUrl + "TransportDuration/saveTransportDuration", obj, { headers: this.headers })
  }
  deleteTransportDuration(obj: any) {
    return this.http.post(this.apiUrl + "TransportDuration/deleteTransportDuration", obj, { headers: this.headers })
  }

  //TransportPupil
  getTransportPupilList(obj: any) {
    return this.http.post(this.apiUrl + "TransportPupil/TransportPupilList", obj, { headers: this.headers })
  }
  saveTransportPupil(obj: any) {
    return this.http.post(this.apiUrl + "TransportPupil/saveTransportPupil", obj, { headers: this.headers })
  }
  deleteTransportPupil(obj: any) {
    return this.http.post(this.apiUrl + "TransportPupil/deleteTransportPupil", obj, { headers: this.headers })
  }

  //Vehicle
  getVehicleList(obj: any) {
    return this.http.post(this.apiUrl + "Vehicle/VehicleList", obj, { headers: this.headers })
  }
  saveVehicle(obj: any) {
    return this.http.post(this.apiUrl + "Vehicle/saveVehicle", obj, { headers: this.headers })
  }
  deleteVehicle(obj: any) {
    return this.http.post(this.apiUrl + "Vehicle/deleteVehicle", obj, { headers: this.headers })
  }

  //VehicleType
  getVehicleTypeList(obj: any) {
    return this.http.post(this.apiUrl + "VehicleType/VehicleTypeList", obj, { headers: this.headers })
  }
  saveVehicleType(obj: any) {
    return this.http.post(this.apiUrl + "VehicleType/saveVehicleType", obj, { headers: this.headers })
  }
  deleteVehicleType(obj: any) {
    return this.http.post(this.apiUrl + "VehicleType/deleteVehicleType", obj, { headers: this.headers })
  }

  //FeeTransportHead
  getFeeTransportHeadList(obj: any) {
    return this.http.post(this.apiUrl + "FeeTransportHead/FeeTransportHeadList", obj, { headers: this.headers })
  }
  saveFeeTransportHead(obj: any) {
    return this.http.post(this.apiUrl + "FeeTransportHead/saveFeeTransportHead", obj, { headers: this.headers })
  }

  //FeeTransport
  getFeeTransportList(obj: any) {
    return this.http.post(this.apiUrl + "FeeTransport/FeeTransportList", obj, { headers: this.headers })
  }
  saveFeeTransport(obj: any) {
    return this.http.post(this.apiUrl + "FeeTransport/saveFeeTransport", obj, { headers: this.headers })
  }
  deleteFeeTransport(obj: any) {
    return this.http.post(this.apiUrl + "FeeTransport/deleteFeeTransport", obj, { headers: this.headers })
  }

  //Pupil
  getPupil(obj: any) {
    return this.http.post(this.apiUrl + "Pupil/GetPupil", obj, { headers: this.headers })
  }
  getPupilList(obj: any) {
    return this.http.post(this.apiUrl + "Pupil/PupilList", obj, { headers: this.headers })
  }
  getAllSearchPupilList(obj: any) {
    return this.http.post(this.apiUrl + "Pupil/AllSearchPupilList", obj, { headers: this.headers })
  }
  getSearchPupilList(obj: any) {
    return this.http.post(this.apiUrl + "Pupil/SearchPupilList", obj, { headers: this.headers })
  }

  getPupilDetail(obj: any) {
    return this.http.post(this.apiUrl + "Pupil/PupilDetail", obj, { headers: this.headers });
  }

  savePupil(obj: any) {
    return this.http.post(this.apiUrl + "Pupil/savePupil", obj, { headers: this.headers })
  }

  updatePupil(obj: any) {
    return this.http.post(this.apiUrl + "Pupil/UpdatePupil", obj, { headers: this.headers })
  }

  savePupilPhoto(obj: any) {
    return this.http.post(this.apiUrl + "Pupil/savePupilPhoto", obj, { headers: this.headers });
  }


  deletePupil(obj: any) {
    return this.http.post(this.apiUrl + "Pupil/deletePupil", obj, { headers: this.headers })
  }

  getAdmissionRollNo(obj: any) {
    return this.http.post(this.apiUrl + "Pupil/AdmissionRollNo", obj, { headers: this.headers })
  }

  //PupilCharge
  getPupilChargeList(obj: any) {
    return this.http.post(this.apiUrl + "PupilCharge/PupilChargeList", obj, { headers: this.headers })
  }

  savePupilCharge(obj: any) {
    return this.http.post(this.apiUrl + "PupilCharge/savePupilCharge", obj, { headers: this.headers })
  }

  deletePupilCharge(obj: any) {
    return this.http.post(this.apiUrl + "PupilCharge/deletePupilCharge", obj, { headers: this.headers })
  }

  //Fee Registration
  getFeeRegistrationList(obj: any) {
    return this.http.post(this.apiUrl + "FeeRegistration/FeeRegistrationList", obj, { headers: this.headers })
  }
  saveFeeRegistration(obj: any) {
    return this.http.post(this.apiUrl + "FeeRegistration/SaveFeeRegistration", obj, { headers: this.headers })
  }

  //Fee Registration Head
  getFeeRegistrationHeadList(obj: any) {
    return this.http.post(this.apiUrl + "FeeRegistrationHead/FeeRegistrationHeadList", obj, { headers: this.headers })
  }

  saveFeeRegistrationHead(obj: any) {
    return this.http.post(this.apiUrl + "FeeRegistrationHead/saveFeeRegistrationHead", obj, { headers: this.headers })
  }

  //StaffClass
  getStaffClassList(obj: any) {
    return this.http.post(this.apiUrl + "StaffClass/StaffClassList", obj, { headers: this.headers })
  }

  saveStaffClass(obj: any) {
    return this.http.post(this.apiUrl + "StaffClass/saveStaffClass", obj, { headers: this.headers })
  }

  deleteStaffClass(obj: any) {
    return this.http.post(this.apiUrl + "StaffClass/deleteStaffClass", obj, { headers: this.headers })
  }

  //RegistrationForm
  getRegistrationFormList(obj: any) {
    return this.http.post(this.apiUrl + "RegistrationForm/RegistrationFormList", obj, { headers: this.headers })
  }

  saveRegistrationForm(obj: any) {
    return this.http.post(this.apiUrl + "RegistrationForm/saveRegistrationForm", obj, { headers: this.headers })
  }

  deleteRegistrationForm(obj: any) {
    return this.http.post(this.apiUrl + "RegistrationForm/deleteRegistrationForm", obj, { headers: this.headers })
  }

  //PupilLeft
  getPupilLeftList(obj: any) {
    return this.http.post(this.apiUrl + "PupilLeft/PupilLeftList", obj, { headers: this.headers })
  }
  savePupilLeft(obj: any) {
    return this.http.post(this.apiUrl + "PupilLeft/savePupilLeft", obj, { headers: this.headers })
  }
  deletePupilLeft(obj: any) {
    return this.http.post(this.apiUrl + "PupilLeft/deletePupilLeft", obj, { headers: this.headers })
  }
  rejoinPupil(obj: any) {
    return this.http.post(this.apiUrl + "PupilLeft/RejoinPupil", obj, { headers: this.headers })
  }

}
