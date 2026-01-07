import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { Status } from '../../../utils/enum';
import { LocalService } from '../../../utils/local.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-transport-pupil',
  templateUrl: './transport-pupil.component.html',
  styleUrls: ['./transport-pupil.component.css']
})

export class TransportPupilComponent {

  dataLoading: boolean = false
  TransportPupilList: any[] = []
  TransportPupil: any = {}
  TransportPupilobj: any = {}
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  TransportBatchList: any[] = []
  VehicleList: any[] = []
  PupilList: any[] = []
  StatusList = this.loadDataService.GetEnumList(Status);
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;


  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  onTableDataChange(p: any) {
    this.p = p
  }

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadDataService: LoadDataService,
    private localService: LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getSearchPupilList();
    this.getTransportBatchList();
    this.getVehicleList();
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

  @ViewChild('formTransportPupil') formTransportPupil: NgForm;
  resetForm() {
    this.TransportPupil = {};
    this.TransportPupil.Status = 1;
    this.TransportPupil.StartDate = new Date();
    if (this.formTransportPupil) {
      this.formTransportPupil.control.markAsPristine();
      this.formTransportPupil.control.markAsUntouched();
    }
    this.isSubmitted = false
  }

  getTransportPupilList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.TransportPupilobj)).toString()
    }
    this.dataLoading = true
    this.service.getTransportPupilList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.TransportPupilList = response.TransportPupilList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  AllPupilList: any[] = [];
  getSearchPupilList() {
    this.dataLoading = true
    this.service.getSearchPupilList({}).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllPupilList = response.PupilList;
        this.AllPupilList.map(x1 => x1.SearchPupil = `${x1.AdmissionNo} - ${x1.PupilName} - ${x1.ClassName} - ${x1.SectionName}`);
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

  filterPupilList(event:any) {
    if (event) {
      this.PupilList = this.AllPupilList.filter((option: any) => option.SearchPupil.toLowerCase().includes(event.toLowerCase()));
    } else {
      this.PupilList = this.AllPupilList;
    }
    this.TransportPupil.PupilId = null;
    this.TransportPupilobj.PupilId = null;
  }

  afterPupilSeleted(event: any) {
    this.TransportPupil.PupilId = event.option.id;
    this.TransportPupilobj.PupilId = event.option.id;
    this.getTransportPupilList();
  }

  clearPupil() {
    this.TransportPupilobj = {};
    this.TransportPupilList = [];
    this.resetForm();
    this.TransportPupil.PupilId = null;
    this.PupilList = this.AllPupilList;
  }

  saveTransportPupil() {
    this.isSubmitted = true;
    this.formTransportPupil.control.markAllAsTouched();
    if (this.formTransportPupil.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.TransportPupil.StartDate = this.loadDataService.loadDateYMD(this.TransportPupil.StartDate);
    this.TransportPupil.EndDate = this.loadDataService.loadDateYMD(this.TransportPupil.EndDate);
    this.TransportPupil.CreatedBy = this.staffLogin.StaffLoginId;
    this.TransportPupil.UpdatedBy = this.staffLogin.StaffLoginId;
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.TransportPupil)).toString()
    }
    this.dataLoading = true;
    this.service.saveTransportPupil(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.TransportPupil.TransportPupilId > 0) {
          this.toastr.success("Pupil transport Updated successfully")
        } else {
          this.toastr.success("New pupil transport added successfully")
        }
        $('#staticBackdrop').modal('hide');
        this.resetForm()
        this.getTransportPupilList()
      } else {
        this.toastr.error(response.Message);
        this.TransportPupil.StartDate = new Date(this.TransportPupil.StartDate);
        if (this.TransportPupil.EndDate)
          this.TransportPupil.EndDate = new Date(this.TransportPupil.EndDate);
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteTransportPupil(t1: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var obj: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(t1)).toString()
      }
      this.dataLoading = true;
      this.service.deleteTransportPupil(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getTransportPupilList()
        } else {
          this.toastr.error(response.Message)
          this.dataLoading = false;
        }
      }, (err => {
        this.toastr.error("Error occured while deleteing the recored")
        this.dataLoading = false;
      }))
    }
  }
  newTransportPupil() {
    // this.resetForm();
    $('#staticBackdrop').modal('show');
  }

  editTransportPupil(obj: any) {
    this.resetForm()
    this.TransportPupil = obj;
    this.TransportPupil.StartDate = new Date(this.TransportPupil.StartDate);
    if (this.TransportPupil.EndDate)
      this.TransportPupil.EndDate = new Date(this.TransportPupil.EndDate);
      $('#staticBackdrop').modal('show');
    }

  getTransportBatchList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getTransportBatchList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.TransportBatchList = response.TransportBatchList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  getPupilList() {
    var obj = {}
    this.dataLoading = true
    this.service.getPupilList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.PupilList = response.PupilList;

      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  getVehicleList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getVehicleList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.VehicleList = response.VehicleList;

      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }


}