import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstantData } from '../utils/constant-data';
import { LoadDataService } from '../utils/load-data.service';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private readonly certificateUrl: string = ConstantData.getCertificateApiUrl();
  private readonly headers: HttpHeaders = new HttpHeaders({ 'AppKey': ConstantData.getAdminKey() });

  constructor(private http: HttpClient,
    private loadData: LoadDataService) {
  }

  printTransferCertificate(id: any) {
    window.open(ConstantData.getBaseUrl() + "report/transferCertificate/" + id);
  }
  printCharacterCertificate(id: any) {
    window.open(ConstantData.getBaseUrl() + "report/characterCertificate/" + id);
  }
  
  printTrainingCertificate(id: any) {
    window.open(ConstantData.getBaseUrl() + "report/trainingCertificate/" + id);
  }
  //TransferCertificate
  getPupilListForTransferCertificate(obj: any) {
    return this.http.post(this.certificateUrl + "TransferCertificate/PupilListForTransferCertificate", obj, { headers: this.headers })
  }

  getPupilDetailForTransferCertificate(obj: any) {
    return this.http.post(this.certificateUrl + "TransferCertificate/PupilDetailForTransferCertificate", obj, { headers: this.headers })
  }

  getTransferCertificateList(obj: any) {
    return this.http.post(this.certificateUrl + "TransferCertificate/TransferCertificateList", obj, { headers: this.headers })
  }

  saveTransferCertificate(obj: any) {
    return this.http.post(this.certificateUrl + "TransferCertificate/saveTransferCertificate", obj, { headers: this.headers })
  }

  deleteTransferCertificate(obj: any) {
    return this.http.post(this.certificateUrl + "TransferCertificate/deleteTransferCertificate", obj, { headers: this.headers })
  }

  //CharacterCertificate
  getPupilListForCharacterCertificate(obj: any) {
    return this.http.post(this.certificateUrl + "CharacterCertificate/PupilListForCharacterCertificate", obj, { headers: this.headers })
  }

  getCharacterCertificateList(obj: any) {
    return this.http.post(this.certificateUrl + "CharacterCertificate/CharacterCertificateList", obj, { headers: this.headers })
  }

  saveCharacterCertificate(obj: any) {
    return this.http.post(this.certificateUrl + "CharacterCertificate/saveCharacterCertificate", obj, { headers: this.headers })
  }

  deleteCharacterCertificate(obj: any) {
    return this.http.post(this.certificateUrl + "CharacterCertificate/deleteCharacterCertificate", obj, { headers: this.headers })
  }

  //TrainingCertificate
  getTrainingCertificateList(obj: any) {
    return this.http.post(this.certificateUrl + "TrainingCertificate/TrainingCertificateList", obj, { headers: this.headers })
  }

  saveTrainingCertificate(obj: any) {
    return this.http.post(this.certificateUrl + "TrainingCertificate/saveTrainingCertificate", obj, { headers: this.headers })
  }

  deleteTrainingCertificate(obj: any) {
    return this.http.post(this.certificateUrl + "TrainingCertificate/deleteTrainingCertificate", obj, { headers: this.headers })
  }

}
