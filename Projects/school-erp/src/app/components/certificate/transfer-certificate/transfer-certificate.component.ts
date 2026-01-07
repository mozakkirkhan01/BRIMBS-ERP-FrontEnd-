import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { LocalService } from '../../../utils/local.service';
import { AdmissionType, BloodGroup, Category, Gender, Nationality, PupilStatus, Religion, YesNo } from '../../../utils/enum';
import { ActionModel, RequestModel, StaffLoginModel } from '../../../utils/interface';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from '../../../services/certificate.service';
import { AppService } from '../../../utils/app.service';
import { ExamService } from '../../../services/exam.service';

@Component({
  selector: 'app-transfer-certificate',
  templateUrl: './transfer-certificate.component.html',
  styleUrls: ['./transfer-certificate.component.css']
})
export class TransferCertificateComponent {
  dataLoading: boolean = false
  TransferCertificate: any = {}
  action: ActionModel = {} as ActionModel;
  staffLogin: StaffLoginModel = {} as StaffLoginModel;
  AllNationalityList = Nationality;
  AllBloodGroupList = BloodGroup;
  AllReligionList = Religion;
  AllCategoryList = Category;
  AllPupilStatusList = PupilStatus;
  AllGenderList = Gender;
  AllAdmissionTypeList = AdmissionType;
  NationalityList = this.loadDataService.GetEnumList(Nationality);
  CategoryList = this.loadDataService.GetEnumList(Category);
  YesNoList = this.loadDataService.GetEnumList(YesNo);

