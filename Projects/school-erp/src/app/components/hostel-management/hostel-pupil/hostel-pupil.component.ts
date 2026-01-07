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
  selector: 'app-hostel-pupil',
  templateUrl: './hostel-pupil.component.html',
  styleUrls: ['./hostel-pupil.component.css']
})

export class HostelPupilComponent {

  dataLoading: boolean = false
  HostelPupilList: any[] = []
  HostelPupil: any = {}
  HostelPupilobj: any = {}
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  HostelList: any[] = []
  HostelRoomList: any[] = []
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
    this.getHostelList();
    this.getHostelRoomList();
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

  @ViewChild('formHostelPupil') formHostelPupil: NgForm;
  resetForm() {
    this.HostelPupil = {};
    this.HostelPupil.Status = 1;
    this.HostelPupil.StartDate = new Date();
    if (this.formHostelPupil) {
      this.formHostelPupil.control.markAsPristine();
      this.formHostelPupil.control.markAsUntouched();
    }
    this.isSubmitted = false
  }

  getHostelPupilList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.HostelPupilobj)).toString()
    }
    this.dataLoading = true
    this.service.getHostelPupilList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.HostelPupilList = response.HostelPupilList;
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
    this.HostelPupil.PupilId = null;
    this.HostelPupilobj.PupilId = null;
  }

  afterPupilSeleted(event: any) {
    this.HostelPupil.PupilId = event.option.id;
    this.HostelPupilobj.PupilId = event.option.id;
    this.getHostelPupilList();
  }

  clearPupil() {
    this.HostelPupilobj = {};
    this.HostelPupilList = [];
    this.resetForm();
    this.HostelPupil.PupilId = null;
    this.PupilList = this.AllPupilList;
  }

  saveHostelPupil() {
    this.isSubmitted = true;
    this.formHostelPupil.control.markAllAsTouched();
    if (this.formHostelPupil.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.HostelPupil.StartDate = this.loadDataService.loadDateYMD(this.HostelPupil.StartDate);
    this.HostelPupil.EndDate = this.loadDataService.loadDateYMD(this.HostelPupil.EndDate);
    this.HostelPupil.CreatedBy = this.staffLogin.StaffLoginId;
    this.HostelPupil.UpdatedBy = this.staffLogin.StaffLoginId;
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.HostelPupil)).toString()
    }
    this.dataLoading = true;
    this.service.saveHostelPupil(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.HostelPupil.HostelPupilId > 0) {
          this.toastr.success("Pupil hostel Updated successfully")
        } else {
          this.toastr.success("New pupil hostel added successfully")
        }
        $('#staticBackdrop').modal('hide');
        this.resetForm()
        this.getHostelPupilList()
      } else {
        this.toastr.error(response.Message);
        this.HostelPupil.StartDate = new Date(this.HostelPupil.StartDate);
        if (this.HostelPupil.EndDate)
          this.HostelPupil.EndDate = new Date(this.HostelPupil.EndDate);
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteHostelPupil(t1: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var obj: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(t1)).toString()
      }
      this.dataLoading = true;
      this.service.deleteHostelPupil(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getHostelPupilList()
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
  newHostelPupil() {
    // this.resetForm();
    $('#staticBackdrop').modal('show');
  }

  editHostelPupil(obj: any) {
    this.resetForm()
    this.HostelPupil = obj;
    this.HostelRoomList = this.AllHostelRoomList.filter(x=>x.HostelId == this.HostelPupil.HostelId);
    this.HostelPupil.StartDate = new Date(this.HostelPupil.StartDate);
    if (this.HostelPupil.EndDate)
      this.HostelPupil.EndDate = new Date(this.HostelPupil.EndDate);
      $('#staticBackdrop').modal('show');
    }

  getHostelList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getHostelList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.HostelList = response.HostelList;
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

  AllHostelRoomList:any[]=[];
  getHostelRoomList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getHostelRoomList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllHostelRoomList = response.HostelRoomList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  changeHostel(){
    this.HostelRoomList = this.AllHostelRoomList.filter(x=>x.HostelId == this.HostelPupil.HostelId);
    this.HostelPupil.HostelRoomId = null;
  }
}