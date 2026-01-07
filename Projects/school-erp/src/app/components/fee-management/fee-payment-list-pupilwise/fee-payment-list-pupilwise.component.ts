import { Component, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { FeeFor, FeePaymentStatus, PaymentFor, PaymentMode } from '../../../utils/enum';
import { ActionModel, FeePaymentDetailModel, FilterModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LoadDataService } from '../../../utils/load-data.service';
import { LocalService } from '../../../utils/local.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-fee-payment-list-pupilwise',
  templateUrl: './fee-payment-list-pupilwise.component.html',
  styleUrls: ['./fee-payment-list-pupilwise.component.css']
})
export class FeePaymentListPupilwiseComponent {
  dataLoading: boolean = false
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  filterModel: FilterModel = {} as FilterModel;
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  FeePaymentList: any[] = [];
  PaymentForList = PaymentFor;
  PaymentModeList= PaymentMode;
  FeeForList=FeeFor;
  // @ViewChild('FilterObjForm') FilterObjForm: NgForm;

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private localService: LocalService,
    private loadDataService: LoadDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getAllSearchPupilList();
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url,StaffLoginId:this.staffLogin.StaffLoginId })).toString()
    }
    this.dataLoading = true
    this.service.validiateMenu(obj).subscribe((response: any) => {
      this.action = this.loadDataService.validiateMenu(response, this.toastr, this.router)
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  PupilList: any[] = [];
  AllPupilList: any[] = [];
  getAllSearchPupilList() {
    this.dataLoading = true
    this.service.getAllSearchPupilList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllPupilList = response.PupilList;
        this.AllPupilList.map(x1 => x1.SearchPupil = `${x1.AdmissionNo} - ${x1.PupilName}`);
        this.PupilList = this.AllPupilList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false
    }))
  }


  filterPupilList(event:string) {
    if (event) {
      this.PupilList = this.AllPupilList.filter((option: any) => option.SearchPupil.toLowerCase().includes(event.toLowerCase()));
    } else {
      this.PupilList = this.AllPupilList;
    }
    this.filterModel.PupilId = 0;
  }

  afterPupilSeleted(event: any) {
    this.filterModel.PupilId = event.option.id;
    this.getFeePaymentList();
  }

  FooterObj:any={};
  getFeePaymentList() {
    if (this.filterModel.PupilId == null) {
      this.FeePaymentList =[];
      return;
    }
    this.FooterObj={
      FeeAmount :0,
      WaiveOffAmount :0,
      PaidAmount :0,
      FeePaymentStatus:FeePaymentStatus.Paid
    };
    var request:RequestModel = {
      request:this.localService.encrypt(JSON.stringify(this.filterModel))
    }
    this.dataLoading = true
    this.service.getFeePaymentList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.FeePaymentList = response.FeePaymentList;
        this.FeePaymentList.forEach((e1:any) => {
          this.FooterObj.FeeAmount +=e1.FeeAmount;
          this.FooterObj.WaiveOffAmount +=e1.WaiveOffAmount;
          this.FooterObj.PaidAmount +=e1.PaidAmount;
        });
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  FeePaymentDetailList:FeePaymentDetailModel[]=[];
  getFeePaymentDetailList(obj:any) {
    var request:RequestModel = {
      request:this.localService.encrypt(JSON.stringify(obj))
    }
    this.dataLoading = true
    this.service.getFeePaymentDetailList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.FeePaymentDetailList = response.FeePaymentDetailList;
        $('#modal_popup').modal('show');
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  

  deleteFeePayment(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var request:RequestModel = {
        request:this.localService.encrypt(JSON.stringify(obj))
      }
      this.dataLoading = true;
      this.service.deleteFeePayment(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getFeePaymentList()
        } else {
          this.toastr.error(response.Message)
        }
        this.dataLoading = false;
      }, (err => {
        this.toastr.error("Error occured while deleteing the recored")
        this.dataLoading = false;
      }))
    }
  }
  printReport(id:any){
    this.service.printFeeePaymentReceipt(id);
  }

  @ViewChild('table_1') table_1: ElementRef;
  isExporting: boolean = false;
  exportToExcel() {
    this.isExporting = true;
    var itemPerPage = this.itemPerPage;
    var p = this.p;
    this.p = 1;
    this.itemPerPage = this.FeePaymentList.length;
    setTimeout(() => {
      this.loadDataService.exportToExcel(this.table_1, "Fee Payment List " + this.loadDataService.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
    }, 1000);

  }

}