import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { ToastrModule } from 'ngx-toastr';
import { MaterialModule } from './modules/material.module';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppService } from "./utils/app.service";
import { AppComponent } from './app.component';
import { AdminMasterComponent } from './components/admin/admin-master/admin-master.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { PageNotFoundComponent } from './components/others/page-not-found/page-not-found.component';
import { ProgressComponent } from './components/others/progress/progress.component';
import { DesignationComponent } from './components/staff-management/designation/designation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DepartmentComponent } from './components/staff-management/department/department.component';
import { StaffComponent } from './components/staff-management/staff/staff.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { StaffLoginComponent } from './components/role-task-management/staff-login/staff-login.component';
import { SchoolComponent } from './components/master/school/school.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { PageGroupComponent } from './components/role-task-management/page-group/page-group.component';
import { PageComponent } from './components/role-task-management/page/page.component';
import { MenuComponent } from './components/role-task-management/menu/menu.component';
import { RoleComponent } from './components/role-task-management/role/role.component';
import { RoleMenuComponent } from './components/role-task-management/role-menu/role-menu.component';
import { NgxPaginationModule } from "ngx-pagination";
import { HeadComponent } from './components/fee-management/head/head.component';
import { SessionComponent } from './components/master/session/session.component';
import { StateComponent } from './components/master/state/state.component';
import { CityComponent } from './components/master/city/city.component';
import { ClassComponent } from './components/admission/class/class.component';
import { SectionComponent } from './components/master/section/section.component';
import { PupilTypeComponent } from './components/pupil-detail/pupil-type/pupil-type.component';
import { FeeAdmissionHeadComponent } from './components/admission/fee-admission-head/fee-admission-head.component';
import { FeeAdmissionComponent } from './components/admission/fee-admission/fee-admission.component';
import { FeeClassHeadComponent } from './components/fee-management/fee-class-head/fee-class-head.component';
import { FeeClassComponent } from './components/fee-management/fee-class/fee-class.component';
import { PupilWaiveOffComponent } from './components/pupil-detail/pupil-waive-off/pupil-waive-off.component';
import { FeePaymentComponent } from './components/fee-management/fee-payment/fee-payment.component';
import { VehicleTypeComponent } from './components/transport-management/vehicle-type/vehicle-type.component';
import { VehicleComponent } from './components/transport-management/vehicle/vehicle.component';
import { TransportDurationComponent } from './components/transport-management/transport-duration/transport-duration.component';
import { TransportPupilComponent } from './components/transport-management/transport-pupil/transport-pupil.component';
import { TransportBatchComponent } from './components/transport-management/transport-batch/transport-batch.component';
import { NewAdmissionComponent } from './components/admission/new-admission/new-admission.component';
import { AdmissionListComponent } from './components/pupil-detail/admission-list/admission-list.component';
import { PupilChargeComponent } from './components/pupil-detail/pupil-charge/pupil-charge.component';
import { FeeTransportHeadComponent } from './components/transport-management/fee-transport-head/fee-transport-head.component';
import { FeeTransportComponent } from './components/transport-management/fee-transport/fee-transport.component';
import { StaffClassComponent } from './components/role-task-management/staff-class/staff-class.component';
import { RegistrationFormComponent } from './components/registration/registration-form/registration-form.component';
import { FeePaymentListComponent } from './components/fee-management/fee-payment-list/fee-payment-list.component';
import { FeePaymentListPupilwiseComponent } from './components/fee-management/fee-payment-list-pupilwise/fee-payment-list-pupilwise.component';
import { FeeDueListComponent } from './components/fee-management/fee-due-list/fee-due-list.component';
import { ChangePasswordComponent } from './components/admin/change-password/change-password.component';
import { PupilPromotionComponent } from './components/pupil-detail/pupil-promotion/pupil-promotion.component';
import { RegistrationFormListComponent } from './components/registration/registration-form-list/registration-form-list.component';
import { MoneyPipe } from './pipes/money.pipe';
import { EnumCasePipe } from './pipes/enum-case.pipe';
import { FeeRegistrationHeadComponent } from './components/registration/fee-registration-head/fee-registration-head.component';
import { RegistrationComponent } from './components/registration/registration/registration.component';
import { StreamComponent } from './components/master/stream/stream.component';
import { ExamComponent } from './components/examination-result/exam/exam.component';
import { SubjectComponent } from './components/examination-result/subject/subject.component';
import { ClassSubjectComponent } from './components/examination-result/class-subject/class-subject.component';
import { AdmitCardComponent } from './components/examination-result/admit-card/admit-card.component';
import { AdmitCardListComponent } from './components/examination-result/admit-card-list/admit-card-list.component';
import { PupilAdmitCardComponent } from './components/examination-result/pupil-admit-card/pupil-admit-card.component';
import { GradeGroupComponent } from './components/examination-result/grade-group/grade-group.component';
import { ClassExamComponent } from './components/examination-result/class-exam/class-exam.component';
import { FullMarkComponent } from './components/examination-result/full-mark/full-mark.component';
import { PupilSubjectComponent } from './components/examination-result/pupil-subject/pupil-subject.component';
import { PupilSubjectClasswiseComponent } from './components/examination-result/pupil-subject-classwise/pupil-subject-classwise.component';
import { MarksEntryComponent } from './components/examination-result/marks-entry/marks-entry.component';
import { WeightageComponent } from './components/examination-result/weightage/weightage.component';
import { PupilProfileComponent } from './components/pupil-detail/pupil-profile/pupil-profile.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { GradingSystemComponent } from './components/examination-result/grading-system/grading-system.component';
import { SubjectGradingComponent } from './components/examination-result/subject-grading/subject-grading.component';
import { GradeEntryComponent } from './components/examination-result/grade-entry/grade-entry.component';
import { WorkingDayComponent } from './components/examination-result/working-day/working-day.component';
import { PupilAttendanceComponent } from './components/examination-result/pupil-attendance/pupil-attendance.component';
import { GenerateMarksheetComponent } from './components/examination-result/generate-marksheet/generate-marksheet.component';
import { TeacherRemarksEntryComponent } from './components/examination-result/teacher-remarks-entry/teacher-remarks-entry.component';
import { RankerListComponent } from './components/examination-result/ranker-list/ranker-list.component';
import { CrossReportComponent } from './components/examination-result/cross-report/cross-report.component';
import { HostelComponent } from './components/hostel-management/hostel/hostel.component';
import { HostelRoomComponent } from './components/hostel-management/hostel-room/hostel-room.component';
import { HostelDurationComponent } from './components/hostel-management/hostel-duration/hostel-duration.component';
import { FeeHostelHeadComponent } from './components/hostel-management/fee-hostel-head/fee-hostel-head.component';
import { FeeHostelComponent } from './components/hostel-management/fee-hostel/fee-hostel.component';
import { HostelPupilComponent } from './components/hostel-management/hostel-pupil/hostel-pupil.component';
import { FeeRegistrationComponent } from './components/registration/fee-registration/fee-registration.component';
import { ExpenseCategoryComponent } from './components/expense/expense-category/expense-category.component';
import { ExpenseHeadComponent } from './components/expense/expense-head/expense-head.component';
import { ExpenseComponent } from './components/expense/expense/expense.component';
import { CharacterCertificateComponent } from './components/certificate/character-certificate/character-certificate.component';
import { TransferCertificateComponent } from './components/certificate/transfer-certificate/transfer-certificate.component';
import { ExpenseHistoryComponent } from './components/expense/expense-history/expense-history.component';
import { CharacterCertificateListComponent } from './components/certificate/character-certificate-list/character-certificate-list.component';
import { TransferCertificateListComponent } from './components/certificate/transfer-certificate-list/transfer-certificate-list.component';
import { PupilLeftComponent } from './components/pupil-detail/pupil-left/pupil-left.component';
import { PupilLeftListComponent } from './components/pupil-detail/pupil-left-list/pupil-left-list.component';
import { ExpenseIncomeListComponent } from './components/expense/expense-income-list/expense-income-list.component';
import { FeePaymentEditComponent } from './components/fee-management/fee-payment-edit/fee-payment-edit.component';
import { YearlyCollectionReportComponent } from './components/fee-management/yearly-collection-report/yearly-collection-report.component';
import { ClassPromotionComponent } from './components/pupil-detail/class-promotion/class-promotion.component';
import { RegistrationListComponent } from './components/registration/registration-list/registration-list.component';
import { FilterPipe } from './pipes/filter.pipe';
import { OrderByPipe } from './pipes/order-by.pipe';
import { AccountComponent } from './components/master/account/account.component';
import { AccountCollectionReportComponent } from './components/fee-management/account-collection-report/account-collection-report.component';
import { MiscellaneousPaymentComponent } from './components/fee-management/miscellaneous-payment/miscellaneous-payment.component';
import { TransferComponent } from './components/fee-management/transfer/transfer.component';
import { TransferListComponent } from './components/fee-management/transfer-list/transfer-list.component';
import { CloseCounterComponent } from './components/fee-management/close-counter/close-counter.component';
import { ClosingListComponent } from './components/fee-management/closing-list/closing-list.component';
import { CashbookComponent } from './components/fee-management/cashbook/cashbook.component';
import { RoleDashboardComponent } from './components/role-task-management/role-dashboard/role-dashboard.component';
import { ShortcutComponent } from './components/role-task-management/shortcut/shortcut.component';
import { DashboardComponent } from './components/role-task-management/dashboard/dashboard.component';
import { BackupComponent } from './components/setting/backup/backup.component';
import { LicenseComponent } from './components/setting/license/license.component';
import { PdfHeaderComponent } from './pdf-config/pdf-header/pdf-header.component';
import { PdfContainerComponent } from './pdf-config/pdf-container/pdf-container.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ManufacturerComponent } from './components/stock-management/manufacturer/manufacturer.component';
import { UnitComponent } from './components/stock-management/unit/unit.component';
import { SupplierComponent } from './components/stock-management/supplier/supplier.component';
import { PurchaseComponent } from './components/stock-management/purchase/purchase.component';
import { PurchaseListComponent } from './components/stock-management/purchase-list/purchase-list.component';
import { ProductHistoryComponent } from './components/stock-management/product-history/product-history.component';
import { ProductIssueListComponent } from './components/stock-management/product-issue-list/product-issue-list.component';
import { ProductStockComponent } from './components/stock-management/product-stock/product-stock.component';
import { ProductIssueComponent } from './components/stock-management/product-issue/product-issue.component';
import { ProductComponent } from './components/stock-management/product/product.component';
import { RackComponent } from './components/library/rack/rack.component';
import { BookTypeComponent } from './components/library/book-type/book-type.component';
import { BookComponent } from './components/library/book/book.component';
import { BookIssueListComponent } from './components/library/book-issue-list/book-issue-list.component';
import { BookStockComponent } from './components/library/book-stock/book-stock.component';
import { BookIssueComponent } from './components/library/book-issue/book-issue.component';
import { LibraryBarCodeComponent } from './components/library/library-bar-code/library-bar-code.component';
import { PurchaseBookComponent } from './components/library/purchase-book/purchase-book.component';
import { PurchaseBookListComponent } from './components/library/purchase-book-list/purchase-book-list.component';
import { BookReturnComponent } from './components/library/book-return/book-return.component';
import { BookIssueReturnHistoryComponent } from './components/library/book-issue-return-history/book-issue-return-history.component';
import { TrainingCertificateComponent } from './components/certificate/training-certificate/training-certificate.component';
import { TrainingCertificateListComponent } from './components/certificate/training-certificate-list/training-certificate-list.component';

