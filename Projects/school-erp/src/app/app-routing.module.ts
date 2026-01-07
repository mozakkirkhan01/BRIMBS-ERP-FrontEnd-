import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMasterComponent } from './components/admin/admin-master/admin-master.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { PageNotFoundComponent } from './components/others/page-not-found/page-not-found.component';
import { DesignationComponent } from './components/staff-management/designation/designation.component';
import { DepartmentComponent } from './components/staff-management/department/department.component';
import { StaffComponent } from './components/staff-management/staff/staff.component';
import { StaffLoginComponent } from './components/role-task-management/staff-login/staff-login.component';
import { SchoolComponent } from './components/master/school/school.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { PageGroupComponent } from './components/role-task-management/page-group/page-group.component';
import { PageComponent } from './components/role-task-management/page/page.component';
import { MenuComponent } from './components/role-task-management/menu/menu.component';
import { RoleComponent } from './components/role-task-management/role/role.component';
import { RoleMenuComponent } from './components/role-task-management/role-menu/role-menu.component';
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
import { TransportBatchComponent } from './components/transport-management/transport-batch/transport-batch.component';
import { TransportPupilComponent } from './components/transport-management/transport-pupil/transport-pupil.component';
import { TransportDurationComponent } from './components/transport-management/transport-duration/transport-duration.component';
import { VehicleComponent } from './components/transport-management/vehicle/vehicle.component';
import { VehicleTypeComponent } from './components/transport-management/vehicle-type/vehicle-type.component';
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
import { ExpenseHistoryComponent } from './components/expense/expense-history/expense-history.component';
import { CharacterCertificateComponent } from './components/certificate/character-certificate/character-certificate.component';
import { TransferCertificateComponent } from './components/certificate/transfer-certificate/transfer-certificate.component';
import { CharacterCertificateListComponent } from './components/certificate/character-certificate-list/character-certificate-list.component';
import { TransferCertificateListComponent } from './components/certificate/transfer-certificate-list/transfer-certificate-list.component';
import { PupilLeftComponent } from './components/pupil-detail/pupil-left/pupil-left.component';
import { PupilLeftListComponent } from './components/pupil-detail/pupil-left-list/pupil-left-list.component';
import { ExpenseIncomeListComponent } from './components/expense/expense-income-list/expense-income-list.component';
import { FeePaymentEditComponent } from './components/fee-management/fee-payment-edit/fee-payment-edit.component';
import { YearlyCollectionReportComponent } from './components/fee-management/yearly-collection-report/yearly-collection-report.component';
import { ClassPromotionComponent } from './components/pupil-detail/class-promotion/class-promotion.component';
import { RegistrationListComponent } from './components/registration/registration-list/registration-list.component';
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
import { LicenseComponent } from './components/setting/license/license.component';
import { BackupComponent } from './components/setting/backup/backup.component';
import { PdfContainerComponent } from './pdf-config/pdf-container/pdf-container.component';
import { UnitComponent } from './components/stock-management/unit/unit.component';
import { ManufacturerComponent } from './components/stock-management/manufacturer/manufacturer.component';
import { SupplierComponent } from './components/stock-management/supplier/supplier.component';
import { PurchaseComponent } from './components/stock-management/purchase/purchase.component';
import { PurchaseListComponent } from './components/stock-management/purchase-list/purchase-list.component';
import { ProductIssueComponent } from './components/stock-management/product-issue/product-issue.component';
import { ProductIssueListComponent } from './components/stock-management/product-issue-list/product-issue-list.component';
import { ProductHistoryComponent } from './components/stock-management/product-history/product-history.component';
import { ProductStockComponent } from './components/stock-management/product-stock/product-stock.component';
import { ProductComponent } from './components/stock-management/product/product.component';
import { RackComponent } from './components/library/rack/rack.component';
import { BookTypeComponent } from './components/library/book-type/book-type.component';
import { BookComponent } from './components/library/book/book.component';
import { LibraryBarCodeComponent } from './components/library/library-bar-code/library-bar-code.component';
import { BookIssueComponent } from './components/library/book-issue/book-issue.component';
import { BookIssueListComponent } from './components/library/book-issue-list/book-issue-list.component';
import { BookStockComponent } from './components/library/book-stock/book-stock.component';
import { PurchaseBookComponent } from './components/library/purchase-book/purchase-book.component';
import { PurchaseBookListComponent } from './components/library/purchase-book-list/purchase-book-list.component';
import { BookReturnComponent } from './components/library/book-return/book-return.component';
import { BookIssueReturnHistoryComponent } from './components/library/book-issue-return-history/book-issue-return-history.component';
import { TrainingCertificateComponent } from './components/certificate/training-certificate/training-certificate.component';
import { TrainingCertificateListComponent } from './components/certificate/training-certificate-list/training-certificate-list.component';

