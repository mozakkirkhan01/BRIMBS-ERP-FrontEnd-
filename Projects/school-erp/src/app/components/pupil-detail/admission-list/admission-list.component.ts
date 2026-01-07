import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../../utils/app.service';
import { ConstantData } from '../../../utils/constant-data';
import { LoadDataService } from '../../../utils/load-data.service';
import { LocalService } from '../../../utils/local.service';
import { ActionModel, FieldSelectionModel, FilterModel, PdfSettingModel, RequestModel } from '../../../utils/interface';
import { Router } from '@angular/router';
import { AdmissionType, BloodGroup, Category, CommandType, Gender, Nationality, PupilStatus, Religion } from '../../../utils/enum';
import * as pdfMake from 'pdfmake/build/pdfmake';
const pdfFonts = require('../../../../assets/vfs_fonts');
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import {  defaultStyle } from "../../../pdf-config/customStyles";
import { fonts } from "../../../pdf-config/pdfFonts";
import { PupilValidationModel } from '../../../interfaces/pupil-validation-model';
import { SchoolModel } from '../../../interfaces/school-model';
import { PdfUtils } from '../../../pdf-config/pdf-utils';
declare var $: any;

@Component({
  selector: 'app-admission-list',
  templateUrl: './admission-list.component.html',
  styleUrls: ['./admission-list.component.css']
})
export class AdmissionListComponent {
  dataLoading: boolean = false
  PupilList: any[] = []
  pupilValidation: PupilValidationModel;;
  PageSize = ConstantData.PageSizes;
  p: number = 1;
  Search: string = '';
  reverse: boolean = false;
  sortKey: string = '';
  itemPerPage: number = this.PageSize[0];
  PupilTypeList: any[] = [];
  AdmissionTypeList = this.loadDataService.GetEnumList(AdmissionType);
  AllNationalityList = Nationality;
  AllBloodGroupList = BloodGroup;
  AllReligionList = Religion;
  AllCategoryList = Category;
  AllPupilStatusList = PupilStatus;
  AllGenderList = Gender;
  AllAdmissionTypeList = AdmissionType;
  SectionList: any[] = [];
  AllSectionList: any[] = [];
  SessionList: any[] = [];
  ClassList: any[] = [];
  staffLogin: any = {};
  FilterObj: FilterModel = {
    ClassId: 0,
    SectionId: 0,
    SessionId: 0,
    AdmissionType: 0,
    PupilTypeId: 0,
  } as FilterModel;
  title: string = "Student List";
  action: ActionModel = {} as ActionModel;
  imageUrl = ConstantData.getBaseUrl();
  @ViewChild('FilterObjForm') FilterObjForm: NgForm;


  sort(key: any) {
    this.sortKey = key;
    this.reverse = !this.reverse;
  }

  constructor(
    private service: AppService,
    private toastr: ToastrService,
    private localService: LocalService,
    private loadDataService: LoadDataService,
    private router: Router
  ) {
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
    (pdfMake as any).fonts = fonts;
    this.changeSelectAll(true);

  }

  ngOnInit(): void {
    this.staffLogin = this.localService.getEmployeeDetail();
    this.validiateMenu();
    this.getPupilTypeList();
    this.getSectionList();
    this.getSessionList();
    this.getClassList();
    this.getSchool();
    //this.generatePdf();
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

  changeSelectAll(value: boolean) {
    this.pupilValidation = {
      AadhaarNo: value,
      Pen: value,
      AdmissionDate: value,
      AdmissionNo: value,
      AdmissionType: value,
      AlternateNo: value,
      BloodGroup: value,
      Category: value,
      ClassName: value,
      CorrespondenceAddress: value,
      DOB: value,
      Email: value,
      FamilyAnnualIncome: value,
      FatherName: value,
      FatherOccupation: value,
      Gender: value,
      GuardianMobileNo: value,
      Height: value,
      JoinDate: value,
      MobileNo: value,
      MotherName: value,
      MotherOccupation: value,
      Nationality: value,
      PermanentAddress: value,
      PreviousSchoolName: value,
      PupilName: value,
      PupilStatus: value,
      PupilTypeName: value,
      Religion: value,
      Remarks: value,
      RollNo: value,
      SectionName: value,
      Weight: value,
      SelectAll: value
    }
  }


  getPupilList() {
    if (this.FilterObjForm.invalid) {
      this.toastr.error("Session is required!!");
      return;
    }
    this.FilterObj.FromDate = this.loadDataService.loadDateYMD(this.FilterObj.FromDateString);
    this.FilterObj.ToDate = this.loadDataService.loadDateYMD(this.FilterObj.ToDateString);
    var obj: RequestModel = {
      request: this.localService.encrypt(JSON.stringify(this.FilterObj))
    };
    this.dataLoading = true
    this.service.getPupilList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.PupilList = response.PupilList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false;
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  deletePupil(pupilAdmission: any, index: number) {
    if (confirm("Are your sure you want to delete this recored")) {
      var obj: RequestModel = {
        request: this.localService.encrypt(pupilAdmission.PupilAdmissionId)
      }
      this.dataLoading = true;
      this.service.deletePupil(obj).subscribe(r1 => {
        let response = r1 as any
        if (response.Message == ConstantData.SuccessMessage) {
          this.toastr.success("Record Deleted successfully");
          // this.getPupilList();
          this.PupilList = this.PupilList.filter(x => x.PupilAdmission.PupilAdmissionId != pupilAdmission.PupilAdmissionId);
          // this.PupilList.splice(index,1);
        } else {
          this.toastr.error(response.Message)
        }
        this.dataLoading = false;
      }, (err => {
        this.toastr.error("Error occured while deleteing the recored")
        this.dataLoading = false;
      }))
    }
  }

  editRecord(obj: any) {
    this.router.navigate(['/admin/new-admission/' + this.loadDataService.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(obj)))]);
  }