const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};


@NgModule({
  declarations: [
    AppComponent,
    AdminMasterComponent,
    AdminDashboardComponent,
    PageNotFoundComponent,
    ProgressComponent,
    DesignationComponent,
    DepartmentComponent,
    StaffComponent,
    StaffLoginComponent,
    SchoolComponent,
    AdminLoginComponent,
    PageGroupComponent,
    PageComponent,
    MenuComponent,
    RoleComponent,
    RoleMenuComponent,
    HeadComponent,
    SessionComponent,
    StateComponent,
    CityComponent,
    ClassComponent,
    SectionComponent,
    PupilTypeComponent,
    FeeAdmissionHeadComponent,
    FeeAdmissionComponent,
    FeeClassHeadComponent,
    FeeClassComponent,
    PupilWaiveOffComponent,
    FeePaymentComponent,
    VehicleTypeComponent,
    VehicleComponent,
    TransportDurationComponent,
    TransportPupilComponent,
    TransportBatchComponent,
    NewAdmissionComponent,
    AdmissionListComponent,
    PupilChargeComponent,
    FeeTransportHeadComponent,
    FeeTransportComponent,
    StaffClassComponent,
    RegistrationFormComponent,
    FeePaymentListComponent,
    FeePaymentListPupilwiseComponent,
    FeeDueListComponent,
    ChangePasswordComponent,
    PupilPromotionComponent,
    RegistrationFormListComponent,
    MoneyPipe,
    EnumCasePipe,
    FeeRegistrationHeadComponent,
    RegistrationComponent,
    StreamComponent,
    ExamComponent,
    SubjectComponent,
    ClassSubjectComponent,
    AdmitCardComponent,
    AdmitCardListComponent,
    PupilAdmitCardComponent,
    GradeGroupComponent,
    ClassExamComponent,
    FullMarkComponent,
    PupilSubjectComponent,
    PupilSubjectClasswiseComponent,
    MarksEntryComponent,
    WeightageComponent,
    PupilProfileComponent,
    GradingSystemComponent,
    SubjectGradingComponent,
    GradeEntryComponent,
    WorkingDayComponent,
    PupilAttendanceComponent,
    GenerateMarksheetComponent,
    TeacherRemarksEntryComponent,
    RankerListComponent,
    CrossReportComponent,
    HostelComponent,
    HostelRoomComponent,
    HostelDurationComponent,
    FeeHostelHeadComponent,
    FeeHostelComponent,
    HostelPupilComponent,
    FeeRegistrationComponent,
    ExpenseCategoryComponent,
    ExpenseHeadComponent,
    ExpenseComponent,
    CharacterCertificateComponent,
    TransferCertificateComponent,
    ExpenseHistoryComponent,
    CharacterCertificateListComponent,
    TransferCertificateListComponent,
    PupilLeftComponent,
    PupilLeftListComponent,
    ExpenseIncomeListComponent,
    FeePaymentEditComponent,
    YearlyCollectionReportComponent,
    ClassPromotionComponent,
    RegistrationListComponent,
    FilterPipe,
    OrderByPipe,
    AccountComponent,
    AccountCollectionReportComponent,
    MiscellaneousPaymentComponent,
    TransferComponent,
    TransferListComponent,
    CloseCounterComponent,
    ClosingListComponent,
    CashbookComponent,
    RoleDashboardComponent,
    ShortcutComponent,
    DashboardComponent,
    BackupComponent,
    LicenseComponent,
    PdfHeaderComponent,
    PdfContainerComponent,
    ManufacturerComponent,
    UnitComponent,
    SupplierComponent,
    PurchaseComponent,
    PurchaseListComponent,
    ProductHistoryComponent,
    ProductIssueListComponent,
    ProductStockComponent,
    ProductIssueComponent,
    ProductComponent,
    RackComponent,
    BookTypeComponent,
    BookComponent,
    BookIssueListComponent,
    BookStockComponent,
    BookIssueComponent,
    LibraryBarCodeComponent,
    PurchaseBookComponent,
    PurchaseBookListComponent,
    BookReturnComponent,
    BookIssueReturnHistoryComponent,
    TrainingCertificateComponent,
    TrainingCertificateListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    NgxPaginationModule,
    EditorModule,
    ImageCropperModule,
    NgbModule,
    PdfViewerModule
  ],
  
  providers: [AppService, { provide: LocationStrategy, useClass: HashLocationStrategy },
    // { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
