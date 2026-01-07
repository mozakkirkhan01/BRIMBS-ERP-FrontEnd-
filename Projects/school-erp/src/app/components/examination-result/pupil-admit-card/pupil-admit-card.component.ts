import { Component, ViewChild, ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { LocalService } from '../../../utils/local.service';
import { Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { AppService } from '../../../utils/app.service';
import { Status } from '../../../utils/enum';

@Component({
  selector: 'app-pupil-admit-card',
  templateUrl: './pupil-admit-card.component.html',
  styleUrls: ['./pupil-admit-card.component.css']
})
export class PupilAdmitCardComponent {
  filterModel: any = {};
  dataLoading: boolean = false
  PupilAdmitCardList: any[] = []
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = 'Position';
  itemPerPage: number = this.PageSize[0];
  AllStatusList = Status;
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  printAdmitCard(id: string) {
    var obj = {
      AdmitCardId: id,
      PupilAdmissionId: this.pupil.PupilAdmissionId,
      PupilId: this.pupil.PupilId,
    };
    this.service.printAdmitCard(this.localService.encrypt(JSON.stringify(obj)));
  }

  constructor(
    private service: ExamService,
    private appService: AppService,
    private toastr: ToastrService,
    private loadData: LoadDataService,
    private localService: LocalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getSearchPupilList();
  }
  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: this.router.url, StaffLoginId: this.staffLogin.StaffLoginId })).toString()
    }
    this.dataLoading = true
    this.appService.validiateMenu(obj).subscribe((response: any) => {
      this.action = this.loadData.validiateMenu(response, this.toastr, this.router)
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }
  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  PupilList: any[] = [];
  AllPupilList: any[] = [];
  getSearchPupilList() {
    this.dataLoading = true
    this.appService.getSearchPupilList({}).subscribe(r1 => {
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


  filterPupilList(event: any) {
    if (event) {
      this.PupilList = this.AllPupilList.filter((option: any) => option.SearchPupil.toLowerCase().includes(event.toLowerCase()));
    } else {
      this.PupilList = this.AllPupilList;
    }
  }
  pupil: any = {};
  afterPupilSeleted(event: any) {
    this.pupil = this.AllPupilList.filter(x=>x.PupilId == event.option.id)[0];
    this.getPupilAdmitCardList(event.option.id);
  }


  getPupilAdmitCardList(pupilId: string) {
    var request: RequestModel = {
      request: this.localService.encrypt(pupilId).toString()
    }
    this.dataLoading = true
    this.service.getPupilAdmitCardList(request).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.PupilAdmitCardList = response.PupilAdmitCardList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }
}