const routes: Routes = [
  { path: '', redirectTo: "/admin-login", pathMatch: 'full' },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'license', component: LicenseComponent },
  { path: 'pdf-container', component: PdfContainerComponent },
  {
    path: 'admin', component: AdminMasterComponent, children: [
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'backup', component: BackupComponent },

      //Admission
      { path: 'class', component: ClassComponent },
      { path: 'session', component: SessionComponent },
      { path: 'section', component: SectionComponent },
      { path: 'new-admission', component: NewAdmissionComponent },
      { path: 'new-admission/:id', component: NewAdmissionComponent },
      
      //pupil Management
      { path: 'pupil-promotion', component: PupilPromotionComponent },
      { path: 'pupil-profile', component: PupilProfileComponent },
      { path: 'pupil-profile/:id', component: PupilProfileComponent },
      { path: 'pupil-type', component: PupilTypeComponent },
      { path: 'admission-list', component: AdmissionListComponent },
      { path: 'pupil-left', component: PupilLeftComponent },
      { path: 'pupil-left/:id', component: PupilLeftComponent },
      { path: 'pupil-left-list', component: PupilLeftListComponent },
      { path: 'pupil-waive-off', component: PupilWaiveOffComponent },
      { path: 'pupil-charge', component: PupilChargeComponent },
      { path: 'class-promotion', component: ClassPromotionComponent },

      //Master Entry
      { path: 'head', component: HeadComponent },
      { path: 'state', component: StateComponent },
      { path: 'city', component: CityComponent },
      { path: 'school', component: SchoolComponent },
      { path: 'account', component: AccountComponent },

      //Staff Management
      { path: 'designation', component: DesignationComponent },
      { path: 'department', component: DepartmentComponent },
      { path: 'staff', component: StaffComponent },

      //Role & Task
      { path: 'staffLogin', component: StaffLoginComponent },
      { path: 'staff-class', component: StaffClassComponent },
      { path: 'page-group', component: PageGroupComponent },
      { path: 'page', component: PageComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'role', component: RoleComponent },
      { path: 'role-menu', component: RoleMenuComponent },
      { path: 'role-menu/:id', component: RoleMenuComponent },
      { path: 'role-dashboard', component: RoleDashboardComponent },
      { path: 'role-dashboard/:id', component: RoleDashboardComponent },
      { path: 'shortcut', component: ShortcutComponent },
      { path: 'dashboard', component: DashboardComponent },

      //Registration
      { path: 'fee-registration-head', component: FeeRegistrationHeadComponent },
      { path: 'fee-registration', component: FeeRegistrationComponent },
      { path: 'registration', component: RegistrationComponent },
      { path: 'registration/:id', component: RegistrationComponent },
      { path: 'registration-list', component: RegistrationListComponent },
      { path: 'registration-form', component: RegistrationFormComponent },
      { path: 'registration-form/:id', component: RegistrationFormComponent },
      { path: 'registration-form-list', component: RegistrationFormListComponent },

      //Fee
      { path: 'fee-admission-head', component: FeeAdmissionHeadComponent },
      { path: 'fee-admission', component: FeeAdmissionComponent },
      { path: 'fee-class-head', component: FeeClassHeadComponent },
      { path: 'fee-class', component: FeeClassComponent },
      { path: 'fee-payment', component: FeePaymentComponent },
      { path: 'miscellaneous-payment', component: MiscellaneousPaymentComponent },
      { path: 'fee-payment-list', component: FeePaymentListComponent },
      { path: 'fee-payment-list/:id', component: FeePaymentListComponent },
      { path: 'fee-due-list', component: FeeDueListComponent },
      { path: 'fee-payment-list-pupilwise', component: FeePaymentListPupilwiseComponent },
      { path: 'fee-payment-edit', component: FeePaymentEditComponent },
      { path: 'fee-payment-edit/:id', component: FeePaymentEditComponent },
      { path: 'yearly-collection-report/:id', component: YearlyCollectionReportComponent },
      { path: 'account-collection-report', component: AccountCollectionReportComponent },
      { path: 'transfer', component: TransferComponent },
      { path: 'transfer/:id', component: TransferComponent },
      { path: 'transfer-list', component: TransferListComponent },
      { path: 'close-counter', component: CloseCounterComponent },
      { path: 'closing-list', component: ClosingListComponent },
      { path: 'cashbook', component: CashbookComponent },


      //Transport
      { path: 'vehicle-type', component: VehicleTypeComponent },
      { path: 'vehicle', component: VehicleComponent },
      { path: 'transport-batch', component: TransportBatchComponent },
      { path: 'transport-duration', component: TransportDurationComponent },
      { path: 'fee-transport-head', component: FeeTransportHeadComponent },
      { path: 'fee-transport', component: FeeTransportComponent },
      { path: 'transport-pupil', component: TransportPupilComponent },

      //Hostel
      { path: 'hostel', component: HostelComponent },
      { path: 'hostel-room', component: HostelRoomComponent },
      { path: 'hostel-duration', component: HostelDurationComponent },
      { path: 'fee-hostel-head', component: FeeHostelHeadComponent },
      { path: 'fee-hostel', component: FeeHostelComponent },
      { path: 'hostel-pupil', component: HostelPupilComponent },

      //Result
      { path: 'stream', component: StreamComponent },
      { path: 'exam', component: ExamComponent },
      { path: 'subject', component: SubjectComponent },
      { path: 'class-subject', component: ClassSubjectComponent },
      { path: 'admit-card', component: AdmitCardComponent },
      { path: 'admit-card/:id', component: AdmitCardComponent },
      { path: 'admit-card-list', component: AdmitCardListComponent },
      { path: 'pupil-admit-card', component: PupilAdmitCardComponent },
      { path: 'grade-group', component: GradeGroupComponent },
      { path: 'class-exam', component: ClassExamComponent },
      { path: 'full-mark', component: FullMarkComponent },
      { path: 'pupil-subject', component: PupilSubjectComponent },
      { path: 'pupil-subject-classwise', component: PupilSubjectClasswiseComponent },
      { path: 'marks-entry', component: MarksEntryComponent },
      { path: 'weightage', component: WeightageComponent },
      { path: 'grading-system', component: GradingSystemComponent },
      { path: 'subject-grading', component: SubjectGradingComponent },
      { path: 'grade-entry', component: GradeEntryComponent },
      { path: 'working-day', component: WorkingDayComponent },
      { path: 'pupil-attendance', component: PupilAttendanceComponent },
      { path: 'generate-marksheet', component: GenerateMarksheetComponent },
      { path: 'generate-marksheet/:id', component: GenerateMarksheetComponent },
      { path: 'teacher-remarks-entry', component: TeacherRemarksEntryComponent },
      { path: 'ranker-list', component: RankerListComponent },
      { path: 'cross-report', component: CrossReportComponent },

      //Expense
      { path: 'expense-category', component: ExpenseCategoryComponent },
      { path: 'expense-head', component: ExpenseHeadComponent },
      { path: 'expense', component: ExpenseComponent},
      { path: 'expense/:id', component: ExpenseComponent},
      { path: 'expense-history', component: ExpenseHistoryComponent},
      { path: 'expense-income-list', component: ExpenseIncomeListComponent},

      //Certificate
      { path: 'character-certificate', component: CharacterCertificateComponent },
      { path: 'character-certificate/:id', component: CharacterCertificateComponent },
      { path: 'character-certificate-list', component: CharacterCertificateListComponent },
      { path: 'transfer-certificate', component: TransferCertificateComponent },
      { path: 'transfer-certificate/:id', component: TransferCertificateComponent },
      { path: 'transfer-certificate-list', component: TransferCertificateListComponent },
      { path: 'training-certificate', component: TrainingCertificateComponent },
      { path: 'training-certificate/:id', component: TrainingCertificateComponent },
      { path: 'training-certificate-list', component: TrainingCertificateListComponent },

      //Stock
      { path: 'unit', component: UnitComponent },
      { path: 'manufacturer', component: ManufacturerComponent },
      { path: 'product', component: ProductComponent },
      { path: 'supplier/:id', component: SupplierComponent },
      { path: 'purchase', component: PurchaseComponent },
      { path: 'purchase/:id', component: PurchaseComponent },
      { path: 'purchase-list', component: PurchaseListComponent },
      { path: 'product-issue', component: ProductIssueComponent },
      { path: 'product-issue/:id', component: ProductIssueComponent },
      { path: 'product-issue-list', component: ProductIssueListComponent },
      { path: 'product-history', component: ProductHistoryComponent },
      { path: 'product-stock', component: ProductStockComponent },

      //Library
      { path: 'rack', component: RackComponent },
      { path: 'book-type', component: BookTypeComponent },
      { path: 'library-subject', component: SubjectComponent },
      { path: 'book', component: BookComponent },
      { path: 'book-stock', component: BookStockComponent },
      { path: 'library-bar-code', component: LibraryBarCodeComponent },
      { path: 'purchase-book', component: PurchaseBookComponent },
      { path: 'purchase-book/:id', component: PurchaseBookComponent },
      { path: 'purchase-book-list', component: PurchaseBookListComponent },
      { path: 'book-issue', component: BookIssueComponent },
      { path: 'book-issue/:id', component: BookIssueComponent },
      { path: 'book-issue-list', component: BookIssueListComponent },
      { path: 'book-return', component: BookReturnComponent },
      { path: 'book-issue-return-history', component: BookIssueReturnHistoryComponent },
    ]
  },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
