import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { LocalService } from '../../../utils/local.service';
import { FeeFor } from '../../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { Router } from '@angular/router';
declare var $: any

@Component({
  selector: 'app-pupil-charge',
  templateUrl: './pupil-charge.component.html',
  styleUrls: ['./pupil-charge.component.css']
})
export class PupilChargeComponent {
  dataLoading: boolean = false
  PupilChargeList: any[] = []
  PupilCharge: any = {}
  PupilChargeobj: any = {}
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  PupilList: any[] = []
  HeadList: any[] = []
  // FeeForList=this.loadData.GetEnumList(FeeFor);
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  AllFeeForList = FeeFor;
  FeeForList = this.loadDataService.GetEnumList(FeeFor);

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
    this.getPupilChargeList();
    this.getHeadList();
    this.getSearchPupilList();
    this.resetForm();
  }

  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url, StaffLoginId: this.staffLogin.StaffLoginId })).toString()
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

  @ViewChild('formPupilCharge') formPupilCharge: NgForm;
  resetForm() {
    this.PupilCharge = {};
    if (this.formPupilCharge) {
      this.formPupilCharge.control.markAsPristine();
      this.formPupilCharge.control.markAsUntouched();
    }
    this.isSubmitted = false
    this.PupilCharge.Status = 1;
    this.PupilCharge.ChargeDate = new Date();
  }

  getPupilChargeList() {
    var obj = {
      PupilId: this.PupilChargeobj.PupilId
    }
    this.dataLoading = true
    this.service.getPupilChargeList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.PupilChargeList = response.PupilChargeList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  savePupilCharge() {
    this.isSubmitted = true
    this.formPupilCharge.control.markAllAsTouched();
    if (this.formPupilCharge.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    this.PupilCharge.ChargeDate = this.loadDataService.loadDateYMD(this.PupilCharge.ChargeDate);
    if (this.PupilCharge.PupilChargeId)
      this.PupilCharge.UpdatedBy = this.staffLogin.StaffLoginId;
    else
      this.PupilCharge.CreatedBy = this.staffLogin.StaffLoginId;

    this.PupilCharge.PupilId = this.PupilChargeobj.PupilId;

    this.dataLoading = true;
    this.service.savePupilCharge(this.PupilCharge).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.PupilCharge.PupilChargeId > 0) {
          this.toastr.success("Charge Updated successfully")
        } else {
          this.toastr.success("Charge added successfully")
        }
        $('#staticBackdrop').modal('hide');
        this.resetForm()
        this.getPupilChargeList()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deletePupilCharge(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {

      this.dataLoading = true;
      this.service.deletePupilCharge(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getPupilChargeList()
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

  editPupilCharge(obj: any) {
    this.resetForm()
    this.PupilCharge = obj;
  }



  // onPupilChange(pupilId?: number) {
  //   this.selectedPupil = []
  //   this.PupilChargeList.forEach((e1: any) => {
  //     if (e1.PupilId == pupilId)
  //       this.selectedPupil.push(e1);
  //   })
  // }


  getHeadList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({}))
    }
    this.dataLoading = true
    this.service.getHeadList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.HeadList = response.HeadList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  selectChange(obj: any) {
    if (obj.IsSelected) {
      obj.IsCompulsory = true
    } else {
      obj.IsCompulsory = false;
    }
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

  filterPupilList(event: string) {
    if (event) {
      this.PupilList = this.AllPupilList.filter((option: any) => option.SearchPupil.toLowerCase().includes(event.toLowerCase()));
    } else {
      this.PupilList = this.AllPupilList;
    }
    this.PupilChargeobj.PupilId = null;
    this.PupilChargeList = [];
  }

  afterPupilSeleted(event: any) {
    this.PupilCharge.PupilAdmissionId = event.option.id;
    this.PupilChargeobj.PupilId = event.option.id;
    this.getPupilChargeList();
    this.PupilCharge.PupilId = event.option.id
  }

  clearPupil() {
    this.PupilChargeobj = {};
    this.PupilChargeList = [];
    this.resetForm();
    this.PupilList = this.AllPupilList;
  }

}
