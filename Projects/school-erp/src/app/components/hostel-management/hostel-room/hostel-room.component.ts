import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { Status } from '../../../utils/enum';
import { LoadDataService } from '../../../utils/load-data.service';
import { LocalService } from '../../../utils/local.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-hostel-room',
  templateUrl: './hostel-room.component.html',
  styleUrls: ['./hostel-room.component.css']
})
export class HostelRoomComponent {

  dataLoading: boolean = false
  HostelRoomList: any = []
  HostelRoom: any = {}
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  HostelList: any[] = []
  StatusList = this.loadData.GetEnumList(Status);
  AllStatusList = Status;
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
    private loadData: LoadDataService,
    private localService: LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getHostelRoomList();
    this.getHostelList();
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url,StaffLoginId:this.staffLogin.StaffLoginId })).toString()
    }
    this.dataLoading = true
    this.service.validiateMenu(obj).subscribe((response: any) => {
      this.action = this.loadData.validiateMenu(response, this.toastr, this.router)
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  @ViewChild('formHostelRoom') formHostelRoom: NgForm;
  resetForm() {
    this.HostelRoom = {};
    this.HostelRoom.Status = 1
    if (this.formHostelRoom) {
      this.formHostelRoom.control.markAsPristine();
      this.formHostelRoom.control.markAsUntouched();
    }
    this.isSubmitted = false
  }


  getHostelRoomList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.service.getHostelRoomList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.HostelRoomList = response.HostelRoomList;

      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  saveHostelRoom() {
    this.isSubmitted = true;
    this.formHostelRoom.control.markAllAsTouched();
    if (this.formHostelRoom.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.HostelRoom.CreatedBy = this.staffLogin.StaffLoginId;
    this.HostelRoom.UpdatedBy = this.staffLogin.StaffLoginId;
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.HostelRoom)).toString()
    }
    this.dataLoading = true;
    this.service.saveHostelRoom(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.HostelRoom.HostelRoomId > 0) {
          this.toastr.success("Room detail updated successfully")
          $('#staticBackdrop').modal('hide')
          this.resetForm()
        } else {
          this.toastr.success("New room added successfully");
          this.HostelRoom.HostelRoomId = 0;
          this.HostelRoom.RoomName = "";
          this.formHostelRoom.control.markAsPristine();
          this.formHostelRoom.control.markAsUntouched();
          this.isSubmitted = false;
        }
        this.getHostelRoomList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteHostelRoom(t1: any) {
    if (confirm("Are your sure you want to delete this recored")) {
      var obj: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(t1)).toString()
      }
      this.dataLoading = true;
      this.service.deleteHostelRoom(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getHostelRoomList()
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

  editHostelRoom(obj: any) {
    this.resetForm()
    this.HostelRoom = obj
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
    }))
  }

}
