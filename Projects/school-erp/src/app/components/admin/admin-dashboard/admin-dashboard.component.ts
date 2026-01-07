import { Component,  ViewChild } from '@angular/core';
import {  DashboardModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { ExpenseService } from '../../../services/expense.service';
import { AppService } from '../../../utils/app.service';
import { ToastrService } from 'ngx-toastr';
import { LoadDataService } from '../../../utils/load-data.service';
import { LocalService } from '../../../utils/local.service';
import { ConstantData } from '../../../utils/constant-data';
import { NgForm } from '@angular/forms';
import { AccountType,Status } from '../../../utils/enum';
declare var ApexCharts: any;
declare var $: any;

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent{
  dataLoading: boolean = false;
  options: any;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  currentMonthName: string = this.loadData.getMonthName(new Date());
  imageUrl = this.appService.getImageUrl();

  constructor(
    private service: ExpenseService,
    private appService: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
  ) {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.getDashboardDetail();
  }

  DashboardDetail: DashboardModel = {} as DashboardModel;
  ShortcutList: any[] = [];
  getDashboardDetail() {
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ StaffLoginId: this.staffLogin.StaffLoginId })).toString()
    }
    this.dataLoading = true
    this.appService.getDashboardDetail(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.DashboardDetail = response.DashboardDetail;

        if (this.DashboardDetail.ShowNoOfActiveStudents
          || this.DashboardDetail.ShowNoOfInactiveStudents
          || this.DashboardDetail.ShowTodayRegistration
          || this.DashboardDetail.ShowTodayNewAdmission
          || this.DashboardDetail.ShowTodayCollection
          || this.DashboardDetail.ShowTodayExpense) {
          this.DashboardDetail.ShowTodayReport = true;
        }

        if (this.DashboardDetail.ShowCurrentMonthRegistration
          || this.DashboardDetail.ShowCurrentMonthNewAdmission
          || this.DashboardDetail.ShowCurrentMonthCollection
          || this.DashboardDetail.ShowCurrentMonthExpense) {
          this.DashboardDetail.ShowCurrentMonthReport = true;
        }

        if (response.ShortcutList)
          this.ShortcutList = response.ShortcutList;
        if (this.DashboardDetail.ShowStudentChart) {
          setTimeout(() => {
            this.loadStudentChart();
          }, 100);
        }
        if (this.DashboardDetail.ShowRegistrationChart) {
          setTimeout(() => {
            this.loadformAdmissionChart();
          }, 100);
        }
        if (this.DashboardDetail.ShowIncomExpenseChart)
          this.getExpenseIncomeList();
        if (this.DashboardDetail.ShowAccountChart)
          this.getAccountList();
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  IncomeExpense: any = {
    FromDateString: this.loadData.loadFirstDate(),
    ToDateString: new Date()
  };
  ExpenseIncomeList: any[] = [];
  getExpenseIncomeList() {
    this.IncomeExpense.FromDate = this.loadData.loadDateYMD(this.IncomeExpense.FromDateString);
    this.IncomeExpense.ToDate = this.loadData.loadDateYMD(this.IncomeExpense.ToDateString);
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.IncomeExpense)).toString()
    }
    this.dataLoading = true
    this.service.getExpenseIncomeList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.ExpenseIncomeList = response.ExpenseIncomeList;
        this.loadIncomeExpenseReport();

      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  loadIncomeExpenseReport() {
    $('#incomeExpenseChart').empty();
    new ApexCharts(document.querySelector("#incomeExpenseChart"), {
      series: [{
        name: 'Income',
        data: this.ExpenseIncomeList.map(x => x.Income),
      }, {
        name: 'Expense',
        data: this.ExpenseIncomeList.map(x => x.Expense)
      },
        // {
        //   name: 'Closing Balance',
        //   data: this.ExpenseIncomeList.map(x => x.AvailableAmount)
        // }
      ],
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: true
        },
      },
      markers: {
        size: 4
      },
      colors: ['#044006', '#b3040e', '#4154f1'],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.4,
          stops: [0, 90, 100]
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      xaxis: {
        type: 'datetime',
        categories: this.ExpenseIncomeList.map(x => x.Date)
      },
      tooltip: {
        x: {
          format: 'dd-MM-yyyy'
        },
      }
    }).render();
  }

  loadformAdmissionChart() {
    new ApexCharts(document.querySelector("#formAdmissionChart"), {
      series: [this.DashboardDetail.NoOfForms, this.DashboardDetail.NoOfAdmitted],
      chart: {
        height: 300,
        type: 'pie',
        toolbar: {
          show: true
        }
      },
      // colors: ['#130f4a', '#044006'],  
      labels: ['Registration', 'Admission Taken']
    }).render();

  }

  loadStudentChart() {
    new ApexCharts(document.querySelector("#studentChart"), {
      // series: [this.DashboardDetail.NoOfActiveStudents, this.DashboardDetail.NoOfLeftStudents],
      series: this.DashboardDetail.ClassStudentList.map(x => x.NoOfStudents),
      chart: {
        height: 400,
        type: 'pie',
        toolbar: {
          show: true
        }
      },
      // colors: ['#044006', '#b3040e'],
      // labels: ['Active', 'Left']
      labels: this.DashboardDetail.ClassStudentList.map(x => x.ClassName)
    }).render();

  }

  AccountList: any[] = [];
  getAccountList() {
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Status: Status.Active })).toString()
    }
    this.dataLoading = true
    this.appService.getAccountList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AccountList = response.AccountList;
        if (this.AccountList.length > 0) {
          this.Cashbook.AccountId = this.AccountList[0].AccountId;
          this.getCashbookBankbookList(false);
        }
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  Cashbook: any = {
    FromDateString: this.loadData.loadFirstDate(),
    ToDateString: new Date(),
    AccountType: AccountType.CashAccount
  }
  @ViewChild('formCashbook') formCashbook: NgForm;
  CashbookList: any[] = [];
  getCashbookBankbookList(isFormCheck: boolean) {
    if (isFormCheck) {
      this.formCashbook.control.markAllAsTouched();
      if (this.formCashbook.invalid) {
        this.toastr.error(ConstantData.formInvalidMessage);
        return;
      }
    }
    this.Cashbook.FromDate = this.loadData.loadDateYMD(this.Cashbook.FromDateString);
    this.Cashbook.ToDate = this.loadData.loadDateYMD(this.Cashbook.ToDateString);
    var request: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Cashbook)).toString()
    }
    this.dataLoading = true
    this.appService.getCashbookBankbookList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        var BankBookMaster = response.BankBookMaster;
        this.CashbookList = BankBookMaster.BankbookList;
        this.CashbookList.splice(0, 0, { ClosingBalance: BankBookMaster.OpeningBalance, Date: BankBookMaster.OpeningDate });
        this.loadAccountChart();
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  loadAccountChart() {

    $('#accountChart').empty();
    new ApexCharts(document.querySelector("#accountChart"), {
      series: [{
        name: 'Balance',
        data: this.CashbookList.map(x => x.ClosingBalance),
      }
      ],
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: true
        },
      },
      markers: {
        size: 4
      },
      colors: ['#4a085c'],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.4,
          stops: [0, 90, 100]
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      xaxis: {
        type: 'datetime',
        categories: this.CashbookList.map(x => x.Date)
      },
      tooltip: {
        x: {
          format: 'dd-MM-yyyy'
        },
      }
    }).render();
  }

}