  getPupilTypeList() {
    var obj = {}
    this.dataLoading = true
    this.service.getPupilTypeList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.PupilTypeList = response.PupilTypeList;

      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = false;
    }))
  }

  onClassChange() {
    this.SectionList = this.AllSectionList.filter(x => x.ClassId == this.FilterObj.ClassId);
    this.FilterObj.SectionId = 0;
    // if (this.SectionList2.length > 0)
    //   this.FilterObj.SectionId = this.SectionList2[0].SectionId;
  }

  getSectionList() {
    var obj = {}
    this.dataLoading = true
    this.service.getSectionList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.AllSectionList = response.SectionList;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  getSessionList() {
    var obj = {}
    this.dataLoading = true
    this.service.getSessionList(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.SessionList = response.SessionList;
        this.FilterObj.SessionId = this.SessionList[0].SessionId;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
      this.dataLoading = true
    }))
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
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  printPupilList(docType: number, isPrint: boolean) {
    this.FilterObj.IsPrint = isPrint;
    this.FilterObj.docType = docType;
    this.FilterObj.FromDate = this.loadDataService.loadDateYMD(this.FilterObj.FromDateString);
    this.FilterObj.ToDate = this.loadDataService.loadDateYMD(this.FilterObj.ToDateString);
    this.service.printPupilList(this.loadDataService.replaceSpecialCharacter(this.localService.encrypt(JSON.stringify(this.FilterObj))));
  }

  @ViewChild('table_1') table_1: ElementRef;
  isExporting: boolean = false;
  exportToExcel() {
    this.isExporting = true;
    var itemPerPage = this.itemPerPage;
    var p = this.p;
    this.p = 1;
    this.itemPerPage = this.PupilList.length;
    setTimeout(() => {
      this.loadDataService.exportToExcel(this.table_1, "Pupil List " + this.loadDataService.loadDateTime(new Date()));
      this.itemPerPage = itemPerPage;
      this.p = p;
      this.isExporting = false;
    }, 1000);

  }

  school: SchoolModel = {} as SchoolModel;
  getSchool() {
    var obj = {}
    this.dataLoading = true
    this.service.getSchool(obj).subscribe(r1 => {
      let response = r1 as any
      if (response.Message == ConstantData.SuccessMessage) {
        this.school = response.School;
      } else {
        this.toastr.error(response.Message)
      }
      this.dataLoading = false
    }, (err => {
      this.toastr.error("Error while fetching records")
    }))
  }

  //PDF MAKE
  @ViewChild('formPdfSetting') formPdfSetting: NgForm;
  pdfSetting: PdfSettingModel = {
    pageMargins: 10,
    fontSize: 8,
    pageOrientation: 'landscape',
    pageSize: 'A4',
    userPassword: '',
    commandType: CommandType.Print
  };
  predefinedPageSizes = PdfUtils.predefinedPageSize;
  pageOrientations = PdfUtils.pageOrientations;
  // pageOrientationList:any[] = this.loadDataService.GetEnumList(PredefinedPageSize); 
  documentDefinition: TDocumentDefinitions;
  openPdfSetting(no: number) {
    this.pdfSetting.commandType = no;
    $('#modal_pdf_setting').modal('show');
  };
  async generatePdf() {
    if (this.formPdfSetting.invalid) {
      this.toastr.error(ConstantData.formInvalidMessage);
      return;
    }
    // const imageUrl = 'assets/img/profile-img.jpg'; // Replace with your image URL
    // // const imageUrl = `${ConstantData.getBaseUrl()}${this.school.LogoPng}`; // Replace with your image URL
    // const imageBase64 = await this.getBase64FromUrl(imageUrl);
    if (this.FilterObj.SessionId == 0)
      this.FilterObj.SessionName = 'All';
    else
      this.FilterObj.SessionName = this.SessionList.find(x => x.SessionId == this.FilterObj.SessionId).SessionName;

    if (this.FilterObj.ClassId == 0)
      this.FilterObj.ClassName = 'All';
    else
      this.FilterObj.ClassName = this.ClassList.find(x => x.ClassId == this.FilterObj.ClassId).ClassName;

    if (this.FilterObj.SectionId == 0)
      this.FilterObj.SectionName = 'All';
    else
      this.FilterObj.SectionName = this.SectionList.find(x => x.SectionId == this.FilterObj.SectionId).SectionName;

    if (this.FilterObj.AdmissionType == 0)
      this.FilterObj.AdmissionTypeName = 'All';
    else
      this.FilterObj.AdmissionTypeName = this.AllAdmissionTypeList[this.FilterObj.AdmissionType];
    if (this.FilterObj.PupilTypeId == 0)
      this.FilterObj.PupilTypeName = 'All';
    else
      this.FilterObj.PupilTypeName = this.PupilTypeList.find(x => x.PupilTypeId == this.FilterObj.PupilTypeId).PupilTypeName;
    var selectedFields: FieldSelectionModel[] = [
      { key: 'index', isShow: true, title: '#' },
      { key: 'AdmissionNo', isShow: this.pupilValidation.AdmissionNo, title: 'Admission No' },
      { key: 'PupilName', isShow: this.pupilValidation.PupilName, title: 'Pupil Name' },
      { key: 'ClassName', isShow: this.pupilValidation.ClassName, title: 'Class' },
      { key: 'SectionName', isShow: this.pupilValidation.SectionName, title: 'Section' },
      { key: 'RollNo', isShow: this.pupilValidation.RollNo, title: 'Roll No' },
      { key: 'FatherName', isShow: this.pupilValidation.FatherName, title: "Father's Name" },
      { key: 'MotherName', isShow: this.pupilValidation.MotherName, title: "Mother's Name" },
      { key: 'DOB', isShow: this.pupilValidation.DOB, title: 'DOB' },
      { key: 'Gender', isShow: this.pupilValidation.Gender, title: 'Gender' },
      { key: 'Category', isShow: this.pupilValidation.Category, title: 'Category' },
      { key: 'BloodGroup', isShow: this.pupilValidation.BloodGroup, title: 'Blood Group' },
      { key: 'Religion', isShow: this.pupilValidation.Religion, title: 'Religion' },
      { key: 'Nationality', isShow: this.pupilValidation.Nationality, title: 'Nationality' },
      { key: 'MobileNo', isShow: this.pupilValidation.MobileNo, title: 'Mobile No' },
      { key: 'AlternateNo', isShow: this.pupilValidation.AlternateNo, title: 'Alternate No' },
      { key: 'Email', isShow: this.pupilValidation.Email, title: 'Email' },
      { key: 'AadhaarNo', isShow: this.pupilValidation.AadhaarNo, title: 'Aadhaar No' },
      { key: 'Height', isShow: this.pupilValidation.Height, title: 'Height' },
      { key: 'Weight', isShow: this.pupilValidation.Weight, title: 'Weight' },
      { key: 'FatherOccupation', isShow: this.pupilValidation.FatherOccupation, title: "Father's Occupation" },
      { key: 'MotherOccupation', isShow: this.pupilValidation.MotherOccupation, title: "Mother's Occupation" },
      { key: 'FamilyAnnualIncome', isShow: this.pupilValidation.FamilyAnnualIncome, title: 'Family Annual Income' },
      { key: 'GuardianMobileNo', isShow: this.pupilValidation.GuardianMobileNo, title: "Guardian's Mobile No" },
      { key: 'CorrespondenceAddress', isShow: this.pupilValidation.CorrespondenceAddress, title: 'Correspondence Address' },
      { key: 'CorrespondenceCityName', isShow: this.pupilValidation.CorrespondenceAddress, title: 'City' },
      { key: 'CorrespondenceStateName', isShow: this.pupilValidation.CorrespondenceAddress, title: 'State' },
      { key: 'CorrespondencePinCode', isShow: this.pupilValidation.CorrespondenceAddress, title: 'Pin Code' },
      { key: 'PermanentAddress', isShow: this.pupilValidation.PermanentAddress, title: 'Permanent Address' },
      { key: 'PermanentCityName', isShow: this.pupilValidation.PermanentAddress, title: 'City' },
      { key: 'PermanentStateName', isShow: this.pupilValidation.PermanentAddress, title: 'State' },
      { key: 'PermanentPinCode', isShow: this.pupilValidation.PermanentAddress, title: 'Pin Code' },
      { key: 'PreviousSchoolName', isShow: this.pupilValidation.PreviousSchoolName, title: 'Previous School' },
      { key: 'PreviousSchoolBoard', isShow: this.pupilValidation.PreviousSchoolName, title: 'Board' },
      { key: 'PreviousSchoolClass', isShow: this.pupilValidation.PreviousSchoolName, title: 'Class' },
      { key: 'PreviousSchoolMedium', isShow: this.pupilValidation.PreviousSchoolName, title: 'Medium' },
      { key: 'PreviousSchoolTCNo', isShow: this.pupilValidation.PreviousSchoolName, title: 'TC No' },
      { key: 'PreviousSchoolTCDate', isShow: this.pupilValidation.PreviousSchoolName, title: 'TC Date' },
      { key: 'Remarks', isShow: this.pupilValidation.Remarks, title: 'Remarks' },
      { key: 'PupilTypeName', isShow: this.pupilValidation.PupilTypeName, title: 'Category' },
      { key: 'AdmissionType', isShow: this.pupilValidation.AdmissionType, title: 'Admission Type' },
      { key: 'AdmissionDate', isShow: this.pupilValidation.AdmissionDate, title: 'Admission Date' },
      { key: 'JoinDate', isShow: this.pupilValidation.JoinDate, title: 'Join Date' },
      { key: 'PupilStatus', isShow: this.pupilValidation.PupilStatus, title: 'Status' },
    ];
    selectedFields = selectedFields.filter(x => x.isShow);
    const widths = selectedFields.map((x) => x.key === 'PupilName' ? '*' : 'auto');
    const body = [
      selectedFields.filter(x => x.isShow).map((field) => ({ text: field.title, bold: true, fontSize: this.pdfSetting.fontSize, })),
      ...this.PupilList.map((student, index) =>
        selectedFields.map((field) => {
          if (field.key === 'index') {
            return { text: index + 1, fontSize: this.pdfSetting.fontSize, };
          } else if (field.key === 'DOB' || field.key === 'AdmissionDate' || field.key === 'JoinDate' || field.key === 'PreviousSchoolTCDate') {
            if (student[field.key])
              return { text: this.loadDataService.loadDateDMY(student[field.key]), fontSize: this.pdfSetting.fontSize, };
            else if (student.PupilAdmission[field.key])
              return { text: this.loadDataService.loadDateDMY(student.PupilAdmission[field.key]), fontSize: this.pdfSetting.fontSize, };
            else
              return '';
          } else if (field.key === 'Gender') {
            if (student[field.key])
              return { text: this.AllGenderList[student[field.key]], fontSize: this.pdfSetting.fontSize, };
            else
              return '';
          } else if (field.key === 'Category') {
            if (student[field.key])
              return { text: this.AllCategoryList[student[field.key]], fontSize: this.pdfSetting.fontSize, };
            else
              return '';
          } else if (field.key === 'BloodGroup') {
            if (student[field.key])
              return { text: this.AllBloodGroupList[student[field.key]], fontSize: this.pdfSetting.fontSize, };
            else
              return '';
          } else if (field.key === 'Religion') {
            if (student[field.key])
              return { text: this.AllReligionList[student[field.key]], fontSize: this.pdfSetting.fontSize, };
            else
              return '';
          } else if (field.key === 'Nationality') {
            if (student[field.key])
              return { text: this.AllNationalityList[student[field.key]], fontSize: this.pdfSetting.fontSize, };
            else
              return '';
          } else if (field.key === 'AdmissionType') {
            if (student[field.key])
              return { text: this.AllAdmissionTypeList[student.PupilAdmission[field.key]], fontSize: this.pdfSetting.fontSize, };
            else
              return '';
          } else if (field.key === 'PupilStatus') {
            if (student[field.key])
              return { text: this.AllPupilStatusList[student[field.key]], fontSize: this.pdfSetting.fontSize, };
            else
              return '';
          }
          else {
            if (student[field.key])
              return { text: student[field.key], fontSize: this.pdfSetting.fontSize, };
            else if (student.PupilAdmission[field.key])
              return { text: student.PupilAdmission[field.key], fontSize: this.pdfSetting.fontSize, };
            else
              return '';
          }
        })
      ),
    ];


    this.documentDefinition = {
      pageMargins: this.pdfSetting.pageMargins,
      pageOrientation: this.pdfSetting.pageOrientation,
      pageSize: this.pdfSetting.pageSize,
      userPassword: this.pdfSetting.userPassword,
      // watermark: {
      //   text: 'CONFIDENTIAL',
      //   color: 'blue', // Color of the watermark text
      //   opacity: 0.1,  // Transparency level (0 to 1)
      //   bold: true,
      //   italics: false,
      //   fontSize: 60,  // Font size of the watermark
      //   angle: 45,     // Angle of rotation in degrees
      // },
      background: (currentPage: number, pageSize: any) => {
        return {
          image: ConstantData.getImageBase64() + this.school.LogoPngBase64,
          width: 300, // Adjust size of the watermark
          opacity: 0.2, // Transparency level
          absolutePosition: {
            x: (pageSize.width - 300) / 2, // Center horizontally
            y: (pageSize.height - 300) / 2, // Center vertically
          },
        };
      },
      info: {
        title: this.title,
        author: ConstantData.DevelopedBy,
        subject: this.title,
        keywords: 'Student, Pupil',
        creator: ConstantData.DevelopedBy,
        creationDate: new Date(),
      },
      content: [
        {
          columns: [
            {
              image: ConstantData.getImageBase64() + this.school.LogoPngBase64,
              width: 80,
            },
            {
              stack: [
                { text: this.school.SchoolName, style: 'head', },
                { text: this.school.AffiliationDetail, style: 'subhead', },
                { text: this.school.FullAddress, style: 'schoolAddress', },
                { text: `Phone No.: ${this.school.MobileNo}, ${this.school.AlternateNo}`, style: 'schoolAddress', },
                { text: `Email : ${this.school.Email}`, style: 'schoolAddress', },
                { text: `Website : ${this.school.WebsiteUrl}`, style: 'schoolAddress', },
              ],
              width: '60%',
            },
            {
              stack: [
                { text: "STUDENT LIST", style: 'headRight' },
                { text: `Session : ${this.FilterObj.SessionName}`, style: 'detailRight' },
                { text: `Class : ${this.FilterObj.ClassName}, Section : ${this.FilterObj.SectionName}`, style: 'detailRight' },
                { text: `Admission Type : ${this.FilterObj.AdmissionTypeName}`, style: 'detailRight' },
                { text: `Pupil Type : ${this.FilterObj.PupilTypeName}`, style: 'detailRight' },
                { text: `From Date : ${this.FilterObj.FromDateString ? this.loadDataService.loadDateDMY(this.FilterObj.FromDateString) : 'All'}, To Date : ${this.FilterObj.ToDateString ? this.loadDataService.loadDateDMY(this.FilterObj.ToDateString) : 'All'}`, style: 'detailRight' },
              ],
            },

          ],
          columnGap: 10,
        },
        {
          table: {
            headerRows: 1,
            widths: widths,
            body: body,
          },
          margin: [0, 10, 0, 0],
        },

      ],
      styles: {
        head: { fontSize: 18, bold: true, font: 'Calibri' },
        subhead: { fontSize: 10, bold: true },
        schoolAddress: { fontSize: 10 },
        headRight: { fontSize: 16, bold: true, alignment: 'right' },
        detailRight: { fontSize: 10, alignment: 'right' },
        tableHead: { bold: true },
      },
      defaultStyle,
    };
    if (this.pdfSetting.commandType == CommandType.Print)
      pdfMake.createPdf(this.documentDefinition).print();
    else if (this.pdfSetting.commandType == CommandType.Download)
      pdfMake.createPdf(this.documentDefinition).download(this.title)
    else if (this.pdfSetting.commandType == CommandType.Preview)
      pdfMake.createPdf(this.documentDefinition).open();
    $('#modal_pdf_setting').modal('hide');

  }



}
