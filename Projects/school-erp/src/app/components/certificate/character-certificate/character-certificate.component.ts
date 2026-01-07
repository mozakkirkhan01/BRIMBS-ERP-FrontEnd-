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
  selector: 'app-character-certificate',
  templateUrl: './character-certificate.component.html',
  styleUrls: ['./character-certificate.component.css']
})
export class CharacterCertificateComponent {
  dataLoading: boolean = false
  CharacterCertificate: any = {}
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
  GenderList = this.loadDataService.GetEnumList(Gender);
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
    this.route.paramMap.subscribe((params1: any) => {
      var id = params1.get('id');
      if (id) {
        this.CharacterCertificate = JSON.parse(this.localService.decrypt(this.loadDataService.restoreSpecialCharacter(id)));
        this.CharacterCertificate.FromDateDT = new Date(this.CharacterCertificate.FromDate);
        this.CharacterCertificate.ToDateDT = new Date(this.CharacterCertificate.ToDate);
        this.CharacterCertificate.IssueDateDT = new Date(this.CharacterCertificate.IssueDate);
        this.getPupilDetail(this.CharacterCertificate.PupilAdmissionId);
      } else {
        this.getPupilListForCharacterCertificate();
      }
    });
  }
  validiateMenu() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ Url: '/admin/character-certificate',StaffLoginId:this.staffLogin.StaffLoginId })).toString()
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
  

  @ViewChild('formCharacterCertificate') formCharacterCertificate: NgForm;
  resetForm() {
    this.CharacterCertificate = { LeftDate: new Date() };
    if (this.formCharacterCertificate) {
      this.formCharacterCertificate.control.markAsPristine();
      this.formCharacterCertificate.control.markAsUntouched();
    }
  }


  saveCharacterCertificate() {
    this.formCharacterCertificate.control.markAllAsTouched();
    if (this.formCharacterCertificate.invalid) {
      this.toastr.error("Fill all the required fields !!")
      return
    }

    this.CharacterCertificate.FromDate = this.loadDataService.loadDateYMD(this.CharacterCertificate.FromDateDT);
    this.CharacterCertificate.ToDate = this.loadDataService.loadDateYMD(this.CharacterCertificate.ToDateDT);
    this.CharacterCertificate.IssueDate = this.loadDataService.loadDateYMD(this.CharacterCertificate.IssueDateDT);
    if (this.CharacterCertificate.CharacterCertificateId > 0)
      this.CharacterCertificate.UpdatedBy = this.staffLogin.StaffLoginId;
    this.CharacterCertificate.CreatedBy = this.staffLogin.StaffLoginId;

    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.CharacterCertificate))
    }
    this.dataLoading = true;
    this.service.saveCharacterCertificate(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        if (this.CharacterCertificate.CharacterCertificateId > 0) {
          this.toastr.success("Character Certificate Details Updated Successfully.")
          history.back();
        } else {
          this.toastr.success("Character Certificate Generated Successfully.");
          this.printCharacterCertificate(response.CharacterCertificateId)
          this.getPupilListForCharacterCertificate();
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



  AllPupilList: any[] = [];
  PupilList: any[] = [];
  getPupilListForCharacterCertificate() {
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify({ PupilStatus: PupilStatus.Active }))
    }
    this.dataLoading = true
    this.service.getPupilListForCharacterCertificate(obj).subscribe(r1 => {
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
    this.CharacterCertificate.PupilId = null;
  }

  afterPupilSeleted(event: any) {
    this.CharacterCertificate.PupilAdmissionId = event.option.id;
    this.getPupilDetail(this.CharacterCertificate.PupilAdmissionId);
  }

  clearPupil() {
    this.CharacterCertificate = {};
    this.resetForm();
    this.PupilList = this.AllPupilList;
  }

  Pupil: any = {};
  getPupilDetail(pupilAdmissionId: any) {
    var obj: RequestModel = {
      request: this.localService.encrypt(pupilAdmissionId)
    }
    this.dataLoading = true
    this.appService.getPupilDetail(obj).subscribe(r1 => {
      let response = r1 as any;
      if (response.Message == ConstantData.SuccessMessage) {
        this.Pupil = response.Pupil;
        if (this.CharacterCertificate.CharacterCertificateId > 0) {
          this.CharacterCertificate.SearchPupil = `${this.Pupil.AdmissionNo} - ${this.Pupil.PupilName} - ${this.Pupil.ClassName} - ${this.Pupil.SectionName}`;
        }else{
          this.CharacterCertificate.IssueDateDT = new Date();
          this.CharacterCertificate.PupilName = this.Pupil.PupilName;
          this.CharacterCertificate.AdmissionNo = this.Pupil.AdmissionNo;
          this.CharacterCertificate.FatherName = this.Pupil.FatherName;
          this.CharacterCertificate.MotherName = this.Pupil.MotherName;
          this.CharacterCertificate.ClassName = this.Pupil.ClassName;
          this.CharacterCertificate.Gender = this.Pupil.Gender;
          this.CharacterCertificate.FromDateDT = new Date(this.Pupil.AdmissionDate);
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

  printCharacterCertificate(Id: number) {
    this.service.printCharacterCertificate(this.loadDataService.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify({
      Id: Id,
      IsPrint: true,
    }))));
  }
}

