import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LocalService } from '../../../utils/local.service';
import { Status } from '../../../utils/enum';
import { LoadDataService } from '../../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-pupil-waive-off',
  templateUrl: './pupil-waive-off.component.html',
  styleUrls: ['./pupil-waive-off.component.css']
})
export class PupilWaiveOffComponent {
  dataLoading: boolean = false
  MonthList: any[] = []
  PupilWaiveOff: any = {}
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  StatusList = this.loadData.GetEnumList(Status);

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
    private localService: LocalService,
    private loadData:LoadDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getSearchPupilList();
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


  @ViewChild('formPupilWaiveOff') formPupilWaiveOff: NgForm;
  resetForm() {
    this.PupilWaiveOff = {};
    if (this.formPupilWaiveOff) {
      this.formPupilWaiveOff.control.markAsPristine();
      this.formPupilWaiveOff.control.markAsUntouched();
    }
    this.isSubmitted = false
    this.PupilWaiveOff.Status = 1;
    this.MonthList = [];
    this.PupilWaiveOff = {};
  }

  PupilList: any[] = [];
  AllPupilList: any[] = [];
  getSearchPupilList() {
    this.dataLoading = true
    this.service.getSearchPupilList(this.PupilWaiveOff).subscribe(r1 => {
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


  filterPupilList(event:string) {
    if (event) {
      this.PupilList = this.AllPupilList.filter((option: any) => option.SearchPupil.toLowerCase().includes(event.toLowerCase()));
    } else {
      this.PupilList = this.AllPupilList;
    }
    this.MonthList = [];
  }

  afterPupilSeleted(event: any) {
    // this.PupilWaiveOff.PupilAdmissionId = event.option.id;
    this.getPupilWaiveOffListforEntry(event.option.id);
  }

  clearPupil() {
    this.resetForm();
    this.PupilList = this.AllPupilList;
    this.MonthList = [];
  }


  getPupilWaiveOffListforEntry(PupilAdmissionId: any) {
    if (PupilAdmissionId) {
      this.dataLoading = true
      var obj = {
        PupilAdmissionId: PupilAdmissionId
      }
      this.service.getPupilWaiveOffListforEntry(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.MonthList = response.MonthList;
        } else {
          this.toastr.error(response.Message)
        }
        this.dataLoading = false
      }, (err => {
        this.toastr.error("Error while fetching records")
        this.dataLoading = false
      }))
    } else {
      this.MonthList = [];
    }
  }

  savePupilWaiveOff(form: NgForm) {
    this.isSubmitted = true
    if (form.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    var PupilWaiveOffList: any[] = [];
    this.MonthList.forEach((e1: any) => {
      e1.PupilWaiveOffList.forEach((e2: any) => {
        PupilWaiveOffList.push(e2);
      });
    });
    var obj = {
      PupilWaiveOffList: PupilWaiveOffList,
      StaffLoginId: this.staffLogin.StaffLoginId
    }
    this.dataLoading = true;
    this.service.savePupilWaiveOff(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.toastr.success("Heads Updated Successfully");
        this.resetForm();
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }
}