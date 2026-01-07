import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { Status } from '../../../utils/enum';
import { LoadDataService } from '../../../utils/load-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
declare var $: any;

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent {
  dataLoading: boolean = false
  AllSectionList: any[] = [];
  SectionList: any[] = [];
  Section: any = {}
  isSubmitted = false
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[3];
  ClassList: any[] = []
  filterObj: any = {
    ClassId: 0
  };
  StatusList = this.loadData.GetEnumList(Status);
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
    private localService:LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getSectionList();
    this.getClassStreamList();
    this.getClassList();
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

  @ViewChild('formSection') formSection: NgForm;
  resetForm() {
    this.Section = {};
    this.Section.Status = 1
    if (this.formSection) {
      this.formSection.control.markAsPristine();
      this.formSection.control.markAsUntouched();
    }
    this.isSubmitted = false
  }


  newSection() {
    this.resetForm();
    $('#staticBackdrop').modal('show');
  }



  getClassList() {
    var obj = {}
    this.dataLoading = true
    this.service.getClassList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.ClassList = response.ClassList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  ClassStreamList: any[] = [];
  AllClassStreamList: any[] = [];
  getClassStreamList() {
    var obj = {}
    this.dataLoading = true
    this.service.getClassStreamList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllClassStreamList = response.ClassStreamList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  changeClass() {
    // this.ClassStreamList = this.AllClassStreamList.filter(x => x.ParentClassId == this.Section.ParentClassId);
    // if (this.ClassStreamList.length == 0)
    //   this.Section.ClassId = this.Section.ParentClassId;
    // else
    //   this.Section.ClassId = "";
  }

  editSection(obj: any) {
    this.resetForm();
    this.Section = obj;
    // if (this.Section.ParentClassId == null) {
    //   this.Section.ParentClassId = this.Section.ClassId;
    // }

    //this.ClassStreamList = this.AllClassStreamList.filter(x => x.ParentClassId == this.Section.ParentClassId);
  }

  getSectionList() {
    var obj = {}
    this.dataLoading = true
    this.service.getSectionList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllSectionList = response.SectionList;
        this.changeFilterClass();
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  changeFilterClass() {
    if (this.filterObj.ClassId > 0)
      this.SectionList = this.AllSectionList.filter(x1 => x1.ClassId == this.filterObj.ClassId || x1.ParentClassId == this.filterObj.ClassId);
    else {
      this.SectionList = this.AllSectionList;
    }
  }

  saveSection() {
    this.isSubmitted = true;
    this.formSection.control.markAllAsTouched();
    if (this.formSection.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }
    this.dataLoading = true;
    this.service.saveSection(this.Section).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.Section.SectionId > 0) {
          this.toastr.success("Section Updated successfully")
          $('#staticBackdrop').modal('hide')
        } else {
          this.toastr.success("Section added successfully")
        }
        this.resetForm()
        this.getSectionList()
      } else {
        this.toastr.error(response.Message)
        this.dataLoading = false;
      }
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  deleteSection(obj: any) {
    if (confirm("Are your sure you want to delete this recored")) {

      this.dataLoading = true;
      this.service.deleteSection(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully")
          this.getSectionList()
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


}
