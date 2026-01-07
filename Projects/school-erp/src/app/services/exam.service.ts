import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantData } from '../utils/constant-data';
import { LoadDataService } from '../utils/load-data.service';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private readonly examUrl: string = ConstantData.getExamApiUrl();
  private readonly headers: HttpHeaders = new HttpHeaders({ 'AppKey': ConstantData.getExamKey() });

  constructor(private http: HttpClient,
    private loadData: LoadDataService) {
  }
  printRankerList(id: string) {
    window.open(ConstantData.getBaseUrl() + "report/RankerList?id=" + this.loadData.replaceSpecialCharacter(id));
  }
  printCrossReportTerm(id: string) {
    window.open(ConstantData.getBaseUrl() + "report/CrossReportTerm?id=" + this.loadData.replaceSpecialCharacter(id));
  }

  printMarksheet(id: string) {
    window.open(ConstantData.getBaseUrl() + "report/marksheet?id=" + this.loadData.replaceSpecialCharacter(id));
  }

  printAdmitCard(id: string) {
    window.open(ConstantData.getBaseUrl() + "report/admitcard?id=" + this.loadData.replaceSpecialCharacter(id));
  }

  //Marksheet
  getMarksheetList(obj: any) {
    return this.http.post(this.examUrl + "Marksheet/MarksheetList", obj, { headers: this.headers })
  }
  generateMarksheet(obj: any) {
    return this.http.post(this.examUrl + "Marksheet/GenerateMarksheet", obj, { headers: this.headers })
  }

  //TeacherRemark
  getEntryTeacherRemarkList(obj: any) {
    return this.http.post(this.examUrl + "TeacherRemark/EntryTeacherRemarkList", obj, { headers: this.headers })
  }
  saveTeacherRemark(obj: any) {
    return this.http.post(this.examUrl + "TeacherRemark/saveTeacherRemark", obj, { headers: this.headers })
  }

  //PupilAttendance
  getEntryPupilAttendanceList(obj: any) {
    return this.http.post(this.examUrl + "PupilAttendance/EntryPupilAttendanceList", obj, { headers: this.headers })
  }
  savePupilAttendance(obj: any) {
    return this.http.post(this.examUrl + "PupilAttendance/savePupilAttendance", obj, { headers: this.headers })
  }

  //WorkingDay
  getEntryWorkingDayList(obj: any) {
    return this.http.post(this.examUrl + "WorkingDay/EntryWorkingDayList", obj, { headers: this.headers })
  }
  saveWorkingDay(obj: any) {
    return this.http.post(this.examUrl + "WorkingDay/saveWorkingDay", obj, { headers: this.headers })
  }

  //PupilGrade
  getEntryPupilGradeList(obj: any) {
    return this.http.post(this.examUrl + "PupilGrade/EntryPupilGradeList", obj, { headers: this.headers })
  }
  savePupilGrade(obj: any) {
    return this.http.post(this.examUrl + "PupilGrade/savePupilGrade", obj, { headers: this.headers })
  }

  //Grade
  getGradeList(obj: any) {
    return this.http.post(this.examUrl + "Grade/GradeList", obj, { headers: this.headers })
  }

  //GradingScale
  getGradingScaleList(obj: any) {
    return this.http.post(this.examUrl + "GradingScale/GradingScaleList", obj, { headers: this.headers })
  }

  //SubjectGradingScale
  getSubjectGradingScaleList(obj: any) {
    return this.http.post(this.examUrl + "SubjectGradingScale/SubjectGradingScaleList", obj, { headers: this.headers })
  }
  getEntrySubjectGradingScaleList(obj: any) {
    return this.http.post(this.examUrl + "SubjectGradingScale/EntrySubjectGradingScaleList", obj, { headers: this.headers })
  }
  saveSubjectGradingScale(obj: any) {
    return this.http.post(this.examUrl + "SubjectGradingScale/saveSubjectGradingScale", obj, { headers: this.headers })
  }

  //GradingSystem
  getGradingSystemList(obj: any) {
    return this.http.post(this.examUrl + "GradingSystem/GradingSystemList", obj, { headers: this.headers })
  }

  saveGradingSystem(obj: any) {
    return this.http.post(this.examUrl + "GradingSystem/saveGradingSystem", obj, { headers: this.headers })
  }

  deleteGradingSystem(obj: any) {
    return this.http.post(this.examUrl + "GradingSystem/deleteGradingSystem", obj, { headers: this.headers })
  }
  //Weightage
  getWeightageList(obj: any) {
    return this.http.post(this.examUrl + "Weightage/WeightageList", obj, { headers: this.headers })
  }
  getEntryWeightageList(obj: any) {
    return this.http.post(this.examUrl + "Weightage/EntryWeightageList", obj, { headers: this.headers })
  }
  saveWeightage(obj: any) {
    return this.http.post(this.examUrl + "Weightage/saveWeightage", obj, { headers: this.headers })
  }

  //PupilMark
  getEntryPupilMarkList(obj: any) {
    return this.http.post(this.examUrl + "PupilMark/EntryPupilMarkList", obj, { headers: this.headers })
  }
  savePupilMark(obj: any) {
    return this.http.post(this.examUrl + "PupilMark/savePupilMark", obj, { headers: this.headers })
  }


  //SubjectNo
  getSubjectNoList(obj: any) {
    return this.http.post(this.examUrl + "SubjectNo/SubjectNoList", obj, { headers: this.headers })
  }


  //PupilSubject
  getPupilSubjectList(obj: any) {
    return this.http.post(this.examUrl + "PupilSubject/PupilSubjectList", obj, { headers: this.headers })
  }
  savePupilSubject(obj: any) {
    return this.http.post(this.examUrl + "PupilSubject/savePupilSubject", obj, { headers: this.headers })
  }


  //FullMark
  getFullMarkList(obj: any) {
    return this.http.post(this.examUrl + "FullMark/FullMarkList", obj, { headers: this.headers })
  }
  getEntryFullMarkList(obj: any) {
    return this.http.post(this.examUrl + "FullMark/EntryFullMarkList", obj, { headers: this.headers })
  }
  saveFullMark(obj: any) {
    return this.http.post(this.examUrl + "FullMark/saveFullMark", obj, { headers: this.headers })
  }

  //ClassExam
  getClassExamList(obj: any) {
    return this.http.post(this.examUrl + "ClassExam/ClassExamList", obj, { headers: this.headers })
  }

  saveClassExam(obj: any) {
    return this.http.post(this.examUrl + "ClassExam/saveClassExam", obj, { headers: this.headers })
  }

  saveClassExamList(obj: any) {
    return this.http.post(this.examUrl + "ClassExam/saveClassExamList", obj, { headers: this.headers })
  }

  deleteClassExam(obj: any) {
    return this.http.post(this.examUrl + "ClassExam/deleteClassExam", obj, { headers: this.headers })
  }

  //GradeGroup
  getGradeGroupList(obj: any) {
    return this.http.post(this.examUrl + "GradeGroup/GradeGroupList", obj, { headers: this.headers })
  }

  saveGradeGroup(obj: any) {
    return this.http.post(this.examUrl + "GradeGroup/saveGradeGroup", obj, { headers: this.headers })
  }

  deleteGradeGroup(obj: any) {
    return this.http.post(this.examUrl + "GradeGroup/deleteGradeGroup", obj, { headers: this.headers })
  }

  //Exam
  getExamList(obj: any) {
    return this.http.post(this.examUrl + "Exam/ExamList", obj, { headers: this.headers })
  }

  saveExam(obj: any) {
    return this.http.post(this.examUrl + "Exam/saveExam", obj, { headers: this.headers })
  }

  deleteExam(obj: any) {
    return this.http.post(this.examUrl + "Exam/deleteExam", obj, { headers: this.headers })
  }

  //ExamType
  getExamTypeList(obj: any) {
    return this.http.post(this.examUrl + "ExamType/ExamTypeList", obj, { headers: this.headers })
  }

  saveExamType(obj: any) {
    return this.http.post(this.examUrl + "ExamType/saveExamType", obj, { headers: this.headers })
  }

  //Subject
  getSubjectList(obj: any) {
    return this.http.post(this.examUrl + "Subject/SubjectList", obj, { headers: this.headers })
  }

  saveSubject(obj: any) {
    return this.http.post(this.examUrl + "Subject/saveSubject", obj, { headers: this.headers })
  }

  deleteSubject(obj: any) {
    return this.http.post(this.examUrl + "Subject/deleteSubject", obj, { headers: this.headers })
  }

  //ClassSubject
  getClassSubjectList(obj: any) {
    return this.http.post(this.examUrl + "ClassSubject/ClassSubjectList", obj, { headers: this.headers })
  }

  saveClassSubject(obj: any) {
    return this.http.post(this.examUrl + "ClassSubject/saveClassSubject", obj, { headers: this.headers })
  }

  saveClassSubjectList(obj: any) {
    return this.http.post(this.examUrl + "ClassSubject/saveClassSubjectList", obj, { headers: this.headers })
  }

  deleteClassSubject(obj: any) {
    return this.http.post(this.examUrl + "ClassSubject/deleteClassSubject", obj, { headers: this.headers })
  }

  //AdmitCard
  getPupilAdmitCardList(obj: any) {
    return this.http.post(this.examUrl + "AdmitCard/PupilAdmitCardList", obj, { headers: this.headers })
  }

  getAdmitCardDetail(obj: any) {
    return this.http.post(this.examUrl + "AdmitCard/AdmitCardDetail", obj, { headers: this.headers })
  }

  getAdmitCardList(obj: any) {
    return this.http.post(this.examUrl + "AdmitCard/AdmitCardList", obj, { headers: this.headers })
  }

  saveAdmitCard(obj: any) {
    return this.http.post(this.examUrl + "AdmitCard/saveAdmitCard", obj, { headers: this.headers })
  }

  deleteAdmitCard(obj: any) {
    return this.http.post(this.examUrl + "AdmitCard/deleteAdmitCard", obj, { headers: this.headers })
  }
}
