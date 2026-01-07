import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { Status } from '../../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { Router } from '@angular/router';
import { LibraryService } from '../../../services/library.service';
import { RackModel } from '../../../interfaces/rack-model';
declare var $: any;

@Component({
  selector: 'app-rack',
  templateUrl: './rack.component.html',
  styleUrls: ['./rack.component.css']
})
export class RackComponent {
  dataLoading: boolean = false
  RackList: RackModel[] = []
  Rack: RackModel = {} as RackModel
  StatusList = this.loadData.GetEnumList(Status);
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  AllStatusList = Status;
  recordTitle = "Rack";
  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private libraryService: LibraryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getRackList();
    this.resetForm();
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url, StaffLoginId: this.staffLogin.StaffLoginId })).toString()
    }
    this.dataLoading = true
    this.service.validiateMenu(obj).subscribe((response: any) => {
      this.action = this.loadData.validiateMenu(response, this.toastr, this.router)
      this.dataLoading = false;
    }, (err => {
      this.toastr.error(ConstantData.serverMessage)
      this.dataLoading = false;
    }))
  }

  @ViewChild('formRack') formRack: NgForm;
  resetForm() {
    this.Rack = { Status: Status.Active } as RackModel;
    if (this.formRack) {
      this.formRack.control.markAsPristine();
      this.formRack.control.markAsUntouched();
    }
  }

  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  getRackList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({})).toString()
    }
    this.dataLoading = true
    this.libraryService.getRackList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.RackList = response.RackList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error(ConstantData.serverMessage)
      this.dataLoading = false;
    }))
  }

  saveRack() {
    this.formRack.control.markAllAsTouched();
    if (this.formRack.invalid) {
      this.toastr.error(ConstantData.formInvalidMessage)
      return
    }
    if (this.Rack.RackId)
      this.Rack.UpdatedBy = this.staffLogin.StaffLoginId;
    else
      this.Rack.CreatedBy = this.staffLogin.StaffLoginId;
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.Rack)).toString()
    }
    this.dataLoading = true;
    this.libraryService.saveRack(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Rack.RackId > 0) {
          this.toastr.success(ConstantData.updateMessage)
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success(ConstantData.submitMessage)
        }
        this.resetForm()
        this.getRackList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error(ConstantData.serverMessage)
      this.dataLoading = false;
    }))
  }

  deleteRack(obj: any) {
    if (confirm(ConstantData.deleteConfirmation)) {
      var request: RequestModel = {
        request: this.localService.encrypt(JSON.stringify(obj)).toString()
      }
      this.dataLoading = true
      this.libraryService.deleteRack(request).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success(ConstantData.deleteMessage);
          this.RackList = this.RackList.filter(x => x.RackId != obj.RackId);
        } else {
          this.toastr.error(response.Message)
        }
        this.dataLoading = false
      }, (err => {
        this.toastr.error(ConstantData.serverMessage);
        this.dataLoading = false
      }))
    }
  }

  editRack(obj: any) {
    this.resetForm()
    this.Rack = obj
    $('#staticBackdrop').modal('show');
  }

  newRack() {
    this.resetForm()
    $('#staticBackdrop').modal('show');
  }
}