  constructor(
    private service: CertificateService,
    private appService: AppService,
    private examService: ExamService,
    private toastr: ToastrService,
    private loadDataService: LoadDataService,
    private localService: LocalService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.resetForm();
    this.getSubjectList();
    this.route.paramMap.subscribe((params1: any) => {
      var id = params1.get('id');
      if (id) {
        this.TransferCertificate = JSON.parse(this.localService.decrypt(this.loadDataService.restoreSpecialCharacter(id)));
        this.TransferCertificate.DOBDT = new Date(this.TransferCertificate.DOB);
        this.TransferCertificate.FirstAdmissionDateDT = new Date(this.TransferCertificate.FirstAdmissionDate);
        this.TransferCertificate.IssueDateDT = new Date(this.TransferCertificate.IssueDate);
        this.TransferCertificate.ApplicationDateDT = new Date(this.TransferCertificate.ApplicationDate);
        this.getPupilDetailForTransferCertificate(this.TransferCertificate.PupilAdmissionId);
      } else {
        this.getPupilListForTransferCertificate();
      }
    });
  }
  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: '/admin/transfer-certificate', StaffLoginId: this.staffLogin.StaffLoginId })).toString()
    }
    this.dataLoading = true
    this.appService.validiateMenu(obj).subscribe((response: any) => {
      this.action = this.loadDataService.validiateMenu(response, this.toastr, this.router)
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  @ViewChild('formTransferCertificate') formTransferCertificate: NgForm;
  resetForm() {
    this.TransferCertificate = { LeftDate: new Date(), LastExamResult: "", ExtraActivities: "", GeneralConduct: "" };
    if (this.formTransferCertificate) {
      this.formTransferCertificate.control.markAsPristine();
      this.formTransferCertificate.control.markAsUntouched();
    }
  }


  saveTransferCertificate() {
    this.formTransferCertificate.control.markAllAsTouched();
    if (this.formTransferCertificate.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    this.TransferCertificate.DOB = this.loadDataService.loadDateYMD(this.TransferCertificate.DOBDT);
    this.TransferCertificate.FirstAdmissionDate = this.loadDataService.loadDateYMD(this.TransferCertificate.FirstAdmissionDateDT);
    this.TransferCertificate.IssueDate = this.loadDataService.loadDateYMD(this.TransferCertificate.IssueDateDT);
    this.TransferCertificate.ApplicationDate = this.loadDataService.loadDateYMD(this.TransferCertificate.ApplicationDateDT);

    if (this.TransferCertificate.TransferCertificateId > 0)
      this.TransferCertificate.UpdatedBy = this.staffLogin.StaffLoginId;
    else
      this.TransferCertificate.CreatedBy = this.staffLogin.StaffLoginId;

    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.TransferCertificate))
    }
    this.dataLoading = true;
    this.service.saveTransferCertificate(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.TransferCertificate.TransferCertificateId > 0) {
          this.toastr.success("Transfer Certificate Details Updated Successfully.")
          history.back();
        } else {
          this.toastr.success("Transfer Certificate Generated Successfully.");
          this.printTransferCertificate(response.TransferCertificateId)
          this.getPupilListForTransferCertificate();
        }
        this.resetForm()
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error occured while submitting data")
      this.dataLoading = false;
    }))
  }

  SubjectList: any[] = [];
  getSubjectList() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({}))
    }
    this.dataLoading = true
    this.examService.getSubjectList(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.SubjectList = response.SubjectList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false
    }))
  }


  AllPupilList: any[] = [];
  PupilList: any[] = [];
  getPupilListForTransferCertificate() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ PupilStatus: PupilStatus.Active }))
    }
    this.dataLoading = true
    this.service.getPupilListForTransferCertificate(obj).subscribe(r1 => {
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
    this.TransferCertificate.PupilId = null;
  }

  afterPupilSeleted(event: any) {
    this.TransferCertificate.PupilAdmissionId = event.option.id;
    this.getPupilDetailForTransferCertificate(this.TransferCertificate.PupilAdmissionId);
  }

  clearPupil() {
    this.TransferCertificate = {};
    this.resetForm();
    this.PupilList = this.AllPupilList;
  }

  Pupil: any = {};
  getPupilDetailForTransferCertificate(pupilAdmissionId: any) {
    var obj: RequestModel = {
      request: this.localService.encrypt(pupilAdmissionId)
    }
    this.dataLoading = true
    this.service.getPupilDetailForTransferCertificate(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.Pupil = response.Pupil;
        if (this.TransferCertificate.TransferCertificateId == null) {
          this.TransferCertificate = response.TransferCertificate;
          if (this.TransferCertificate.DOB != null)
            this.TransferCertificate.DOBDT = new Date(this.TransferCertificate.DOB);
          if (this.TransferCertificate.IssueDate != null)
            this.TransferCertificate.IssueDateDT = new Date(this.TransferCertificate.IssueDate);
          else
            this.TransferCertificate.IssueDateDT = new Date();
          if (this.TransferCertificate.ApplicationDate != null)
            this.TransferCertificate.ApplicationDateDT = new Date(this.TransferCertificate.ApplicationDate);
          else
            this.TransferCertificate.ApplicationDateDT = new Date();

          if (this.TransferCertificate.FirstAdmissionDate != null)
            this.TransferCertificate.FirstAdmissionDateDT = new Date(this.TransferCertificate.FirstAdmissionDate);
          if (this.TransferCertificate.Nationality == null)
            this.TransferCertificate.Nationality = this.NationalityList[0].Key;
          if (this.TransferCertificate.Category == null)
            this.TransferCertificate.Category = this.CategoryList[0].Key;
          this.TransferCertificate.ExtraActivities = "College Society , Sports and Games";
          this.TransferCertificate.LeavingReason = "For Higher Education";
          this.TransferCertificate.GeneralConduct = "Good";
          this.TransferCertificate.OtherRemarks = "NA";
          this.TransferCertificate.SessionName = "23-25";
          this.TransferCertificate.SearchPupil = this.AllPupilList.find(x => x.PupilAdmissionId == this.TransferCertificate.PupilAdmissionId).SearchPupil;
        } else {
          this.TransferCertificate.SearchPupil = `${this.Pupil.AdmissionNo} - ${this.Pupil.PupilName} - ${this.Pupil.ClassName} - ${this.Pupil.SectionName}`;
        }
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false
    }))
  }

  printTransferCertificate(Id: number) {
    this.service.printTransferCertificate(this.loadDataService.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify({
      Id: Id,
      IsPrint: true,
    }))));
  }
}

